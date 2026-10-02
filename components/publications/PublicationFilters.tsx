"use client";

import { useRouter, useSearchParams } from "next/navigation";

const regions = ["All", "Arctic", "Antarctica", "Both"];

const researchAreas = [
  "All",
  "Climate Science",
  "Oceanography",
  "Glaciology",
  "Biology",
  "Atmospheric Science",
  "Geology",
  "Environmental Science",
];

const years = [
  "All",
  "2026",
  "2025",
  "2024",
  "2023",
  "2022",
];

export default function PublicationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentRegion = searchParams.get("region") || "All";
  const currentArea = searchParams.get("area") || "All";
  const currentYear = searchParams.get("year") || "All";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/publications?${params.toString()}`);
  }

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <label
          htmlFor="publication-search"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Search
        </label>

        <input
          id="publication-search"
          type="search"
          defaultValue={currentSearch}
          placeholder="Search publications, authors or research..."
          onChange={(event) =>
            updateFilter("search", event.target.value)
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FilterSelect
          label="Region"
          value={currentRegion}
          options={regions}
          onChange={(value) =>
            updateFilter("region", value)
          }
        />

        <FilterSelect
          label="Research Area"
          value={currentArea}
          options={researchAreas}
          onChange={(value) =>
            updateFilter("area", value)
          }
        />

        <FilterSelect
          label="Year"
          value={currentYear}
          options={years}
          onChange={(value) =>
            updateFilter("year", value)
          }
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}