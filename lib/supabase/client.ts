/**
 * lib/supabase/client.ts
 *
 * The BROWSER-SIDE Supabase client.
 * Used in Client Components ("use client") that need to talk to Supabase.
 *
 * WHY a separate file? Because the browser and server need different setups:
 * - Browser: uses the anon key, reads cookies from document.cookie
 * - Server: reads cookies from the HTTP request headers
 *
 * The `createBrowserClient` from @supabase/ssr handles cookie management
 * automatically so sessions persist across page refreshes.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
