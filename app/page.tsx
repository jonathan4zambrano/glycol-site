import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      <main>
        <Hero />
        <Stats />
        <Story />
        <Features />
        <Vision />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section
      id="story"
      className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-28 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-700/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Badge */}
      <div className="relative inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300 mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        Real-time Stormwater Glycol Monitoring
      </div>

      {/* Headline */}
      <h1 className="relative max-w-4xl text-5xl font-bold tracking-tight leading-tight md:text-7xl">
        Detect glycol before it
        <span className="text-blue-400"> becomes a violation.</span>
      </h1>

      {/* Subtext */}
      <p className="relative mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
        GlycoTech deploys rugged electrochemical sensors at stormwater outfalls
        to continuously monitor ethylene glycol from airport de-icing — delivering
        real-time alerts and compliance-ready reports.
      </p>

      {/* CTA Buttons */}
      <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/contact"
          className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
        >
          Request a Pilot
        </Link>
        <a
          href="#features"
          className="rounded-full border border-[#0f2540] bg-[#0a1628] px-8 py-3 text-sm font-semibold text-zinc-300 hover:border-blue-700 hover:text-white transition-colors"
        >
          See How It Works
        </a>
      </div>

      {/* Feature pills */}
      <div className="relative mt-12 flex flex-wrap justify-center gap-3 text-xs text-zinc-500">
        {["Outdoor-rated hardware", "LTE connectivity", "Threshold alerts", "CSV & PDF reports", "Winter-ready"].map((tag) => (
          <span key={tag} className="rounded-full border border-[#0f2540] bg-[#0a1628] px-3 py-1">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ================= STATS ================= */

function Stats() {
  const items = [
    { value: "< 2 min", label: "Alert response time" },
    { value: "24 / 7", label: "Continuous monitoring" },
    { value: "± 5 ppm", label: "Sensor accuracy" },
    { value: "3 sites", label: "Pilot deployments" },
  ];

  return (
    <section className="border-y border-[#0f2540] bg-[#0a1628]">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center gap-1">
            <span className="text-3xl font-bold text-white">{item.value}</span>
            <span className="text-xs text-zinc-500 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= STORY ================= */

function Story() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <div className="grid gap-16 md:grid-cols-2 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400 mb-4">
            The Problem
          </p>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Airports discharge glycol.<br />
            <span className="text-zinc-400">Nobody's watching.</span>
          </h2>
          <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
            Every winter, airports apply thousands of litres of ethylene glycol for aircraft de-icing.
            When it washes into stormwater, it depletes oxygen in nearby waterways — yet most facilities
            still rely on manual grab samples taken days apart.
          </p>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            GlycoTech closes that gap with continuous, sensor-based monitoring at the source.
          </p>
        </div>

        {/* Team card */}
        <div className="rounded-2xl border border-[#0f2540] bg-[#0a1628] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400 mb-6">
            Nanotechnology Engineering 2026
          </p>
          <ul className="space-y-3">
            {[
              "Jonathan Zambrano",
              "Diego Roti",
              "Matthias Bernhard",
              "Marcus Tunkl",
            ].map((name) => (
              <li key={name} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="h-7 w-7 rounded-full bg-blue-700/30 border border-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-300">
                  {name[0]}
                </span>
                {name}
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-6 border-t border-[#0f2540] text-xs text-zinc-500">
            Consultant: Vasili Karanassios · University of Waterloo
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FEATURES ================= */

function Features() {
  const cards = [
    {
      icon: (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.5l1.196 4.783A9 9 0 0112 21a9 9 0 01-4.996-5.217L5 14.5" />
        </svg>
      ),
      title: "Electrochemical Sensing",
      desc: "Purpose-built sensor node measures glycol concentration via oxidative electrochemistry — no reagents, no lab wait.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: "Instant Alerts",
      desc: "Threshold-based notifications fire the moment a reading exceeds your compliance limit — not hours later.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
        </svg>
      ),
      title: "LTE Connectivity",
      desc: "Data streams directly from field sensors to the cloud — no on-site IT infrastructure required.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      title: "Compliance Reports",
      desc: "Auto-generated timestamped logs, exportable as CSV or PDF — ready for regulators on demand.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a1.125 1.125 0 001.358-.26l.43-.585a1.125 1.125 0 00-.048-1.452l-.674-.674A6 6 0 0014.437 5.5l-1.013-.203a1.125 1.125 0 01-.89-.89l-.1-.504a1.125 1.125 0 00-1.106-.93H9.75a1.125 1.125 0 00-1.125 1.125v.5" />
        </svg>
      ),
      title: "Outdoor Rugged Design",
      desc: "IP-rated enclosure built for Canadian winters — operates reliably from -30°C through freeze-thaw cycles.",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: "Live Dashboard",
      desc: "Interactive sensor map shows concentration levels, status, and trends across all your monitoring sites.",
    },
  ];

  return (
    <section id="features" className="bg-[#0a1628] border-y border-[#0f2540]">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400 mb-4">
            Product
          </p>
          <h2 className="text-4xl font-bold md:text-5xl">One system. Clear outputs.</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Everything you need to move from manual sampling to continuous, automated compliance monitoring.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[#0f2540] bg-[#050d1a] p-6 hover:border-blue-700/50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-700/20 border border-blue-700/30 flex items-center justify-center mb-4 group-hover:bg-blue-700/30 transition-colors">
                {card.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= VISION ================= */

function Vision() {
  return (
    <section id="vision" className="mx-auto max-w-6xl px-6 py-28">
      <div className="grid gap-16 md:grid-cols-2 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400 mb-4">
            Vision
          </p>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Monitoring that scales<br />
            <span className="text-zinc-400">with reality.</span>
          </h2>
          <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
            GlycoTech is designed to make stormwater glycol monitoring continuous,
            reliable, and easy to act on.
          </p>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            The focus isn't just data — it's faster response, reduced manual
            sampling, and clean compliance records that stand up to scrutiny.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { metric: "99%", label: "Uptime target", color: "text-blue-400" },
            { metric: "< 5s", label: "Data latency", color: "text-teal-400" },
            { metric: "Zero", label: "Reagents needed", color: "text-blue-400" },
            { metric: "100×", label: "Faster than manual", color: "text-teal-400" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#0f2540] bg-[#0a1628] p-6">
              <p className={`text-3xl font-bold ${item.color}`}>{item.metric}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="relative rounded-3xl border border-blue-700/30 bg-[#0a1628] p-12 text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[200px] bg-blue-700/15 rounded-full blur-[80px]" />
        </div>

        <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-blue-400 mb-4">
          Get Started
        </p>
        <h3 className="relative text-4xl font-bold md:text-5xl">
          Want to pilot GlycoTech?
        </h3>
        <p className="relative mt-4 max-w-xl mx-auto text-zinc-400 text-lg">
          Tell us your site and expected glycol ranges. We'll follow up with a simple pilot plan.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
          >
            Contact Us
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[#0f2540] px-8 py-3 text-sm font-semibold text-zinc-300 hover:border-blue-700 hover:text-white transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */

function Footer() {
  return (
    <footer className="border-t border-[#0f2540] py-8 bg-[#050d1a]">
      <div className="mx-auto flex max-w-6xl justify-between items-center px-6 text-xs text-zinc-500">
        <span>GlycoTech · FYDP prototype · Nanotechnology Engineering 2026</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
