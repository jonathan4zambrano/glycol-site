"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === "jonathan4zambrano@gmail.com" && password === "GlycoTech2026") {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 relative overflow-hidden -mt-20 pt-8" style={{ backgroundImage: "url('/Login_Background.png')", backgroundSize: "120%", backgroundPosition: "center" }}>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-lg">

        {/* Logo */}
        <Image
          src="/GlycoTech.png"
          alt="GlycoTech Logo"
          width={1120}
          height={320}
          className="h-80 w-auto object-contain mt-5"
          unoptimized
        />

        <p className="mt-1 text-sm text-zinc-500">
          Sign in to access your dashboard.
        </p>

        {/* Card */}
        <div className="mt-6 w-full bg-white rounded-2xl shadow-sm border border-zinc-200 px-12 py-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 bg-white"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-400 hover:bg-slate-500 transition-colors py-3 text-sm font-medium text-white"
            >
              Continue
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/contact" className="text-blue-500 hover:underline">
            Contact us to get started.
          </Link>
        </p>
      </div>
    </div>
  );
}
