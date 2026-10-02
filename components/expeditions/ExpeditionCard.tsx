import Link from "next/link";

type ExpeditionCardProps = {
  id: string;
  title: string;
  description: string | null;
  region: string | null;
  location: string | null;
  institution: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
};

export default function ExpeditionCard({
  id,
  title,
  description,
  region,
  location,
  institution,
  startDate,
  endDate,
  status,
}: ExpeditionCardProps) {
  return (
    <Link
      href={`/expeditions/${id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          {region || "Polar Region"}
        </span>

        {status && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            {status}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-xl font-semibold leading-7 text-slate-900 group-hover:text-sky-700">
        {title}
      </h2>

      {location && (
        <p className="mt-3 text-sm font-medium text-slate-600">
          📍 {location}
        </p>
      )}

      <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-500">
        {description ||
          "Explore this polar science expedition."}
      </p>

      {institution && (
        <p className="mt-4 text-xs text-slate-400">
          {institution}
        </p>
      )}

      <div className="mt-auto border-t border-slate-100 pt-5 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {startDate
              ? new Date(startDate).toLocaleDateString(
                  "en-IN",
                  {
                    month: "short",
                    year: "numeric",
                  }
                )
              : "Date unavailable"}
          </span>

          <span className="text-sm font-medium text-slate-900">
            View expedition →
          </span>
        </div>
      </div>
    </Link>
  );
}