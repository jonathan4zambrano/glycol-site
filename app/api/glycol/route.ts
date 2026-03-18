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
 * NOTE: Calibration is done on the Pico Pi (estimate_concentration).
 * The value arriving from nRF Cloud is already in PPM — no conversion needed.
 * ------------------------------------------------------------------ */

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
 * Merges bridge readings (simulator) + nRF Cloud readings (real sensor)
 * into a single sorted history. The dashboard polls this every 15 s.
 * ------------------------------------------------------------------ */
export async function GET() {
  let cloudReadings: GlycolReading[] = [];

  // Always try to fetch from nRF Cloud
  const apiKey = process.env.NRF_CLOUD_API_KEY;

  if (apiKey && apiKey !== "your-api-key-here") {
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
        cache: "no-store",
      });

      if (res.ok) {
        const data: NrfCloudMessagesResponse = await res.json();

        cloudReadings = (data.items ?? [])
          .filter(
            (item) =>
              item.message?.appId === "GLYCOL" &&
              item.message?.data?.concentration_pct != null
          )
          .map((item) => ({
            concentration_pct: item.message.data.concentration_pct,
            timestamp: item.message.ts
              ? new Date(item.message.ts).toISOString()
              : item.receivedAt,
            receivedAt: item.receivedAt,
          }));
      }
    } catch {
      // nRF Cloud fetch failed; continue with bridge data only
    }
  }

  // Merge bridge + cloud readings, sort newest first, deduplicate by timestamp
  const allReadings = [...bridgeReadings, ...cloudReadings]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 200);

  const latest = allReadings[0] ?? null;
  const deviceOnline = latest
    ? Date.now() - new Date(latest.timestamp).getTime() < 60 * 60 * 1000
    : false;

  return NextResponse.json<GlycolApiResponse>({
    latest,
    history: allReadings,
    deviceOnline,
  });
}
