# UI/UX Design Brief — The Draftly Design System
## GenZ-native · Dark-first · Negative space · Card-based

> **The one rule:** every screen does ONE job, floating in calm negative space. Content is the hero; chrome whispers. If a screen feels crowded, delete things until it doesn't.

---

## 1. Design philosophy (5 principles)

1. **Calm canvas, loud moments.** 90% of the screen is quiet space; the ONE thing we want (Generate button, credit number) gets color, size, glow. Negative space = luxury = focus.
2. **Cards are the grammar.** Everything lives in rounded cards floating on the canvas — stats, variants, settings. Consistent radius, consistent elevation → instant familiarity.
3. **Motion with meaning.** 150–250ms ease-out on hover/tap; generation loading is *theatrical* (skeleton + rotating status lines) — the wait should feel alive, not blocked.
4. **Human, not corporate.** Copy talks like a friend ("channeling your vibe…", "copied 🔥"). Emoji as punctuation, not decoration. No stock-photo energy, no enterprise gray.
5. **Honest by design.** Credits always visible; "Not now" always available on paywalls; no countdown fake-timers, ever. Trust is a retention feature.

---

## 2. Color system (design tokens)

### Dark theme (default — the identity)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0A0A0F` | Canvas — near-black with violet undertone |
| `--surface` | `#12121A` | Card background |
| `--surface-2` | `#1A1A26` | Hover / nested elements |
| `--border` | `rgba(255,255,255,0.07)` | Hairline card borders |
| `--text` | `#F4F4FA` | Primary text |
| `--text-muted` | `#8E8EA3` | Secondary text (min 4.5:1 on surface) |
| **`--primary`** | **`#7C5CFF`** | Ultraviolet — primary actions, links, focus rings |
| `--primary-glow` | `rgba(124,92,255,0.35)` | Button/card glows (blur 24–40px) |
| `--accent` | `#FF4ECD` | Hot pink — gradient partner, favorite hearts, "Pro" badges |
| `--success` | `#A3F65A` | Lime — copy confirmations, credits positive |
| `--warning` | `#FFB020` | Low credits (≤3) |
| `--danger` | `#FF5C5C` | Destructive only (delete account) |

**Signature gradient:** `135deg, #7C5CFF → #FF4ECD` — used ONLY on: hero words, primary buttons (on hover), Pro badge, progress fill. Everywhere else = flat color. Scarcity keeps it special.

### Light theme (auto/system)
Canvas `#FAFAFC`, surface `#FFFFFF`, borders `rgba(10,10,20,0.08)`, text `#14141C`; primary/accent unchanged. Same components, token swap only.

### Rule of color restraint
> Any single screen shows at most: 1 gradient moment, 1 filled primary button, semantic colors only where meaning demands.

---

## 3. Typography

| Role | Font | Sizes (fluid clamp) | Notes |
|---|---|---|---|
| Display / hero | **Space Grotesk** (Google Fonts) | 40–64px, weight 700, -2% tracking | The GenZ voice font — geometric, confident |
| Headings / card titles | Space Grotesk | 18–24px, 600 | |
| Body / UI | **Inter** | 14–16px, 400/500, 1.6 line-height | Readable workhorse |
| Mono (code-ish accents, credits number) | **JetBrains Mono** or system mono | 12–14px, 500 | Credit counter, ledger, latency footer |

Number style: credit counts use **tabular-nums** so the meter never jitters.

---

## 4. Layout & negative space rules

