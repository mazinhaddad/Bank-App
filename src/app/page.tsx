import { supabase, type Comment, type Idea } from "@/lib/supabase";
import { IdeaForm } from "@/components/idea-form";
import { IdeaFeed } from "@/components/idea-feed";

export const dynamic = "force-dynamic";

async function getIdeas(): Promise<Idea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load ideas: ${error.message}`);
  }

  return data ?? [];
}

async function getCommentsByIdea(): Promise<Record<string, Comment[]>> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to load comments: ${error.message}`);
  }

  const byIdea: Record<string, Comment[]> = {};
  for (const comment of data ?? []) {
    (byIdea[comment.idea_id] ??= []).push(comment);
  }
  return byIdea;
}

export default async function Home() {
  const [ideas, commentsByIdea] = await Promise.all([
    getIdeas(),
    getCommentsByIdea(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <IdeaForm />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-nbb-red-dark">
          Ideas ({ideas.length})
        </h2>
        <IdeaFeed ideas={ideas} commentsByIdea={commentsByIdea} />
      </section>
    </main>
  );
}
