"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/categories";

export type CreateIdeaState = {
  error: string | null;
  success: boolean;
};

export async function createIdea(
  _prevState: CreateIdeaState,
  formData: FormData
): Promise<CreateIdeaState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!title || !description || !category) {
    return { error: "All fields are required.", success: false };
  }

  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { error: "Please choose a valid category.", success: false };
  }

  const { error } = await supabase
    .from("ideas")
    .insert({ title, description, category });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/");
  return { error: null, success: true };
}

export async function upvoteIdea(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc("increment_upvotes", { idea_id: id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null };
}

export async function addComment(
  ideaId: string,
  body: string
): Promise<{ error: string | null }> {
  const trimmed = body.trim();

  if (!trimmed) {
    return { error: "Comment can't be empty." };
  }

  const { error } = await supabase
    .from("comments")
    .insert({ idea_id: ideaId, body: trimmed });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null };
}
