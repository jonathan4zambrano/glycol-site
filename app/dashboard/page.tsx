"use client";

import { useState } from "react";
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

type Hotspot = {
  id: number;
  label: string;
  x: number; // percent from left
  y: number; // percent from top
  data: {
    temperature: string;
    concentration: number; // ppm
    status: string;
    lastUpdated: string;
  };
};

// ── Chart Data ──────────────────────────────────────────────
const dailyData = [
  { time: "00:00", HDF10: 18, B1: 60, F1: 145 },
  { time: "02:00", HDF10: 22, B1: 68, F1: 160 },
  { time: "04:00", HDF10: 15, B1: 55, F1: 178 },
  { time: "06:00", HDF10: 25, B1: 72, F1: 195 },
  { time: "08:00", HDF10: 30, B1: 80, F1: 210 },
  { time: "10:00", HDF10: 20, B1: 75, F1: 200 },
  { time: "12:00", HDF10: 18, B1: 70, F1: 185 },
  { time: "14:00", HDF10: 22, B1: 78, F1: 192 },
  { time: "16:00", HDF10: 28, B1: 82, F1: 205 },
  { time: "18:00", HDF10: 24, B1: 76, F1: 198 },
  { time: "20:00", HDF10: 20, B1: 73, F1: 200 },
  { time: "22:00", HDF10: 20, B1: 75, F1: 200 },
];

const weeklyData = [
  { day: "Mon", HDF10: 14, B1: 55, F1: 130 },
  { day: "Tue", HDF10: 22, B1: 68, F1: 155 },
  { day: "Wed", HDF10: 18, B1: 72, F1: 175 },
  { day: "Thu", HDF10: 30, B1: 80, F1: 190 },
  { day: "Fri", HDF10: 25, B1: 76, F1: 200 },
  { day: "Sat", HDF10: 12, B1: 50, F1: 140 },
  { day: "Sun", HDF10: 20, B1: 75, F1: 200 },
];

const THRESHOLD = 150; // ppm critical threshold line

const hotspots: Hotspot[] = [
  {
    id: 1,
    label: "Station HDF-10",
    x: 30,
    y: 38,
    data: {
      temperature: "3.2°C",
      concentration: 20,
      status: "Normal",
      lastUpdated: "2 min ago",
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
    x: 45,
    y: 63,
    data: {
      temperature: "1.9°C",
      concentration: 200,
      status: "Critical",
      lastUpdated: "1 min ago",
    },
  },
];

export default function DashboardPage() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050d1a] text-white -mt-20 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-6xl font-bold tracking-wide text-white mb-2">Dashboard</h1>
        <p className="text-sm text-zinc-400">Welcome back, Jonathan.</p>

        {/* Stat cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a1628] rounded-2xl border border-[#0f2540] px-6 py-6">
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Active Sites</p>
            <p className="text-4xl font-bold text-white">3</p>
          </div>
          <div className="bg-[#0a1628] rounded-2xl border border-[#0f2540] px-6 py-6">
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Alerts</p>
            <p className="text-4xl font-bold text-yellow-400">1</p>
          </div>
          <div className="bg-[#0a1628] rounded-2xl border border-[#0f2540] px-6 py-6">
            <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">Last Reading</p>
            <p className="text-4xl font-bold text-white">2h ago</p>
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

            {hotspots.map((spot) => (
              <div
                key={spot.id}
                className="absolute"
                style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
              >
                {/* Pulse ring */}
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-50 animate-ping ${
                    spot.data.status === "Critical" ? "bg-red-500" : spot.data.status === "Warning" ? "bg-yellow-400" : "bg-teal-400"
                  }`}
                />

                {/* Dot button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(activeId === spot.id ? null : spot.id);
                  }}
                  className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all hover:scale-125 ${
                    spot.data.status === "Critical"
                      ? "bg-red-500 border-red-300"
                      : spot.data.status === "Warning"
                      ? "bg-yellow-400 border-yellow-200"
                      : "bg-teal-400 border-teal-200"
                  } shadow-lg`}
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
                          spot.data.status === "Critical"
                            ? "bg-red-500/20 text-red-400"
                            : spot.data.status === "Warning"
                            ? "bg-yellow-400/20 text-yellow-300"
                            : "bg-teal-400/20 text-teal-300"
                        }`}
                      >
                        {spot.data.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-zinc-400">
                      <div className="flex justify-between">
                        <span>Glycol Level</span>
                        <span className="text-white font-medium">{(spot.data.concentration / 1750 * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Temperature</span>
                        <span className="text-white font-medium">{spot.data.temperature}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Concentration</span>
                        <span className="text-white font-medium">{spot.data.concentration} ppm</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-[#0f2540]">
                        <span>Updated</span>
                        <span className="text-zinc-500">{spot.data.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity + Charts */}
        <div className="mt-6 bg-[#0a1628] rounded-2xl border border-[#0f2540] px-6 py-8">
          <h2 className="text-4xl font-bold text-white mb-1">Recent Activity</h2>
          <p className="text-sm text-zinc-500 mb-8">Historical glycol concentration across all stations.</p>

          {/* Daily Chart */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Today — 24h Concentration</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Hourly readings · ppm</p>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                ⚠ Station F1 exceeds threshold
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradHDF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradB1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradF1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
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
                <ReferenceLine y={THRESHOLD} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5}
                  label={{ value: "Threshold", fill: "#ef4444", fontSize: 11, position: "insideTopRight" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af", paddingTop: 12 }} />
                <Area type="monotone" dataKey="HDF10" name="Station HDF-10" stroke="#2dd4bf" strokeWidth={2} fill="url(#gradHDF)" dot={false} />
                <Area type="monotone" dataKey="B1" name="Station B1" stroke="#60a5fa" strokeWidth={2} fill="url(#gradB1)" dot={false} />
                <Area type="monotone" dataKey="F1" name="Station F1" stroke="#f87171" strokeWidth={2} fill="url(#gradF1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Divider */}
          <div className="border-t border-[#0f2540] mb-10" />

          {/* Weekly Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">This Week — Daily Average Concentration</h3>
                <p className="text-xs text-zinc-500 mt-0.5">7-day average per station · ppm</p>
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
