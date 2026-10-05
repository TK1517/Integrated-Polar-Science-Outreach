import { supabase } from "@/lib/supabase/client";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Link from "next/link";

import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

export default async function Home() {
  const { data: knowledge, error } = await supabase
    .from("knowledge_resources")
    .select("*")
    .eq("published", true)
    .order("published_date", { ascending: false })
    .limit(3);

  const portalSections = [
    {
      title: "Research Publications",
      description:
        "Explore scientific publications and research focused on polar regions.",
      href: "/publications",
      label: "Research",
    },
    {
      title: "Polar Expeditions",
      description:
        "Discover expeditions, field missions and scientific work carried out in polar regions.",
      href: "/expeditions",
      label: "Expeditions",
    },
    {
      title: "Media",
      description:
        "Explore videos, photo stories, announcements and other polar science media.",
      href: "/media",
      label: "Stories & Media",
    },
  ];

  return (
    <div className="theme-page font-sans">
      <Hero />

      {/* Stats */}
      <section className="relative overflow-hidden bg-slate-950 px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <Stats />
        </div>
      </section>

      {/* Knowledge */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24">
        <div className="pointer-events-none absolute left-1/4 top-20 h-72 w-72 rounded-full bg-sky-400/5 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-10 h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                  Knowledge Repository
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Explore Polar Knowledge
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                  Discover educational resources, research summaries and
                  scientific knowledge from the polar regions.
                </p>
              </div>

              <Link
                href="/knowledge"
                className="hidden rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 hover:text-white md:block"
              >
                View all →
              </Link>
            </div>
          </Reveal>

          {error ? (
            <div className="mt-10 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
              Unable to load knowledge resources.
            </div>
          ) : knowledge && knowledge.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {knowledge.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.1}>
                  <Link href={`/knowledge/${item.id}`} className="block h-full">
                    <GlassCard className="group h-full border-white/10 bg-white/[0.06] text-white hover:border-sky-300/30 hover:bg-white/[0.09]">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-sky-300">
                          {item.category || "Polar Science"}
                        </span>

                        <span className="text-slate-500 transition group-hover:text-sky-300">
                          ↗
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-400">
                        {item.description}
                      </p>

                      <div className="mt-7 text-sm font-medium text-sky-300">
                        Read resource →
                      </div>
                    </GlassCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              No knowledge resources available yet.
            </div>
          )}

          <div className="mt-8 md:hidden">
            <Link
              href="/knowledge"
              className="text-sm font-medium text-sky-300"
            >
              View all knowledge resources →
            </Link>
          </div>
        </div>
      </section>

      {/* Explore portal */}
      <section className="relative overflow-hidden bg-slate-900 px-6 py-24">
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                Explore the Portal
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Discover polar science
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                Explore research, expeditions and media to learn more about
                scientific work in the Arctic and Antarctica.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {portalSections.map((section, index) => (
              <Reveal key={section.title} delay={index * 0.12}>
                <Link href={section.href} className="block h-full">
                  <GlassCard className="group h-full border-white/10 bg-white/[0.05] p-7 hover:border-sky-300/30 hover:bg-white/[0.09]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-lg text-sky-300">
                      {index === 0 ? "⌁" : index === 1 ? "◈" : "◉"}
                    </div>

                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                      {section.label}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {section.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {section.description}
                    </p>

                    <div className="mt-7 text-sm font-medium text-sky-300 transition group-hover:text-sky-200">
                      Explore →
                    </div>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
              Polar Research
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Science beyond boundaries.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
              Explore the research, expeditions and observations that help us
              understand some of the most important environments on Earth.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/publications"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-sky-50"
              >
                Browse Research
              </Link>

              <Link
                href="/media"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10"
              >
                Explore Media
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
