export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 text-white">
      <Header />

      <main>
        <Hero />
        <Vision />
        <Product />
        <Newsletter />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

/* ================= HEADER ================= */

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/20">
            <span className="text-sm font-semibold">GT</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">GlycoTech</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <a href="#story" className="opacity-70 hover:opacity-100">Story</a>
          <a href="#vision" className="opacity-70 hover:opacity-100">Vision</a>
          <a href="#contact" className="opacity-70 hover:opacity-100">Contact</a>
        </nav>

        <a
          href="#contact"
          className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
        >
          Request pilot
        </a>
      </div>
    </header>
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section id="story" className="mx-auto max-w-6xl px-4 pt-20 md:pt-28">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            Real-time stormwater glycol monitoring
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            GlycoTech
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/80">
            Detect ethylene glycol releases during winter de-icing operations
            using a rugged sensing node and a clean compliance-first workflow.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
            >
              Request pilot
            </a>
            <a
              href="#product"
              className="rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/10"
            >
              See product
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/70">
            <span>Outdoor deployment</span>
            <span>•</span>
            <span>LTE connectivity</span>
            <span>•</span>
            <span>Alerts + reporting</span>
            <span>•</span>
            <span>Winter-ready</span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            Nanotechnology Engineering 2026
          </p>

          <ul className="mt-6 space-y-4 text-sm text-white/80">
            <li>• Jonathan Zambrano</li>
            <li>• Diego Roti</li>
            <li>• Matthias Bernhard</li>
            <li>• Marcus Tunkl</li>
            <li>• Consultant: Vasili Karanassios</li>
          </ul>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            Built for pilot deployments and real-world validation.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= VISION ================= */

function Vision() {
  return (
    <section id="vision" className="mx-auto max-w-6xl px-4 py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            Vision
          </p>
          <h2 className="mt-6 text-3xl font-semibold md:text-4xl">
            Monitoring that scales with reality.
          </h2>
        </div>

        <div className="space-y-4 text-lg text-white/80">
          <p>
            GlycoWatch is designed to make stormwater glycol monitoring
            continuous, reliable, and easy to act on.
          </p>
          <p>
            The focus isn’t just data — it’s faster response, reduced manual
            sampling, and clean compliance records that stand up to scrutiny.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================= PRODUCT ================= */

function Product() {
  return (
    <section id="product" className="mx-auto max-w-6xl px-4 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
        Product
      </p>

      <h2 className="mt-6 text-3xl font-semibold md:text-4xl">
        One system. Clear outputs.
      </h2>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold">Hardware</h3>
          <p className="mt-4 text-white/80">
            A rugged electrochemical sensing node designed for outdoor and
            winter deployment, with onboard health checks and LTE connectivity.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-white/70">
            <li>• Electrochemical measurement</li>
            <li>• Temperature and power monitoring</li>
            <li>• Outdoor-rated enclosure</li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Software</h3>
          <p className="mt-4 text-white/80">
            Alerts-first dashboard prioritizing exceedances, trends, and
            exportable reports — without spreadsheet cleanup.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-white/70">
            <li>• Threshold-based alerts</li>
            <li>• Timestamped event history</li>
            <li>• CSV / PDF reporting</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ================= NEWSLETTER ================= */

function Newsletter() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
          Updates
        </p>

        <h3 className="mt-4 text-2xl font-semibold">
          Get pilot updates and launch notes.
        </h3>

        <p className="mt-3 max-w-2xl text-white/80">
          No spam. Just progress updates, validation results, and pilot openings.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="you@company.com"
            className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none"
          />
          <button className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */

function CTA() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
        <h3 className="text-3xl font-semibold">
          Want to pilot GlycoWatch?
        </h3>

        <p className="mt-4 max-w-2xl text-white/80">
          Tell us where you’d deploy it and what ranges you expect. We’ll follow
          up with a simple pilot plan.
        </p>

        <div className="mt-8">
          <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200">
            Contact us
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */

function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-6xl justify-between px-4 text-sm text-white/60">
        <span>GlycoWatch • FYDP prototype</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

