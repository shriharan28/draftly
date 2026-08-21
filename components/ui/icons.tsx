/**
 * components/ui/icons.tsx
 *
 * Official Full-Color Brand SVG Vector Logos for Content Formats.
 * (Instagram Gradient, LinkedIn Blue, YouTube Red, X White, Reels Gradient).
 */
import React from "react";

export function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <path
        d="M12 6.865A5.135 5.135 0 1 0 17.135 12 5.135 5.135 0 0 0 12 6.865zm0 8.468A3.333 3.333 0 1 1 15.333 12 3.333 3.333 0 0 1 12 15.333zm5.882-9.215a1.2 1.2 0 1 1-1.2-1.2 1.2 1.2 0 0 1 1.2 1.2zM12 2.162c3.204 0 3.584.012 4.85.07a6.643 6.643 0 0 1 2.228.413 3.725 3.725 0 0 1 2.13 2.13 6.643 6.643 0 0 1 .413 2.228c.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85a6.643 6.643 0 0 1-.413 2.228 3.725 3.725 0 0 1-2.13 2.13 6.643 6.643 0 0 1-2.228.413c-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07a6.643 6.643 0 0 1-2.228-.413 3.725 3.725 0 0 1-2.13-2.13 6.643 6.643 0 0 1-.413-2.228c-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85a6.643 6.643 0 0 1 .413-2.228 3.725 3.725 0 0 1 2.13-2.13 6.643 6.643 0 0 1 2.228-.413c1.266-.058 1.646-.07 4.85-.07"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function ReelIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="reel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#833AB4" />
          <stop offset="50%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#FCB045" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#reel-grad)" />
      <path
        d="M7 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm1 2v2h2.5L11 8H8zm4.5 0l-.5 2h2.5l.5-2h-2.5zm4.5 0l-.5 2H19V8h-1.5zM8 11.5v5h2.5l-.5-5H8zm4 0l.5 5h2.5l-.5-5H12z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function XIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#FFFFFF" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="5" fill="#0A66C2" />
      <path
        d="M6.94 5a1.44 1.44 0 1 1-1.44 1.44A1.44 1.44 0 0 1 6.94 5zm-1.22 4.11h2.44v9.78H5.72V9.11zm4.1 0h2.34v1.34h.03a2.57 2.57 0 0 1 2.31-1.27c2.47 0 2.93 1.63 2.93 3.74v6H14.99v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81v5.41H9.82V9.11z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function YouTubeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path d="M9.75 8.25v7.5l6.5-3.75-6.5-3.75z" fill="#FFFFFF" />
    </svg>
  );
}
