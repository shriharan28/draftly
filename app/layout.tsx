import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import PostHogPageView from "@/components/analytics/posthog-pageview";
import { Suspense } from "react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://draftly-pink.vercel.app"),
  title: {
    default: "Draftly — AI Content Studio",
    template: "%s · Draftly",
  },
  description:
    "Turn your ideas into platform-ready content — captions, threads, hooks — in your voice, in seconds.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Draftly — AI Content Studio",
    description: "Turn your ideas into platform-ready content in seconds.",
    url: "https://draftly-pink.vercel.app",
    siteName: "Draftly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Draftly — AI Content Studio",
    description: "Turn your ideas into platform-ready content in seconds.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <ToastProvider>{children}</ToastProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
