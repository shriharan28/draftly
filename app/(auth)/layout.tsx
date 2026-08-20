/**
 * app/(auth)/layout.tsx
 *
 * The layout for auth pages (/login, /signup).
 * A clean centered card on a dark background — no sidebar, no nav clutter.
 * The user's only job here is to sign in or create an account.
 *
 * WHY a separate layout? Route groups let us have different layouts
 * for different sections of the app without affecting the URL.
 * (auth) doesn't appear in the URL — it's just a folder for organization.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {children}
    </div>
  );
}
