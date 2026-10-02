import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import EditPublicationForm from "./EditPublicationForm";
import DeletePublicationButton from "./DeletePublicationButton";
import { updatePublication } from "./actions";

async function createPublication(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const authors = String(formData.get("authors") || "").trim();
  const institution = String(formData.get("institution") || "").trim();
  const abstract = String(formData.get("abstract") || "").trim();
  const keywords = String(formData.get("keywords") || "").trim();
  const researchArea = String(
    formData.get("research_area") || ""
  ).trim();
  const region = String(formData.get("region") || "").trim();
  const publicationYearRaw = String(
    formData.get("publication_year") || ""
  ).trim();
  const doi = String(formData.get("doi") || "").trim();
  const pdfUrl = String(formData.get("pdf_url") || "").trim();
  const externalUrl = String(
    formData.get("external_url") || ""
  ).trim();

  const published = formData.get("published") === "on";

  if (!title || !abstract) {
    throw new Error("Title and abstract are required.");
  }

  const publicationYear = publicationYearRaw
    ? Number(publicationYearRaw)
    : null;

  const { error } = await supabase.from("publications").insert({
    title,
    authors: authors || null,
    institution: institution || null,
    abstract,
    keywords: keywords || null,
    research_area: researchArea || null,
    region: region || null,
    publication_year: publicationYear,
    doi: doi || null,
    pdf_url: pdfUrl || null,
    external_url: externalUrl || null,
    published,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/publications");
  revalidatePath("/publications");
}

async function deletePublication(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Publication ID is missing.");
  }

  const { error } = await supabase
    .from("publications")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/publications");
  revalidatePath("/publications");
}

export default async function AdminPublicationsPage() {
  const { data: publications, error } = await supabase
    .from("publications")
    .select("*")
    .order("publication_year", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Admin
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Publications
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            Manage research publications in the Polar Science repository.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Add Publication */}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-950">
            Add Publication
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add a new research publication to the repository.
          </p>

          <form action={createPublication} className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Title
                </label>

                <input
                  name="title"
                  required
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="Publication title"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Authors
                </label>

                <input
                  name="authors"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="Author names"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Institution
                </label>

                <input
                  name="institution"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="Research institution"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Research Area
                </label>

                <input
                  name="research_area"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="Climate Science"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Region
                </label>

                <input
                  name="region"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="Antarctica"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Publication Year
                </label>

                <input
                  name="publication_year"
                  type="number"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="2026"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  DOI
                </label>

                <input
                  name="doi"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="10.xxxx/xxxxx"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  PDF URL
                </label>

                <input
                  name="pdf_url"
                  type="url"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  External URL
                </label>

                <input
                  name="external_url"
                  type="url"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Keywords
                </label>

                <input
                  name="keywords"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                  placeholder="ice, climate, polar"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Abstract
              </label>

              <textarea
                name="abstract"
                required
                rows={6}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                placeholder="Publication abstract"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="published"
                className="h-4 w-4"
              />
              Published
            </label>

            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Publication
            </button>
          </form>
        </div>

        {/* Existing Publications */}

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-950">
            Existing Publications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {publications?.length || 0} publication(s) in the repository.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Unable to load publications.
            <br />
            {error.message}
          </div>
        ) : publications && publications.length > 0 ? (
          <div className="mt-6 space-y-5">
            {publications.map((publication) => (
              <div
                key={publication.id}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">
                      {publication.title}
                    </h3>

                    {publication.authors && (
                      <p className="mt-2 text-sm text-slate-500">
                        {publication.authors}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {publication.research_area && (
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                          {publication.research_area}
                        </span>
                      )}

                      {publication.region && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {publication.region}
                        </span>
                      )}

                      {publication.publication_year && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {publication.publication_year}
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          publication.published
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {publication.published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-3">
                    <EditPublicationForm
                      publication={{
                        id: publication.id,
                        title: publication.title,
                        authors: publication.authors,
                        institution: publication.institution,
                        abstract: publication.abstract,
                        keywords: publication.keywords,
                        research_area: publication.research_area,
                        region: publication.region,
                        publication_year:
                          publication.publication_year,
                        doi: publication.doi,
                        pdf_url: publication.pdf_url,
                        external_url: publication.external_url,
                        published: publication.published,
                      }}
                      updateAction={updatePublication}
                    />

                    <DeletePublicationButton
                      publicationId={publication.id}
                      deleteAction={deletePublication}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No publications found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Add your first publication above.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}