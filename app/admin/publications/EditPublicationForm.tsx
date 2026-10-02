"use client";

import { useState } from "react";

type Publication = {
  id: string;
  title: string;
  authors: string | null;
  institution: string | null;
  abstract: string | null;
  keywords: string | null;
  research_area: string | null;
  region: string | null;
  publication_year: number | null;
  doi: string | null;
  pdf_url: string | null;
  external_url: string | null;
  published: boolean;
};

type Props = {
  publication: Publication;
  updateAction: (formData: FormData) => Promise<void>;
};

export default function EditPublicationForm({
  publication,
  updateAction,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-6">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Edit Publication
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the research publication details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                ✕
              </button>
            </div>

            <form action={updateAction} className="mt-6 space-y-6">
              <input
                type="hidden"
                name="id"
                value={publication.id}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Title
                </label>

                <input
                  name="title"
                  required
                  defaultValue={publication.title}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Authors
                  </label>

                  <input
                    name="authors"
                    defaultValue={publication.authors || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Institution
                  </label>

                  <input
                    name="institution"
                    defaultValue={publication.institution || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Abstract
                </label>

                <textarea
                  name="abstract"
                  required
                  rows={6}
                  defaultValue={publication.abstract || ""}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Keywords
                </label>

                <input
                  name="keywords"
                  defaultValue={publication.keywords || ""}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Research Area
                  </label>

                  <input
                    name="research_area"
                    defaultValue={publication.research_area || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Region
                  </label>

                  <input
                    name="region"
                    defaultValue={publication.region || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Publication Year
                  </label>

                  <input
                    name="publication_year"
                    type="number"
                    defaultValue={publication.publication_year || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    DOI
                  </label>

                  <input
                    name="doi"
                    defaultValue={publication.doi || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    PDF URL
                  </label>

                  <input
                    name="pdf_url"
                    type="url"
                    defaultValue={publication.pdf_url || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    External URL
                  </label>

                  <input
                    name="external_url"
                    type="url"
                    defaultValue={publication.external_url || ""}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={publication.published}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Publish this research paper
              </label>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}