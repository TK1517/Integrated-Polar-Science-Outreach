"use client";

import { useRouter, useSearchParams } from "next/navigation";

const mediaTypes = [
  "All",
  "Video",
  "Image",
  "News",
  "Story",
  "Educational",
];

const regions = [
  "All",
  "Arctic",
  "Antarctica",
  "Both",
];

export default function MediaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch =
    searchParams.get("search") || "";

  const currentType =
    searchParams.get("type") || "All";

  const currentRegion =
    searchParams.get("region") || "All";

  function updateFilter(
    key: string,
    value: string
  ) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(
      `/media?${params.toString()}`
    );
  }

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

      {/* Search */}

      <div>
        <label
          htmlFor="media-search"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Search
        </label>

        <input
          id="media-search"
          type="search"
          defaultValue={currentSearch}
          placeholder="Search media, stories or topics..."
          onChange={(event) =>
            updateFilter(
              "search",
              event.target.value
            )
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Filters */}

      <div className="grid gap-4 md:grid-cols-2">

        <FilterSelect
          label="Media Type"
          value={currentType}
          options={mediaTypes}
          onChange={(value) =>
            updateFilter("type", value)
          }
        />

        <FilterSelect
          label="Polar Region"
          value={currentRegion}
          options={regions}
          onChange={(value) =>
            updateFilter("region", value)
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
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
