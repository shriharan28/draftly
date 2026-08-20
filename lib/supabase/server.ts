/**
 * lib/supabase/server.ts
 *
 * The SERVER-SIDE Supabase client.
 * Used in Server Components, Server Actions, and Route Handlers.
 *
 * WHY `cookies()` from next/headers?
 * On the server, there's no `document.cookie`. Instead, Next.js gives us
 * a `cookies()` helper that reads from the HTTP request. The `createServerClient`
 * from @supabase/ssr bridges these two worlds — it reads the session from the
 * request cookie and can write a refreshed session back to the response cookie.
 *
 * The `await cookies()` pattern is required in Next.js App Router because
 * cookies() is async in newer Next.js versions.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
