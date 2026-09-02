"use client";

import { useMemo, useState, useTransition } from "react";
import { addComment, updateIdeaStatus, upvoteIdea } from "@/app/actions";
import { CATEGORIES } from "@/lib/categories";
import { STATUSES, type Status } from "@/lib/statuses";
import type { Comment, Idea } from "@/lib/supabase";

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

const STATUS_STYLES: Record<Status, string> = {
  Submitted: "bg-black/[0.06] text-black/60",
  "Under Review": "bg-nbb-gold/15 text-nbb-gold-dark",
  Approved: "bg-blue-500/10 text-blue-700",
  Implemented: "bg-green-500/10 text-green-700",
};

function StatusSelect({ ideaId, status }: { ideaId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const style = STATUS_STYLES[status as Status] ?? STATUS_STYLES.Submitted;

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          await updateIdeaStatus(ideaId, next);
        });
      }}
      className={`rounded-full border-none px-2.5 py-0.5 text-xs font-medium outline-none disabled:cursor-not-allowed disabled:opacity-60 ${style}`}
    >
      {STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
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

function CommentsSection({
  ideaId,
  comments,
}: {
  ideaId: string;
  comments: Comment[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = draft;
    startTransition(async () => {
      const result = await addComment(ideaId, body);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setDraft("");
      }
    });
  }

  return (
    <div className="border-t border-black/10 pt-2">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="text-xs font-medium text-nbb-red-dark hover:underline"
      >
        {isOpen ? "Hide" : "Show"} comments ({comments.length})
      </button>

      {isOpen && (
        <div className="mt-2 flex flex-col gap-2">
          {comments.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="rounded-md bg-black/[0.03] px-2.5 py-1.5 text-xs text-black/70"
                >
                  {comment.body}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a comment…"
              rows={2}
              maxLength={500}
              required
              className="resize-none rounded-md border border-black/15 bg-transparent px-2.5 py-1.5 text-xs outline-none focus:border-nbb-gold-dark"
            />
            {error && <p className="text-xs text-nbb-red">{error}</p>}
            <button
              type="submit"
              disabled={isPending || !draft.trim()}
              className="self-start rounded-md bg-nbb-red px-3 py-1 text-xs font-medium text-white transition hover:bg-nbb-red-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Posting…" : "Post comment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function IdeaFeed({
  ideas,
  commentsByIdea,
}: {
  ideas: Idea[];
  commentsByIdea: Record<string, Comment[]>;
}) {
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
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <CategoryBadge category={idea.category} />
                  <StatusSelect ideaId={idea.id} status={idea.status} />
                </div>
              </div>
              <p className="text-sm text-black/70">{idea.description}</p>
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-black/40">
                  Submitted {formatDate(idea.created_at)}
                </p>
                <UpvoteButton ideaId={idea.id} upvotes={idea.upvotes} />
              </div>
              <CommentsSection
                ideaId={idea.id}
                comments={commentsByIdea[idea.id] ?? []}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
