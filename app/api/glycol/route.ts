import { NextResponse } from "next/server";
import type {
  GlycolReading,
  NrfCloudMessagesResponse,
  GlycolApiResponse,
} from "@/app/types/glycol";

// nRF9160 DK device ID (reads glycol data from Pico Pi via UART1)
// Previously this was the Thingy:91 X UUID. Updated to the DK's
// internal modem UUID after provisioning.
const DEVICE_ID = "50303856-3435-4265-8041-1f0b8677e06f";
const NRF_CLOUD_BASE = "https://api.nrfcloud.com/v1";

/* ------------------------------------------------------------------
 * Calibration curve (averaged from two measurement sets).
 * Maps Pico sensor current (µA) → glycol concentration (ppm).
 * Table is sorted descending by µA (higher current = lower concentration).
 * ------------------------------------------------------------------ */
const CALIBRATION_TABLE = [
  { uA: 41.48, ppm: 0 },
  { uA: 36.56, ppm: 50 },
  { uA: 25.95, ppm: 100 },
  { uA: 18.50, ppm: 150 },
  { uA: 11.21, ppm: 200 },
  { uA: 5.70, ppm: 250 },
];

/**
 * Convert raw sensor current (µA) to concentration (ppm) using
 * linear interpolation on the averaged calibration table.
 */
function uaToPpm(uA: number): number {
  if (uA >= CALIBRATION_TABLE[0].uA) return 0;
  if (uA <= CALIBRATION_TABLE[CALIBRATION_TABLE.length - 1].uA) return 260;

  for (let i = 0; i < CALIBRATION_TABLE.length - 1; i++) {
    const high = CALIBRATION_TABLE[i];
    const low = CALIBRATION_TABLE[i + 1];
    if (uA <= high.uA && uA >= low.uA) {
      const ratio = (high.uA - uA) / (high.uA - low.uA);
      return Math.round(high.ppm + ratio * (low.ppm - high.ppm));
    }
  }
  return 0;
}

/* ------------------------------------------------------------------
 * In-memory store for readings POSTed by the bridge script.
 * Keeps the last 200 readings. Resets when the server restarts.
 * ------------------------------------------------------------------ */
const MAX_STORED_READINGS = 200;
const bridgeReadings: GlycolReading[] = [];

/* ------------------------------------------------------------------
 * POST  /api/glycol
 * Called by the Python bridge script with:
 *   { "concentration_pct": 42.8, "timestamp": "2026-03-15T..." }
 * ------------------------------------------------------------------ */
export async function POST(request: Request) {
  // Verify bridge secret
  const secret = process.env.BRIDGE_API_SECRET;
  if (secret) {
    const provided = request.headers.get("X-Bridge-Secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const { concentration_pct, timestamp } = body;

    if (typeof concentration_pct !== "number") {
      return NextResponse.json(
        { error: "Missing or invalid concentration_pct" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const reading: GlycolReading = {
      concentration_pct,
      timestamp: timestamp || now,
      receivedAt: now,
    };

    // Add to front of array (newest first)
    bridgeReadings.unshift(reading);

    // Trim to max size
    if (bridgeReadings.length > MAX_STORED_READINGS) {
      bridgeReadings.length = MAX_STORED_READINGS;
    }

    return NextResponse.json({ ok: true, reading });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

/* ------------------------------------------------------------------
 * GET  /api/glycol
 * Returns readings from bridge (primary) or nRF Cloud (fallback).
 * The dashboard polls this every 15 seconds.
 * ------------------------------------------------------------------ */
export async function GET() {
  // If we have bridge readings, use those (preferred path)
  if (bridgeReadings.length > 0) {
    const latest = bridgeReadings[0];
    const deviceOnline =
      Date.now() - new Date(latest.timestamp).getTime() < 5 * 60 * 1000;

    return NextResponse.json<GlycolApiResponse>({
      latest,
      history: bridgeReadings.slice(0, 100),
      deviceOnline,
    });
  }

  // Fallback: fetch from nRF Cloud (original path)
  const apiKey = process.env.NRF_CLOUD_API_KEY;

  if (!apiKey || apiKey === "your-api-key-here") {
    return NextResponse.json<GlycolApiResponse>(
      { latest: null, history: [], deviceOnline: false, error: "No data available" },
      { status: 200 }
    );
  }

  try {
    const url = new URL(`${NRF_CLOUD_BASE}/messages`);
    url.searchParams.set("deviceId", DEVICE_ID);
    url.searchParams.set("appId", "GLYCOL");
    url.searchParams.set("pageLimit", "100");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: { revalidate: 15 },
    });

    if (!res.ok) {
      return NextResponse.json<GlycolApiResponse>(
        { latest: null, history: [], deviceOnline: false, error: `nRF Cloud error: ${res.status}` },
        { status: 502 }
      );
    }

    const data: NrfCloudMessagesResponse = await res.json();

    const readings: GlycolReading[] = (data.items ?? [])
      .filter(
        (item) =>
          item.message?.appId === "GLYCOL" &&
          item.message?.data?.concentration_pct != null
      )
      .map((item) => ({
        concentration_pct: uaToPpm(item.message.data.concentration_pct),
        timestamp: item.message.ts
          ? new Date(item.message.ts).toISOString()
          : item.receivedAt,
        receivedAt: item.receivedAt,
      }))
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    const latest = readings[0] ?? null;
    const deviceOnline = latest
      ? Date.now() - new Date(latest.timestamp).getTime() < 5 * 60 * 1000
      : false;

    return NextResponse.json<GlycolApiResponse>({
      latest,
      history: readings,
      deviceOnline,
    });
  } catch {
    return NextResponse.json<GlycolApiResponse>(
      { latest: null, history: [], deviceOnline: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
