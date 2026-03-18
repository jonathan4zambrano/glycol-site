import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import type {
  GlycolReading,
  GlycolApiResponse,
} from "@/app/types/glycol";

/* ------------------------------------------------------------------
 * Upstash Redis — persistent store for simulator readings.
 * Works both locally and on Vercel (serverless).
 * ------------------------------------------------------------------ */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const REDIS_KEY = "glycol:readings";
const MAX_STORED_READINGS = 200;

/* ------------------------------------------------------------------
 * POST  /api/glycol
 * Called by the simulator with:
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

    // Push to front of Redis list (newest first)
    await redis.lpush(REDIS_KEY, JSON.stringify(reading));

    // Trim to max size
    await redis.ltrim(REDIS_KEY, 0, MAX_STORED_READINGS - 1);

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
 * Returns simulator readings from Redis.
 * The dashboard polls this every 15 seconds.
 * ------------------------------------------------------------------ */
export async function GET() {
  try {
    const raw = await redis.lrange(REDIS_KEY, 0, MAX_STORED_READINGS - 1);

    const readings: GlycolReading[] = raw.map((item) => {
      if (typeof item === "string") return JSON.parse(item);
      return item as GlycolReading;
    });

    const latest = readings[0] ?? null;
    const deviceOnline = latest
      ? Date.now() - new Date(latest.timestamp).getTime() < 60 * 60 * 1000
      : false;

    return NextResponse.json<GlycolApiResponse>({
      latest,
      history: readings,
      deviceOnline,
    });
  } catch (err) {
    return NextResponse.json<GlycolApiResponse>(
      { latest: null, history: [], deviceOnline: false, error: `Redis error: ${err}` },
      { status: 500 }
    );
  }
}
