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
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Media & Outreach
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Polar Science Stories & Media
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Discover videos, images, stories and educational
            resources that bring polar science closer to
            researchers, students and the public.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <MediaFilters />

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">
            Media Library
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {data?.length || 0} media resources found
          </p>
        </div>

        {/* Error */}
        {error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
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
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No media found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}