"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function updateMedia(formData: FormData) {
  const id = String(formData.get("id") || "").trim();

  const title = String(formData.get("title") || "").trim();
  const mediaType = String(
    formData.get("media_type") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const content = String(
    formData.get("content") || ""
  ).trim();

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

  const featured =
    formData.get("featured") === "on";

  const published =
    formData.get("published") === "on";

  if (!id) {
    throw new Error("Media ID is missing.");
  }

  if (!title || !mediaType) {
    throw new Error(
      "Title and media type are required."
    );
  }

  const { data, error } = await supabase
    .from("media")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Update matched 0 rows. Check the media ID and Supabase RLS UPDATE policy."
    );
  }

  revalidatePath("/admin/media");
  revalidatePath("/media");
}