- **Grid:** 12-col desktop (max-width **1200px** content, 24px gutter); mobile 4-col.
- **Reading measure:** long text (variants, legal) max **64ch**.
- **Spacing scale (4px base):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96. Section gaps on marketing: **96px** (that's the negative space breathing room).
- **The Focus Law:** every app screen = ONE primary action. Dashboard → Generate. Library → Search. Billing → Manage. If two buttons compete, one becomes text-link.
- **Sidebar (desktop):** 240px, icon+label, collapses to bottom tab bar (5 items) on mobile — thumb-reachable.
- **Safe margins:** 24px mobile, 32px tablet, centered max-width desktop.

---

## 5. Components (the kit — each gets an HTML mockup before build)

### Buttons
- Primary: `--primary` fill, white text, **pill (999px radius)**, 44–48px height (thumb-safe), hover: +glow + gradient shift, active: scale .98
- Secondary: `--surface-2` fill, `--border`, text button
- Ghost/text: no fill, primary text, underline on hover
- Destructive: outline danger; NEVER adjacent to primary confirm

### Cards
- Radius **20px**, `--surface` bg, 1px `--border`, padding 24px (16px mobile)
- Hover (interactive cards): translateY(-2px) + border→primary 40%
- **Stat card:** label (muted 12px caps) → value (Display font 32px) → delta (12px, success/danger)
- **Variant card:** content at 15px/1.7, footer row (Copy ♡ · model · time) muted

### Inputs
- Filled `--surface-2`, radius 14px, 48px height, 1px border → **primary + soft glow on focus** (never only color — 2px ring for a11y)
- Chips (tone/niche/platform): pill, surface fill; selected = primary fill white text; multi-select allowed where specified
- Textarea: same + char counter (muted → warning at 90%)

### Feedback
- Toast: bottom-center (mobile) / bottom-right, dark surface, icon + 1 line, auto-dismiss 3s, swipe-away
- Modal: dim canvas 60%, card max-width 420px, ONE message + max 2 actions
- Skeletons: surface-2 blocks with 1.5s shimmer sweep
- Empty states: generous space + 1 emoji + 1 line + 1 action. ("No posts yet. Your first is 30 seconds away → Generate")

### The credits meter (brand element)
Pill in header: `⚡ 14` — mono font; ≤3 turns `--warning` + gentle pulse; 0 = paywall trigger. This tiny component appears on every app screen: transparency as a feature.

---

## 6. Screen layout blueprints (text-mockups; HTML previews come at each gate)

```
┌─ DASHBOARD (desktop) ────────────────────────────────┐
│ [⚡ 473 credits]                [avatar]              │   header bar
│                                                       │
│  ┌─ credits ─┐ ┌─ this week ─┐ ┌─ top type ─┐        │   3 stat cards
│  └────────────┘ └─────────────┘ └────────────┘        │
│                                                       │
│  ┌─ QUICK GENERATE ──────────────────── ─────────┐   │   hero card (the focus)
│  │  [topic input..............................]  │   │
│  │  (IG caption)(Reel)(X thread)(LinkedIn)(+)   │   │
│  │                          [ ⚡ Generate — 1cr ]│   │
│  └────────────────────────────────────────────────┘   │
│                                                       │
│  RECENT  ─────────────────────────────               │
│  [card] [card] [card]         (96px of calm below)   │
└───────────────────────────────────────────────────────┘
```

```
┌─ GENERATE (mobile, the daily driver) ────┐
│ ⚡14                        [Generate tab]│
│ (IG)(Reel)(X)(in)(YT)  ← type pills row   │
│ ┌─ topic ───────────────────────┐ 168px  │
│ └────────────────────────────────┘        │
│ tone: (chill)(bold)(funny)                │
│ [ ⚡ Generate · 1 credit ]  ← full width   │
│ ───────────────────────────────           │
│ [variant 1 ▷ copy ♡]                      │
│ [variant 2 ▷ copy ♡]                      │
│ [variant 3 ▷ copy ♡]                      │
└────────────────────────────────────────────┘
```

---

## 7. Motion & micro-interactions

| Moment | Motion |
|---|---|
| Hover buttons/cards | 150ms ease-out: glow/lift |
| Copy button | Click → icon morphs to ✓, "copied 🔥" toast |
| Generation loading | Skeleton shimmer + rotating lines: "channeling your vibe…" / "sprinkling hashtags…" |
| Variant reveal | Stagger 80ms fade+rise |
| Paywall open | Scale .96→1 + fade, backdrop blur 8px |
| Credits spend | Number ticks down (300ms count animation) |

Motion respects `prefers-reduced-motion` (instant swaps, no shimmer).

---

## 8. Voice & copy tone

- Second person, contractions, sentence case: "You're out of credits — keep the streak."
- Emoji: max 1 per string, as tone not decoration
- Errors take blame, give exits: "That's on us — credit refunded. Try again?"
- Never: "Oops!", corporate voice, exclamation stacking, fake urgency

---

## 9. Accessibility (non-negotiable, tested at every gate)

- Contrast ≥4.5:1 text (checked: muted `#8E8EA3` on `#12121A` = 5.1:1 ✓)
- Focus visible everywhere (2px primary ring); full keyboard nav; `aria-label`s on icon buttons
- Tap targets ≥44×44px; motion honors reduced-motion; color never sole meaning (low credits = color + ⚡ pulse + count)

---

## 10. Do / Don't (the smell test)

| ✅ Do | ❌ Don't |
|---|---|
| One primary action per screen | Competing CTAs |
| 96px breathing room between sections | Fill every pixel |
| Gradient on ONE hero element per page | Gradient everywhere |
| Toast confirmations | Alert() dialogs |
| Real, witty microcopy | Lorem ipsum energy |
| Pro badge as quiet flex | Countdown timers, dark patterns |
