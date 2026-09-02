import { supabase, type Idea } from "@/lib/supabase";
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

export default async function Home() {
  const ideas = await getIdeas();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
      <IdeaForm />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-nbb-red-dark">
          Ideas ({ideas.length})
        </h2>
        <IdeaFeed ideas={ideas} />
      </section>
    </main>
  );
}
