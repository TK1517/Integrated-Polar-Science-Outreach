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
    <Link
      href={`/media/${id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-sm"
    >
      {thumbnailUrl ? (
        <div className="aspect-video overflow-hidden bg-slate-100">
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-slate-100">
          <span className="text-sm text-slate-400">
            Polar Science Media
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            {mediaType || "Media"}
          </span>

        </div>

        <h2 className="mt-4 text-xl font-semibold leading-7 text-slate-900 group-hover:text-sky-700">
          {title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {description ||
            "Explore this polar science media resource."}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 mt-6">
          <span className="text-xs text-slate-400">
            {publishedDate
              ? new Date(
                  publishedDate
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Date unavailable"}
          </span>

          <span className="text-sm font-medium text-slate-900">
            View media →
          </span>
        </div>
      </div>
    </Link>
  );
}