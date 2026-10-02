import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.18),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-36">

        <div className="max-w-3xl">

          <div className="mb-6 inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-sky-300">
            India's Polar Science Gateway
          </div>

          <h1 className="text-5xl font-semibold tracking-tight text-white md:text-7xl">
            Explore India's
            <span className="block text-sky-400">
              Polar Science
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            Discover research, expeditions, scientific knowledge and
            stories from India's journey across the Arctic and Antarctic.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/knowledge"
              className="rounded-lg bg-sky-500 px-6 py-3 font-medium text-white transition hover:bg-sky-400"
            >
              Explore Knowledge
            </Link>

            <Link
              href="/expeditions"
              className="rounded-lg border border-slate-600 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
            >
              Discover Expeditions
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}