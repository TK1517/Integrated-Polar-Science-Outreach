import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const id = String(formData.get("id") || "").trim();

    const title = String(formData.get("title") || "").trim();
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

    if (!id || !title || !description) {
      return NextResponse.json(
        { error: "ID, title and description are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
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
        featured,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("UPDATE KNOWLEDGE ERROR:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    revalidatePath("/admin/knowledge");
    revalidatePath("/knowledge");

    return NextResponse.redirect(
      new URL("/admin/knowledge", request.url)
    );
  } catch (error) {
    console.error("UPDATE KNOWLEDGE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update knowledge resource." },
      { status: 500 }
    );
  }
}