"use client";

import { useMemo, useState, useTransition } from "react";
import { upvoteIdea } from "@/app/actions";
import { CATEGORIES } from "@/lib/categories";
import type { Idea } from "@/lib/supabase";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-nbb-gold/15 px-2.5 py-0.5 text-xs font-medium text-nbb-gold-dark">
      {category}
    </span>
  );
}

function UpvoteButton({ ideaId, upvotes }: { ideaId: string; upvotes: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await upvoteIdea(ideaId);
        })
      }
      className="inline-flex items-center gap-1.5 rounded-full border border-nbb-red/30 px-3 py-1 text-sm font-medium text-nbb-red-dark transition hover:border-nbb-red hover:bg-nbb-red/5 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={`Upvote (${upvotes} votes)`}
    >
      <span aria-hidden>▲</span>
      {upvotes}
    </button>
  );
}

export function IdeaFeed({ ideas }: { ideas: Idea[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredIdeas = useMemo(() => {
    if (activeCategory === "All") return ideas;
    return ideas.filter((idea) => idea.category === activeCategory);
  }, [ideas, activeCategory]);

  const filters = ["All", ...CATEGORIES];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "border-nbb-red bg-nbb-red text-white"
                  : "border-black/15 bg-transparent text-current hover:border-nbb-red"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredIdeas.length === 0 ? (
        <p className="rounded-lg border border-dashed border-black/15 p-6 text-center text-sm text-black/60">
          No ideas yet{activeCategory !== "All" ? ` in "${activeCategory}"` : ""}.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredIdeas.map((idea) => (
            <article
              key={idea.id}
              className="flex flex-col gap-2 rounded-lg border border-nbb-gold/30 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-snug">{idea.title}</h3>
                <CategoryBadge category={idea.category} />
              </div>
              <p className="text-sm text-black/70">{idea.description}</p>
              <div className="mt-auto flex items-center justify-between pt-1">
                <p className="text-xs text-black/40">
                  Submitted {formatDate(idea.created_at)}
                </p>
                <UpvoteButton ideaId={idea.id} upvotes={idea.upvotes} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
