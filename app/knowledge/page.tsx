import { supabase } from "@/lib/supabase/client";
import KnowledgeCard from "@/components/knowledge/KnowledgeCard";
import KnowledgeFilters from "@/components/knowledge/KnowledgeFilters";

import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";

type KnowledgePageProps = {
  searchParams: Promise<{
    search?: string;
    region?: string;
    category?: string;
    type?: string;
  }>;
};

export default async function KnowledgePage({
  searchParams,
}: KnowledgePageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const region = params.region || "";
  const category = params.category || "";
  const type = params.type || "";

  let query = supabase
    .from("knowledge_resources")
    .select("*")
    .eq("published", true)
    .order("published_date", {
      ascending: false,
    });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%`
    );
  }

  if (region) {
    query = query.eq("region", region);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (type) {
    query = query.eq("resource_type", type);
  }

  const { data, error } = await query;

  return (
    <main className="min-h-screen bg-slate-950">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 md:py-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
              Knowledge Repository
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Explore Polar Science
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Discover scientific knowledge, educational resources,
              research summaries and information from the Arctic and
              Antarctic regions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-10 md:py-12">
        <div className="pointer-events-none absolute left-1/3 top-20 h-80 w-80 rounded-full bg-sky-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          {/* Filters */}
          <Reveal>
            <GlassCard className="border-white/10 bg-white/[0.04] p-4 md:p-5">
              <KnowledgeFilters />
            </GlassCard>
          </Reveal>

          {/* Heading */}
          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
                  Resources
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white md:text-2xl">
                  Knowledge Resources
                </h2>
              </div>

              <p className="text-xs text-slate-500">
                {data?.length || 0} resources found
              </p>
            </div>
          </Reveal>

          {/* Error */}
          {error ? (
            <Reveal>
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-300">
                <p className="font-medium">
                  Unable to load knowledge resources.
                </p>

                <p className="mt-1 text-red-400/80">
                  {error.message}
                </p>
              </div>
            </Reveal>
          ) : data && data.length > 0 ? (
            /* Cards */
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.map((item, index) => (
                <Reveal
                  key={item.id}
                  delay={index * 0.06}
                >
                  <div className="h-full">
                    <KnowledgeCard
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      category={item.category}
                      resourceType={item.resource_type}
                      region={item.region}
                      publishedDate={item.published_date}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            /* Empty state */
            <Reveal>
              <div className="mt-7 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-lg text-sky-300">
                  ◌
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">
                  No resources found
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                  Try changing your search or filters to discover
                  other polar science resources.
                </p>
              </div>
            </Reveal>
          )}

        </div>
      </section>
    </main>
  );
}