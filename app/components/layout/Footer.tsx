import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">
      {/* Subtle polar glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-white transition hover:text-sky-300"
            >
              Polar Science Portal
            </Link>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Explore polar science, research, expeditions, knowledge and
              media from the Arctic and Antarctica.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Explore
            </h3>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href="/knowledge"
                className="text-slate-500 transition hover:text-sky-300"
              >
                Knowledge
              </Link>

              <Link
                href="/publications"
                className="text-slate-500 transition hover:text-sky-300"
              >
                Research
              </Link>

              <Link
                href="/expeditions"
                className="text-slate-500 transition hover:text-sky-300"
              >
                Expeditions
              </Link>

              <Link
                href="/media"
                className="text-slate-500 transition hover:text-sky-300"
              >
                Media
              </Link>
            </div>
          </div>

          {/* Portal */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Portal
            </h3>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href="/search"
                className="text-slate-500 transition hover:text-sky-300"
              >
                Search
              </Link>

              <Link
                href="/admin"
                className="text-slate-500 transition hover:text-sky-300"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Polar Science Portal</p>

          <p>
            Integrated Polar Science Outreach
          </p>
        </div>
      </div>
    </footer>
  );
}