import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

import EditMediaForm from "./EditMediaForm";
import DeleteMediaButton from "./DeleteMediaButton";
import { updateMedia } from "./actions";

async function createMedia(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const mediaType = String(formData.get("media_type") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const content = String(formData.get("content") || "").trim();

  const publishedDate = String(
    formData.get("published_date") || ""
  ).trim();

  const thumbnailUrl = String(
    formData.get("thumbnail_url") || ""
  ).trim();

  const videoUrl = String(
    formData.get("video_url") || ""
  ).trim();

  const externalUrl = String(
    formData.get("external_url") || ""
  ).trim();

  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";

  if (!title || !mediaType) {
    throw new Error("Title and media type are required.");
  }

  const { error } = await supabase.from("media").insert({
    title,
    media_type: mediaType,
    description: description || null,
    content: content || null,
    published_date: publishedDate || null,
    thumbnail_url: thumbnailUrl || null,
    video_url: videoUrl || null,
    external_url: externalUrl || null,
    featured,
    published,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/media");
  revalidatePath("/media");
}

async function deleteMedia(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Media ID is missing.");
  }

  const { error } = await supabase
    .from("media")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/media");
  revalidatePath("/media");
}

export default async function AdminMediaPage() {
  const { data: media, error } = await supabase
    .from("media")
    .select("*")
    .order("published_date", {
      ascending: false,
    });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Manage Media
          </h1>

          <p className="mt-3 text-slate-500">
            Add and manage videos, images and stories.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Add Media */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-950">
            Add Media
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Add a new video, image, story or other media resource.
          </p>

          <form action={createMedia} className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Title *
                </label>

                <input
                  name="title"
                  required
                  placeholder="Life in Antarctica"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Media Type */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Media Type *
                </label>

                <select
                  name="media_type"
                  required
                  defaultValue=""
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
                >
                  <option value="" disabled>
                    Select media type
                  </option>

                  <option value="News">News</option>
                  <option value="Video">Video</option>
                  <option value="Photo Story">
                    Photo Story
                  </option>
                  <option value="Announcement">
                    Announcement
                  </option>
                  <option value="Interview">
                    Interview
                  </option>
                </select>
              </div>

              {/* Published Date */}
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

              {/* Thumbnail URL */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Thumbnail URL
                </label>

                <input
                  name="thumbnail_url"
                  type="url"
                  placeholder="https://..."
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Video URL
                </label>

                <input
                  name="video_url"
                  type="url"
                  placeholder="https://youtube.com/..."
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>

              {/* External URL */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  External URL
                </label>

                <input
                  name="external_url"
                  type="url"
                  placeholder="https://..."
                  className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                rows={4}
                placeholder="Short description of this media..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Content
              </label>

              <textarea
                name="content"
                rows={7}
                placeholder="Detailed content or story..."
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="published"
                  className="h-4 w-4"
                />
                Published
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="featured"
                  className="h-4 w-4"
                />
                Featured
              </label>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add Media
            </button>
          </form>
        </div>

        {/* Existing Media */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-950">
            Existing Media
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {media?.length || 0} media resource(s) in the
            repository.
          </p>
        </div>

        {/* Error */}
        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p className="font-semibold">
              Unable to load media.
            </p>

            <p className="mt-2">{error.message}</p>
          </div>
        ) : media && media.length > 0 ? (
          <div className="mt-6 space-y-5">
            {media.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.media_type && (
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                          {item.media_type}
                        </span>
                      )}

                      {item.published_date && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                          {item.published_date}
                        </span>
                      )}

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.published
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.published
                          ? "Published"
                          : "Draft"}
                      </span>

                      {item.featured && (
                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Edit + Delete */}
                  <div className="flex shrink-0 gap-3">
                    <EditMediaForm
                      media={{
                        id: item.id,
                        title: item.title,
                        media_type: item.media_type,
                        description: item.description,
                        content: item.content,
                        published_date: item.published_date,
                        thumbnail_url: item.thumbnail_url,
                        video_url: item.video_url,
                        external_url: item.external_url,
                        featured: item.featured,
                        published: item.published,
                      }}
                      updateAction={updateMedia}
                    />

                    <DeleteMediaButton
                      mediaId={item.id}
                      deleteAction={deleteMedia}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              No media resources found.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}