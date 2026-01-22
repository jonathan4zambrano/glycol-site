export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Header />

      <main>
        <Hero />
        <SectionDivider />
        <Vision />
        <SectionDivider />
        <Product />
        <SectionDivider />
        <Newsletter />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl border border-zinc-200 grid place-items-center">
            <span className="text-sm font-semibold">GW</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">GlycoWatch</span>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <a className="text-zinc-600 hover:text-zinc-950" href="#story">Story</a>
          <a className="text-zinc-600 hover:text-zinc-950" href="#vision">Vision</a>
          <a className="text-zinc-600 hover:text-zinc-950" href="#contact">Contact</a>
        </nav>

        <a
          href="#contact"
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Request pilot
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="story" className="mx-auto max-w-6xl px-4 pt-14 md:pt-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Real-time stormwater glycol monitoring
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            real-time.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg">
            Detect ethylene glycol releases during de-icing operations with a rugged sensing node
            and a clean reporting workflow. Built to reduce manual sampling and speed up response.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Request pilot
            </a>
            <a
              href="#product"
              className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-medium hover:bg-zinc-50"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <Pill>Outdoor deployment</Pill>
            <Pill>LTE connectivity</Pill>
            <Pill>Alerts + exports</Pill>
            <Pill>Winter-ready design</Pill>
          </div>
        </div>

        <div className="md:pt-6">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              What it delivers
            </p>

            <div className="mt-6 grid gap-4">
              <Feature
                title="Trendline + thresholds"
                body="View concentration changes over time with tunable alert thresholds."
              />
              <Feature
                title="Event logging"
                body="Timestamped exceedances and acknowledgements for clean reporting."
              />
              <Feature
                title="Field workflow"
                body="Designed around maintenance and deployment realities."
              />
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4">
              <p className="text-sm font-medium">Built for pilots.</p>
              <p className="mt-1 text-sm text-zinc-600">
                Start with one outfall → tune thresholds → scale across sites.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section id="vision" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Vision
          </p>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
            Monitoring that’s simple enough to scale.
          </h2>
        </div>

        <div className="text-zinc-600 md:text-lg">
          <p className="leading-relaxed">
            GlycoWatch aims to make stormwater glycol monitoring continuous, reliable, and
            easy to act on. The goal isn’t just data — it’s faster response and cleaner compliance.
          </p>
          <p className="mt-4 leading-relaxed">
            We’re designing for cold weather deployments, minimal field time, and clear outputs
            that help teams make decisions without digging through messy spreadsheets.
          </p>
        </div>
      </div>
    </section>
  );
}

function Product() {
  return (
    <section id="product" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Product
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card title="Sensing node" subtitle="Electrochemical measurement + edge checks">
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            <li>• Continuous measurements at a sampling point</li>
            <li>• Health checks (power, temperature, connectivity)</li>
            <li>• Designed around field maintenance</li>
          </ul>
        </Card>

        <Card title="Dashboard + reporting" subtitle="Alerts-first workflow">
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            <li>• Threshold exceedance alerts</li>
            <li>• Event log with timestamps</li>
            <li>• CSV/PDF export for reporting</li>
          </ul>
        </Card>
      </div>

      <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Stat label="Deployment" value="Outdoor + cold" />
          <Stat label="Connectivity" value="LTE" />
          <Stat label="Outputs" value="Alerts + exports" />
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Updates
        </p>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
          Get pilot updates and launch notes.
        </h3>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 md:text-base">
          No spam. Just progress updates, testing results, and pilot openings.
        </p>

        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="you@company.com"
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="button"
            className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-14 md:pb-20">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Let’s talk
        </p>
        <div className="mt-5 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Want to pilot GlycoWatch?
            </h3>
            <p className="mt-3 text-sm text-zinc-600 md:text-base">
              Tell us where you’d deploy it and what ranges you expect. We’ll follow up with a
              simple pilot plan.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="grid gap-3">
              <input
                placeholder="Name"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
              <input
                placeholder="Organization"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
              <input
                placeholder="Email"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
              <input
                placeholder="Site / Outfall"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-400"
              />
              <button
                type="button"
                className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Send
              </button>
              <p className="text-xs text-zinc-500">
                (Mock form for now — we can wire this to Formspree later.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-950">GlycoWatch</span>
          <span className="text-zinc-400">•</span>
          <span>FYDP prototype</span>
        </div>
        <div className="flex gap-4">
          <a className="hover:text-zinc-950" href="#story">Story</a>
          <a className="hover:text-zinc-950" href="#vision">Vision</a>
          <a className="hover:text-zinc-950" href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function SectionDivider() {
  return <div className="mx-auto max-w-6xl px-4"><div className="h-px bg-zinc-200" /></div>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{body}</p>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {subtitle}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

