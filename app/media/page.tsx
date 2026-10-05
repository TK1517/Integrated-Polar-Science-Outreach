import { supabase } from "@/lib/supabase/client";
import MediaCard from "@/components/media/MediaCard";
import MediaFilters from "@/components/media/MediaFilters";

type MediaPageProps = {
  searchParams: Promise<{
    search?: string;
    type?: string;
  }>;
};

export default async function MediaPage({
  searchParams,
}: MediaPageProps) {
  const params = await searchParams;

  const search = params.search || "";
  const type = params.type || "";

  let query = supabase
    .from("media")
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

  if (type) {
    query = query.eq("media_type", type);
  }

  const { data, error } = await query;

  return (
    <main className="theme-page min-h-screen bg-slate-950 text-white dark:bg-slate-950">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
            Media & Outreach
          </p>

          <h1 className="relative mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Polar Science Stories & Media
          </h1>

          <p className="relative mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Discover videos, images, stories and educational
            resources that bring polar science closer to
            researchers, students and the public.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-sky-500/[0.035] blur-3xl" />

        <div className="relative">
        <MediaFilters />

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Media Library
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {data?.length || 0} media resources found
          </p>
        </div>

        {/* Error */}
        {error ? (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-sm text-red-300 backdrop-blur-xl">
            <p className="font-semibold">
              Unable to load media.
            </p>

            <p className="mt-2">
              {error.message}
            </p>
          </div>
        ) : data && data.length > 0 ? (
          /* Cards */
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                mediaType={item.media_type}
                thumbnailUrl={item.thumbnail_url}
                publishedDate={item.published_date}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.035] p-12 text-center backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-white">
              No media found
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
