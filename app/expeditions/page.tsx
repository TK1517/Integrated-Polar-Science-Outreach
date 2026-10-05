import { supabase } from "@/lib/supabase/client";
import ExpeditionCard from "@/components/expeditions/ExpeditionCard";
import ExpeditionFilters from "@/components/expeditions/ExpeditionFilters";

type ExpeditionsPageProps = {
  searchParams: Promise<{
    search?: string;
    region?: string;
    status?: string;
  }>;
};

export default async function ExpeditionsPage({
  searchParams,
}: ExpeditionsPageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const region = params.region || "";
  const status = params.status || "";

  let query = supabase
    .from("expeditions")
    .select("*")
    .eq("published", true)
    .order("start_date", {
      ascending: false,
    });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
    );
  }

  if (region) {
    query = query.eq("region", region);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  return (
    <main className="min-h-screen bg-slate-950 text-white dark:bg-slate-950">
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Polar Expeditions
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Expeditions to the Polar Regions
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Discover scientific expeditions, field campaigns
            and research journeys across the Arctic and
            Antarctic.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-sky-500/[0.035] blur-3xl" />

        <div className="relative">
          <ExpeditionFilters />

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-white">
              Expeditions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {data?.length || 0} expeditions found
            </p>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-sm text-red-300 backdrop-blur-xl">
              Unable to load expeditions.
              <br />
              {error.message}
            </div>
          ) : data && data.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((expedition) => (
                <ExpeditionCard
                  key={expedition.id}
                  id={expedition.id}
                  title={expedition.title}
                  description={expedition.description}
                  region={expedition.region}
                  location={expedition.location}
                  institution={expedition.institution}
                  startDate={expedition.start_date}
                  endDate={expedition.end_date}
                  status={expedition.status}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-12 text-center backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">
                No expeditions found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
