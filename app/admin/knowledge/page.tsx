import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import EditKnowledgeForm from "./EditKnowledgeForm";
import { updateKnowledge } from "./actions";
import DeleteKnowledgeButton from "./DeleteKnowledgeButton";

async function createKnowledge(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const resourceType = String(formData.get("resource_type") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const author = String(formData.get("author") || "").trim();
  const publishedDate = String(formData.get("published_date") || "").trim();
  const imageUrl = String(formData.get("image_url") || "").trim();
  const externalUrl = String(formData.get("external_url") || "").trim();

  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";

  if (!title || !slug || !description) {
    return;
  }

  const { error } = await supabase.from("knowledge_resources").insert({
    title,
    slug,
    description,
    content,
    category,
    resource_type: resourceType,
    region,
    author,
    published_date: publishedDate || null,
    image_url: imageUrl || null,
    external_url: externalUrl || null,
    featured,
    published,
  });

  if (error) {
    console.error("CREATE KNOWLEDGE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/knowledge");
  revalidatePath("/knowledge");
}

async function deleteKnowledge(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");

  if (!id) {
    return;
  }

  const { error } = await supabase
    .from("knowledge_resources")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE KNOWLEDGE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/knowledge");
  revalidatePath("/knowledge");
}

export default async function AdminKnowledgePage() {
  const { data: resources, error } = await supabase
    .from("knowledge_resources")
    .select(
      "id, title, slug, description, content, category, resource_type, region, author, published_date, image_url, external_url, featured, published"
    )
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Administration
          </p>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Manage Knowledge
              </h1>

              <p className="mt-3 text-slate-500">
                Add, edit and manage polar science knowledge resources.
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">
              {resources?.length ?? 0} resources
            </div>
          </div>
        </div>
      </section>

      {/* Add Resource */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-950">
            Add Knowledge Resource
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create a new resource for the public knowledge repository.
          </p>

          <form action={createKnowledge} className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Title *
                </label>

                <input
                  name="title"
                  required
                  placeholder="Understanding Antarctic Ice Sheets"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Slug *
                </label>

                <input
                  name="slug"
                  required
                  placeholder="understanding-antarctic-ice-sheets"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>

                <input
                  name="category"
                  placeholder="Glaciology"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Resource Type
                </label>

                <input
                  name="resource_type"
                  placeholder="Educational Resource"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Region
                </label>

                <input
                  name="region"
                  placeholder="Antarctica"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Author
                </label>

                <input
                  name="author"
                  placeholder="Polar Science Research Team"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Published Date
                </label>

                <input
                  type="date"
                  name="published_date"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Image URL
                </label>

                <input
                  name="image_url"
                  placeholder="https://..."
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description *
              </label>

              <textarea
                name="description"
                required
                rows={3}
                placeholder="Short description of the resource..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Content
              </label>

              <textarea
                name="content"
                rows={8}
                placeholder="Full educational content..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                External URL
              </label>

              <input
                name="external_url"
                placeholder="https://..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked
                />
                Published
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="featured" />
                Featured
              </label>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white hover:bg-sky-700"
            >
              Add Resource
            </button>
          </form>
        </div>

        {/* Existing Resources */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-950">
            Existing Resources
          </h2>

          {error ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              Unable to load knowledge resources.
            </div>
          ) : resources && resources.length > 0 ? (
            <div className="mt-6 space-y-5">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-2">
                        {resource.category && (
                          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                            {resource.category}
                          </span>
                        )}

                        {resource.region && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                            {resource.region}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            resource.published
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {resource.published ? "Published" : "Draft"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold text-slate-950">
                        {resource.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {resource.description}
                      </p>

                      <p className="mt-3 text-xs text-slate-400">
                        /{resource.slug}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <EditKnowledgeForm
                        resource={{
                          id: resource.id,
                          title: resource.title,
                          description: resource.description,
                          content: resource.content,
                          category: resource.category,
                          resource_type: resource.resource_type,
                          region: resource.region,
                          author: resource.author,
                          published_date: resource.published_date,
                          image_url: resource.image_url,
                          external_url: resource.external_url,
                          featured: resource.featured,
                          published: resource.published,
                        }}
                        updateAction={updateKnowledge}
                      />

                      <DeleteKnowledgeButton
  resourceId={resource.id}
  deleteAction={deleteKnowledge}
/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No knowledge resources found.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}