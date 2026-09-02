# Bank Ideas

Internal platform for employees to submit, browse, and filter ideas for improving the bank.

## Features

- Submit an idea with a title, short description, and category
- Feed/card layout showing all submitted ideas
- Filter ideas by category
- Ideas are stored in Supabase and persist across refreshes
- Leave comments on an idea to discuss or give feedback

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project at [supabase.com](https://supabase.com).

3. In the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) to create the `ideas` table and its row-level security policies, then run any files under [`supabase/migrations/`](supabase/migrations) in order.

4. Copy `.env.local.example` to `.env.local` and fill in your project's URL and anon key (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000), submit an idea, and refresh the page to confirm it's still there.

## Notes

- The `ideas` table has row-level security enabled with public read/insert policies, since this v1 has no authentication. Tighten these policies before adding user accounts.
- Categories are defined in [`src/lib/categories.ts`](src/lib/categories.ts).
