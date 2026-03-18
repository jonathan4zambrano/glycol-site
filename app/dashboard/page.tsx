"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGlycolData } from "@/app/hooks/useGlycolData";
import type { GlycolReading } from "@/app/types/glycol";

type Hotspot = {
  id: number;
  label: string;
  x: number;
  y: number;
  isLive?: boolean;
  data: {
    temperature: string;
    concentration: number;
    status: string;
    lastUpdated: string;
  };
};

// ── Mock data for stations without real sensors ─────────────
const weeklyData = [
  { day: "Mon", HDF10: 14, B1: 55, F1: 130 },
  { day: "Tue", HDF10: 22, B1: 68, F1: 155 },
  { day: "Wed", HDF10: 18, B1: 72, F1: 175 },
  { day: "Thu", HDF10: 30, B1: 80, F1: 190 },
  { day: "Fri", HDF10: 25, B1: 76, F1: 200 },
  { day: "Sat", HDF10: 12, B1: 50, F1: 140 },
  { day: "Sun", HDF10: 20, B1: 75, F1: 200 },
];

const THRESHOLD = 100; // ppm critical threshold

// ── Helpers ─────────────────────────────────────────────────
function formatTimeAgo(date: Date, currentTime: number): string {
  const seconds = Math.floor((currentTime - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

function buildDailyChartData(history: GlycolReading[]) {
  if (history.length === 0) return [];

  const now = new Date();
  const twentyFourMinAgo = new Date(now.getTime() - 24 * 60 * 1000);

  // Build a map of minute → last ppm value from all history
  const minuteMap = new Map<number, number>(); // key = minute timestamp (floored)
  for (const r of history) {
    const d = new Date(r.timestamp);
    const minTs = new Date(d).setSeconds(0, 0);
    minuteMap.set(minTs, Math.round(r.concentration_pct * 10) / 10);
  }

  // Find the most recent reading at or before the 24-min window to seed the carry-forward value
  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  let lastVal = 0;
  for (const r of sorted) {
    if (new Date(r.timestamp).getTime() <= twentyFourMinAgo.getTime()) {
      lastVal = Math.round(r.concentration_pct * 10) / 10;
    }
  }

  // Fill every minute for the last 24 minutes
  const points: { time: string; HDF10: number }[] = [];
  const cursor = new Date(twentyFourMinAgo);
  cursor.setSeconds(0, 0);
  const endMin = new Date(now);
  endMin.setSeconds(0, 0);

  while (cursor <= endMin) {
    const ts = cursor.getTime();
    if (minuteMap.has(ts)) {
      lastVal = minuteMap.get(ts)!;
    }
    const key = `${cursor.getHours().toString().padStart(2, "0")}:${cursor.getMinutes().toString().padStart(2, "0")}`;
    points.push({ time: key, HDF10: lastVal });
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return points;
}

// ── Icon components ─────────────────────────────────────────
function IconSites() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

export default function DashboardPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const { data: glycolData, loading, error } = useGlycolData();

  const [lastChangedAt, setLastChangedAt] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("hdf10_lastChangedAt");
      return stored ? Number(stored) : null;
    }
    return null;
  });
  const prevConcentration = useRef<number | null>(null);

  // Hydrate the ref from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("hdf10_lastConcentration");
    if (stored !== null) {
      prevConcentration.current = Number(stored);
    }
  }, []);

  // Tick every second so the timer counts up smoothly
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const liveReading = glycolData?.latest;

  // Only reset timer when the concentration value actually changes
  useEffect(() => {
    if (!liveReading) return;
    const currentVal = liveReading.concentration_pct;
    if (prevConcentration.current === null || currentVal !== prevConcentration.current) {
      prevConcentration.current = currentVal;
      const now = Date.now();
      setLastChangedAt(now);
      localStorage.setItem("hdf10_lastChangedAt", String(now));
      localStorage.setItem("hdf10_lastConcentration", String(currentVal));
    }
  }, [liveReading]);

  // Build hotspots — HDF-10 is live, B1 and F1 are mock
  const hotspots: Hotspot[] = [
    {
      id: 1,
      label: "Station HDF-10",
      x: 30,
      y: 38,
      isLive: true,
      data: {
        temperature: "—",
        concentration: liveReading ? Math.round(liveReading.concentration_pct * 10) / 10 : 0,
        status: !liveReading || !glycolData?.deviceOnline
          ? "Offline"
          : liveReading.concentration_pct > THRESHOLD
          ? "Critical"
          : liveReading.concentration_pct > 85
          ? "Warning"
          : "Normal",
        lastUpdated: lastChangedAt
          ? formatTimeAgo(new Date(lastChangedAt), now)
          : "No data",
      },
    },
    {
      id: 2,
      label: "Station B1",
      x: 56,
      y: 43,
      data: {
        temperature: "4.7°C",
        concentration: 75,
        status: "Normal",
        lastUpdated: "5 min ago",
      },
    },
    {
      id: 3,
      label: "Station F1",
      x: 46,
      y: 63,
      data: {
        temperature: "1.9°C",
        concentration: 200,
        status: "Critical",
        lastUpdated: "1 min ago",
      },
    },
    {
      id: 4,
      label: "Station C2",
      x: 45,
      y: 17,
      data: {
        temperature: "2.5°C",
        concentration: 90,
        status: "Warning",
        lastUpdated: "3 min ago",
      },
    },
    {
      id: 5,
      label: "Station H4",
      x: 16,
      y: 49,
      data: {
        temperature: "3.8°C",
        concentration: 45,
        status: "Normal",
        lastUpdated: "4 min ago",
      },
    },
    {
      id: 6,
      label: "Station E4",
      x: 72,
      y: 58,
      data: {
        temperature: "2.1°C",
        concentration: 110,
        status: "Critical",
        lastUpdated: "2 min ago",
      },
    },
  ];

  const dailyChartData =
    glycolData?.history && glycolData.history.length > 0
      ? buildDailyChartData(glycolData.history)
      : null;

  const alertCount =
    liveReading && liveReading.concentration_pct > THRESHOLD ? 1 : 0;

  // ── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050d1a] text-white -mt-20 pt-20">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-6xl font-bold tracking-wide text-white mb-2">Dashboard</h1>
          <p className="text-sm text-zinc-400">Loading sensor data...</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0a1628] rounded-2xl border border-[#0f2540] px-6 py-6 animate-pulse">
                <div className="h-4 bg-[#0f2540] rounded w-24 mb-3" />
                <div className="h-10 bg-[#0f2540] rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050d1a] text-white -mt-20 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Title + LIVE indicator */}
        <div className="flex items-center gap-3">
          <h1 className="text-6xl font-bold tracking-wide text-white mb-2">Dashboard</h1>
          {glycolData?.deviceOnline && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-teal-400">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400">Welcome back, Jonathan.</p>

        {/* Error banner */}
        {error && (
          <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
            Unable to reach sensor: {error}. Showing last known data.
          </div>
        )}

        {/* Stat cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Sites */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] rounded-2xl border border-[#0f2540] px-6 py-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-400"><IconSites /></span>
              <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">Active Sites</p>
            </div>
            <p className="text-4xl font-bold text-white">
              {glycolData?.deviceOnline ? 1 : 0}
              <span className="text-lg font-medium text-zinc-500 ml-1">/ 6</span>
            </p>
            <div className="mt-3 flex gap-1">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 1 && glycolData?.deviceOnline ? "bg-blue-400" : "bg-[#0f2540]"}`} />
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] rounded-2xl border border-[#0f2540] px-6 py-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex items-center gap-2 mb-3">
              {alertCount > 0 && <span className="text-yellow-400"><IconAlert /></span>}
              <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">Alerts</p>
            </div>
            <p className={`text-4xl font-bold ${alertCount > 0 ? "text-yellow-400" : "text-white"}`}>{alertCount}</p>
            <p className="text-xs text-zinc-600 mt-3">
              {alertCount > 0 ? `${alertCount} station${alertCount > 1 ? "s" : ""} above ${THRESHOLD} ppm` : "All stations normal"}
            </p>
          </div>

          {/* Last Reading */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] rounded-2xl border border-[#0f2540] px-6 py-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-500/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex items-center gap-2 mb-3">
              <span className="text-zinc-400"><IconClock /></span>
              <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">Last Reading</p>
            </div>
            <p className="text-4xl font-bold text-white">
              {lastChangedAt ? formatTimeAgo(new Date(lastChangedAt), now) : "—"}
            </p>
            <p className="text-xs text-zinc-600 mt-3">Station HDF-10</p>
          </div>
        </div>

        {/* Map section */}
        <div className="mt-10 bg-[#0a1628] rounded-2xl border border-[#0f2540] px-6 py-8">
          <h2 className="text-4xl font-bold text-white mb-1">GlycoTech Sensors</h2>
          <p className="text-sm text-zinc-500 mb-6">Click a sensor point to view live readings.</p>

          {/* Legend */}
          <div className="flex items-center gap-8 mb-5 text-sm text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-teal-400 inline-block" />
              Normal
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block" />
              Warning
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500 inline-block" />
              Critical
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-zinc-500 inline-block" />
              Offline
            </div>
          </div>

          <div
            className="relative w-full rounded-xl overflow-visible"
            onClick={() => setActiveId(null)}
          >
            <Image
              src="/Airport_Map.png"
              alt="Toronto Pearson Water Monitoring Map"
              width={1270}
              height={900}
              className="w-full h-auto object-contain rounded-xl"
              unoptimized
            />

            {hotspots.map((spot) => {
              const isOffline = spot.data.status === "Offline";
              const dotColor = isOffline
                ? "bg-zinc-500 border-zinc-400"
                : spot.data.status === "Critical"
                ? "bg-red-500 border-red-300"
                : spot.data.status === "Warning"
                ? "bg-yellow-400 border-yellow-200"
                : "bg-teal-400 border-teal-200";
              const pingColor = isOffline
                ? "bg-zinc-500"
                : spot.data.status === "Critical"
                ? "bg-red-500"
                : spot.data.status === "Warning"
                ? "bg-yellow-400"
                : "bg-teal-400";

              return (
                <div
                  key={spot.id}
                  className="absolute"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  {/* Pulse ring */}
                  {!isOffline && (
                    <span
                      className={`absolute inline-flex h-full w-full rounded-full opacity-50 animate-ping ${pingColor}`}
                    />
                  )}

                  {/* Dot button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveId(activeId === spot.id ? null : spot.id);
                    }}
                    className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all hover:scale-125 ${dotColor} shadow-lg`}
                  />

                  {/* Popup */}
                  {activeId === spot.id && (
                    <div
                      className="absolute z-30 w-64 bg-[#071120] border border-[#0f2540] rounded-xl shadow-2xl p-5 text-left"
                      style={{ top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Arrow */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#071120] border-l border-t border-[#0f2540] rotate-45" />

                      <div className="flex items-center justify-between mb-3">
                        <p className="text-base font-semibold text-white">{spot.label}</p>
                        <span
                          className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                            isOffline
                              ? "bg-zinc-500/20 text-zinc-400"
                              : spot.data.status === "Critical"
                              ? "bg-red-500/20 text-red-400"
                              : spot.data.status === "Warning"
                              ? "bg-yellow-400/20 text-yellow-300"
                              : "bg-teal-400/20 text-teal-300"
                          }`}
                        >
                          {spot.data.status}
                        </span>
                      </div>

                      {spot.isLive && (
                        <div className="mb-2 text-[10px] font-medium text-teal-400 uppercase tracking-widest">
                          Live Sensor
                        </div>
                      )}

                      <div className="space-y-2 text-sm text-zinc-400">
                        <div className="flex justify-between">
                          <span>Glycol Level</span>
                          <span className="text-white font-medium">
                            {(spot.data.concentration / 10000).toFixed(3)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature</span>
                          <span className="text-white font-medium">{spot.data.temperature}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Concentration</span>
                          <span className="text-white font-medium">
                            {spot.isLive && liveReading
                              ? `${(Math.round(liveReading.concentration_pct * 10) / 10).toFixed(1)} ppm`
                              : `${spot.data.concentration} ppm`}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-[#0f2540]">
                          <span>Updated</span>
                          <span className="text-zinc-500">{spot.data.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity + Charts */}
        <div className="mt-6 bg-[#0a1628] rounded-2xl border border-[#0f2540] px-6 py-8">
          <h2 className="text-4xl font-bold text-white mb-1">Recent Activity</h2>
          <p className="text-sm text-zinc-500 mb-8">Historical glycol concentration across all stations.</p>

          {/* Live Daily Chart */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Station HDF-10 — Live Readings
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Recent concentration readings · ppm
                </p>
              </div>
              {glycolData?.deviceOnline && (
                <span className="text-xs font-medium px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400">
                  Receiving data
                </span>
              )}
            </div>

            {dailyChartData && dailyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={dailyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradHDF" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f2540" />
                  <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} unit=" ppm" width={65} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#071120", border: "1px solid #0f2540", borderRadius: "10px", color: "#e5e7eb" }}
                    labelStyle={{ color: "#9ca3af", fontSize: 12 }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`${value} ppm`]}
                  />
                  <ReferenceLine
                    y={THRESHOLD}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    label={{ value: "Threshold", fill: "#ef4444", fontSize: 11, position: "insideTopRight" }}
                  />
                  <Area type="monotone" dataKey="HDF10" name="Station HDF-10" stroke="#2dd4bf" strokeWidth={2} fill="url(#gradHDF)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[260px] text-zinc-500 text-sm">
                No live data available yet. Waiting for sensor readings...
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#0f2540] mb-10" />

          {/* Weekly Chart (mock data) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">This Week — Daily Average Concentration</h3>
                <p className="text-xs text-zinc-500 mt-0.5">7-day average per station · ppm (simulated)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#0f2540" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} unit=" ppm" width={65} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#071120", border: "1px solid #0f2540", borderRadius: "10px", color: "#e5e7eb" }}
                  labelStyle={{ color: "#9ca3af", fontSize: 12 }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${value} ppm`]}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <ReferenceLine y={THRESHOLD} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5}
                  label={{ value: "Threshold", fill: "#ef4444", fontSize: 11, position: "insideTopRight" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af", paddingTop: 12 }} />
                <Bar dataKey="HDF10" name="Station HDF-10" fill="#2dd4bf" opacity={0.85} radius={[4, 4, 0, 0]} />
                <Bar dataKey="B1" name="Station B1" fill="#60a5fa" opacity={0.85} radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1" name="Station F1" fill="#f87171" opacity={0.85} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
