import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { notFound } from "next/navigation";

type MediaDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MediaDetailPage({
  params,
}: MediaDetailProps) {
  const { id } = await params;

  const { data: media, error } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error || !media) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-14">

          <Link
            href="/media"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to Media Library
          </Link>

          <div className="mt-8 flex flex-wrap gap-3">

            {media.media_type && (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                {media.media_type}
              </span>
            )}

            {media.region && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {media.region}
              </span>
            )}

          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {media.title}
          </h1>

          {media.description && (
            <p className="mt-6 text-xl leading-8 text-slate-500">
              {media.description}
            </p>
          )}

          {media.published_date && (
            <p className="mt-6 text-sm text-slate-400">
              Published{" "}
              {new Date(
                media.published_date
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12">

          {media.thumbnail_url && (
            <div className="mb-10 overflow-hidden rounded-xl">
              <img
                src={media.thumbnail_url}
                alt={media.title}
                className="max-h-[500px] w-full object-cover"
              />
            </div>
          )}

          {media.content && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                About this resource
              </h2>

              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-600">
                {media.content}
              </p>
            </div>
          )}

          {media.video_url && (
            <div className="mt-10 border-t border-slate-200 pt-8">

              <h2 className="text-xl font-semibold text-slate-900">
                Watch
              </h2>

              <div className="mt-5">
                <a
                  href={media.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Watch Video →
                </a>
              </div>

            </div>
          )}

          {media.external_url && (
            <div className="mt-10 border-t border-slate-200 pt-8">

              <a
                href={media.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Visit External Resource →
              </a>

            </div>
          )}

        </article>
      </section>
    </main>
  );
}