/**
 * lib/supabase/admin.ts
 *
 * The SERVICE ROLE Supabase client.
 *
 * ⚠️  DANGER ZONE — This bypasses ALL Row Level Security.
 * It has god-mode access to your entire database.
 *
 * ONLY use this in:
 * - /api/stripe/webhook (to grant credits after payment — the user is not "logged in" here)
 * - /api/cron/reconcile (background jobs — no user session)
 *
 * NEVER import this in Client Components or pass it to the browser.
 * NEVER use this in pages or user-facing API routes.
 *
 * If you find yourself wanting to use this client somewhere new,
 * stop and think — there's almost certainly a better way with RLS.
 */
import { createClient } from "@supabase/supabase-js";

// This client is created ONCE (module-level singleton) and reused.
// It's safe here because this file is server-only.
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
