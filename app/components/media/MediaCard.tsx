import Link from "next/link";

type MediaCardProps = {
  id: string;
  title: string;
  description: string | null;
  mediaType: string | null;
  thumbnailUrl: string | null;
  publishedDate: string | null;
};

export default function MediaCard({
  id,
  title,
  description,
  mediaType,
  thumbnailUrl,
  publishedDate,
}: MediaCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Thumbnail */}
      <div className="aspect-video bg-slate-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Polar Science Media
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-7">
        {mediaType && (
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            {mediaType}
          </span>
        )}

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
          {description || "Media information will be available soon."}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
          <span className="text-xs text-slate-400">
            {publishedDate || "Date unavailable"}
          </span>

          <Link
            href={`/media/${id}`}
            className="text-sm font-medium text-slate-950 hover:text-sky-600"
          >
            View media →
          </Link>
        </div>
      </div>
    </article>
  );
}