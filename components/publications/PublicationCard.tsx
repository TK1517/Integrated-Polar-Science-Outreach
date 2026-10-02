import Link from "next/link";

type PublicationCardProps = {
  id: string;
  title: string;
  authors: string | null;
  institution: string | null;
  abstract: string | null;
  researchArea: string | null;
  region: string | null;
  year: number | null;
};

export default function PublicationCard({
  id,
  title,
  authors,
  institution,
  abstract,
  researchArea,
  region,
  year,
}: PublicationCardProps) {
  return (
    <Link
      href={`/publications/${id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          {researchArea || "Research"}
        </span>

        {year && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            {year}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-xl font-semibold leading-7 text-slate-900 group-hover:text-sky-700">
        {title}
      </h2>

      {authors && (
        <p className="mt-3 text-sm font-medium text-slate-600">
          {authors}
        </p>
      )}

      {institution && (
        <p className="mt-1 text-xs text-slate-400">
          {institution}
        </p>
      )}

      <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-500">
        {abstract || "Explore this research publication."}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 mt-6">
        {region && (
          <span className="text-xs text-slate-400">
            {region}
          </span>
        )}

        <span className="text-sm font-medium text-slate-900">
          View publication →
        </span>
      </div>
    </Link>
  );
}