/**
 * components/ui/icons.tsx
 *
 * Official Pixel-Perfect Vector Logos for Content Formats:
 * - Instagram: Sunset gradient rounded app icon with white camera lens & flash
 * - Reels: Instagram Reels sunset-purple gradient app icon with top slashes & play symbol
 * - X / Twitter: Official white 𝕏 logo
 * - LinkedIn: Official #0A66C2 blue app badge
 * - YouTube: Official #FF0000 red play badge
 */
import React from "react";

export function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="ig-app-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FCAF45" />
          <stop offset="25%" stopColor="#FF7A00" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      {/* App rounded square background */}
      <rect width="24" height="24" rx="6.5" fill="url(#ig-app-grad)" />
      {/* Outer camera stroke */}
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="4.2"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.8"
      />
      {/* Inner lens circle */}
      <circle
        cx="12"
        cy="12"
        r="3.4"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.8"
      />
      {/* Flash dot */}
      <circle cx="16.3" cy="7.7" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}

export function ReelIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id="reels-app-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="35%" stopColor="#FF0069" />
          <stop offset="70%" stopColor="#D300C5" />
          <stop offset="100%" stopColor="#7638FA" />
        </linearGradient>
      </defs>
      {/* Reels App Badge */}
      <rect width="24" height="24" rx="6.5" fill="url(#reels-app-grad)" />

      {/* Top Clapperboard Divider */}
      <rect x="2.5" y="8" width="19" height="1.5" fill="#FFFFFF" />

      {/* Top Clapper Slashes */}
      <path d="M6 3.5h2.5l-1.8 4.5H4.2z" fill="#FFFFFF" />
      <path d="M11.5 3.5h2.5l-1.8 4.5h-2.5z" fill="#FFFFFF" />
      <path d="M17 3.5h2.5l-1.8 4.5h-2.5z" fill="#FFFFFF" />

      {/* Center White Play Triangle */}
      <path
        d="M10.2 11.2a1 1 0 0 1 1.55-.83l4.5 3.1a1 1 0 0 1 0 1.66l-4.5 3.1a1 1 0 0 1-1.55-.83v-6.2z"
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
      <rect width="24" height="24" rx="6" fill="#0A66C2" />
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
