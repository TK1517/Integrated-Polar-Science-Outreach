"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function updateKnowledge(formData: FormData) {
  const id = String(formData.get("id") || "").trim();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const resourceType = String(formData.get("resource_type") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const author = String(formData.get("author") || "").trim();

  const publishedDate = String(
    formData.get("published_date") || ""
  ).trim();

  const imageUrl = String(
    formData.get("image_url") || ""
  ).trim();

  const externalUrl = String(
    formData.get("external_url") || ""
  ).trim();

  const published = formData.get("published") === "true";
  const featured = formData.get("featured") === "true";


  if (!id) {
    throw new Error("Resource ID is missing.");
  }

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  const { data, error } = await supabase
    .from("knowledge_resources")
    .update({
      title,
      description,
      content,
      category,
      resource_type: resourceType,
      region,
      author,
      published_date: publishedDate || null,
      image_url: imageUrl || null,
      external_url: externalUrl || null,
      published,
      featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("UPDATE KNOWLEDGE ERROR:", error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Update matched 0 rows. Check the resource ID and Supabase RLS UPDATE policy."
    );
  }

  revalidatePath("/admin/knowledge");
  revalidatePath("/knowledge");

  return;
}