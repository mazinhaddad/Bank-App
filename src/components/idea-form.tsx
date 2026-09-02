"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createIdea, type CreateIdeaState } from "@/app/actions";
import { CATEGORIES } from "@/lib/categories";

const initialState: CreateIdeaState = { error: null, success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-nbb-red px-4 py-2 text-sm font-medium text-white transition hover:bg-nbb-red-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Submit idea"}
    </button>
  );
}

export function IdeaForm() {
  const [state, formAction] = useActionState(createIdea, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded-lg border border-nbb-gold/30 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-nbb-red-dark">
        Submit an idea
      </h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder="e.g. Instant card freeze in the app"
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-nbb-gold-dark"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Short description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          maxLength={500}
          placeholder="What's the idea and why does it help?"
          className="resize-none rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-nbb-gold-dark"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue=""
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-nbb-gold-dark"
        >
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p className="text-sm text-nbb-red">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm font-medium text-green-700">
          Idea submitted. Thanks for the input!
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
