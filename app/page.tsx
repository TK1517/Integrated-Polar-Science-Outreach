import { supabase } from "@/lib/supabase/client";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Link from "next/link";

export default async function Home() {
  const { data: knowledge, error } = await supabase
    .from("knowledge_resources")
    .select("*")
    .eq("published", true)
    .order("published_date", { ascending: false })
    .limit(3);

  return (
    <>
      <Hero />

      <Stats />

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-sky-600">
              KNOWLEDGE REPOSITORY
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Explore Polar Knowledge
            </h2>

            <p className="mt-3 max-w-xl text-slate-500">
              Discover educational resources, research summaries and
              scientific knowledge from the polar regions.
            </p>
          </div>

          <Link
            href="/knowledge"
            className="hidden text-sm font-medium text-sky-600 md:block"
          >
            View all →
          </Link>
        </div>

        {error ? (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Unable to load knowledge resources.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {knowledge?.map((item) => (
              <Link
                href={`/knowledge/${item.id}`}
                key={item.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-300"
              >

                <div className="text-xs font-medium uppercase tracking-wider text-sky-600">
                  {item.category}
                </div>

                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-6 text-sm font-medium text-slate-900">
                  Read resource →
                </div>

              </Link>
            ))}

          </div>
        )}

      </section>

      <section className="border-y border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-20">

          <p className="text-sm font-medium text-sky-600">
            POLAR RESEARCH
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Science beyond boundaries
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Explore research, expeditions and scientific observations
            that help us understand some of the most important
            environments on Earth.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/publications"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white"
            >
              Browse Research
            </Link>

            <Link
              href="/expeditions"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium"
            >
              Explore Expeditions
            </Link>

          </div>

        </div>
      </section>

    </>
  );
}