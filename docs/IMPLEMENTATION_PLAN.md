# Implementation Plan — Stage-by-stage Build
## Draftly · ~5 weeks at 5+ hrs/day

**How to use this file:**
- Work top to bottom. Tick boxes `- [ ]` → `- [x]` as you complete them.
- **🎨 MOCKUP GATE** = before building that UI, an HTML preview is created in `mockups/`, opened in browser, approved/adjusted. No pixel gets coded before you've seen it.
- **Every session ends with:** update `PROGRESS_LOG.md` (2 minutes — this is your save file).
- DoD = Definition of Done. A stage isn't done until its DoD passes.

---

## Timeline overview

| Stage | What | Days | Builds the skill of… |
|---|---|---|---|
| 0 ✅ | Product Bible (this docs/) | 1 | Thinking before coding |
| 1 ✅ | Accounts + environment | 1–2 | Tooling, terminal, Git |
| 2 ✅ | Skeleton app + deploy pipeline | 2–3 | Next.js, Tailwind, Vercel, GitHub flow |
| 3 | Auth + onboarding | 4–5 | Supabase, RLS, forms, middleware |
| 4 | Generator core + credits | 6–8 | AI integration, API design, ledger, the product |
| 5 | Stripe billing + paywall | 5–6 | Payments, webhooks, entitlements |
| 6 | Landing, emails, polish | 5–6 | Marketing UI, SEO, edge states |
| 7 | Launch armor + go-live | 4–5 | Monitoring, backups, runbook, launch |

---

## Stage 1 — Environment & accounts (Days 1–2) → full detail in SETUP_GUIDE.md
- [ ] Install VS Code, Node.js LTS, Git for Windows
- [ ] Verify in terminal: `node -v`, `npm -v`, `git --version` all print versions
- [ ] Create accounts: GitHub, Supabase, Vercel, Stripe (test mode), Google AI Studio (API key), Resend, UptimeRobot, Sentry
- [ ] Store keys in a password manager; nothing in any doc/chat
- [ ] Learn: what a terminal is, `cd`, `ls`, running commands (SETUP_GUIDE §1)
- **DoD:** all versions print; every account exists; API key for Gemini saved securely.

## Stage 2 — Skeleton + deploy pipeline (Days 3–5)
- [x] `npx create-next-app@latest .` — done 2026-08-20 (Next 16.3.1, React 19, Tailwind v4, Turbopack)
- [x] GitHub push ✅ (after `master`→`main` rename lesson, PROGRESS_LOG 002/003)
- [x] Import repo into Vercel → live at **https://draftly-pink.vercel.app** (public, verified)
- [x] Design tokens → `app/globals.css` + fonts (Space Grotesk/Inter/JetBrains Mono) in `app/layout.tsx`
- [x] Base components: Button, Card, Chip, Input, Textarea, Toast in `components/ui/`
- [x] 🎨 MOCKUP GATE 1: **approved** 2026-08-20 → real app shell built: `(app)` route group, Sidebar, BottomNav, Header (credits pill + avatar), Dashboard per mockup, QuickGenerateCard, CopyButton, 4 stub pages. `npm run build` ✅ all routes
- **DoD:** `npm run dev` works; live URL shows shell; tokens match brief; deploy triggered by `git push`.

## Stage 3 — Auth + onboarding (Days 6–10)
- [ ] Supabase project created; env vars wired (`.env.local` + Vercel)
- [ ] Migration `0001_init.sql` applied (BACKEND_SCHEMA §2–§5: tables, trigger, RPC, RLS, indexes)
- [ ] `/signup`, `/login` (server actions) + email verification + password reset
- [ ] `middleware.ts` guards `/(app)`, redirects with `?next=`
- [ ] 🎨 MOCKUP GATE 2: onboarding 3-step wizard → approve → build
- [ ] Onboarding saves niche/platforms/tone/keywords → `onboarding_completed=true` → `/generate`
- [ ] Signup creates profile + 15 credits via trigger (verify in ledger)
- [ ] Logout, session refresh, expired-session redirect with draft preservation
- **DoD:** fresh signup → onboarding → dashboard with ⚡15; direct URL to /dashboard logged-out redirects; user A cannot read user B rows (quick RLS smoke test).

## Stage 4 — Generator core + credits (Days 11–18) — *the product*
- [ ] `lib/ai/provider.ts` adapter + `lib/ai/prompts.ts` (6 content types, per APP_FLOW §6.5)
- [ ] Generate page UI: 🎨 MOCKUP GATE 3 (studio screen, loading theater, variant cards) → approve → build
- [ ] `POST /api/generate`: Zod → rate limit → `spend_credits` RPC → AI → save → respond
- [ ] Failure path: retry once → refund ledger entry → friendly 502 UX
- [ ] Credits meter live in header (spend animation, low-credit warning state)
- [ ] `/library`: list, filter, search, expand, copy, favorite
- [ ] `/dashboard`: stat cards, quick-generate card, recent list, empty states
- [ ] Lazy monthly reset + ledger pagination in `/billing`
- **DoD:** end-to-end on phone: topic → 3 variants → copy; ledger sums = meter exactly; double-click charges once; kill AI key → refund appears.

## Stage 5 — Stripe billing + paywall (Days 19–24)
- [ ] Stripe: Pro price $9/mo (test mode), webhook endpoint, portal enabled
- [ ] `/pricing` page: 🎨 MOCKUP GATE 4 → approve → build
- [ ] Checkout session route + `/billing/welcome` polling page
- [ ] Webhook handler: signature verify, idempotent upsert + `plan_grant`
- [ ] Paywall modal (Journey C copy) + 402 handling in generate flow
- [ ] `/billing`: plan card, manage → Stripe portal, ledger
- [ ] Nightly reconcile cron (`/api/cron/reconcile` + Vercel cron + CRON_SECRET)
- **DoD:** test card 4242… pays → 500 credits ≤60s; cancel in portal → free at period end; replayed webhook doesn't double-grant; missed-webhook scenario self-heals via cron.

## Stage 6 — Landing, emails, polish (Days 25–30)
- [ ] 🎨 MOCKUP GATE 5: landing page → approve → build (hero + demo widget + proof + pricing teaser)
- [ ] Empty/error/loading states audit — every screen, every state (APP_FLOW §7)
- [ ] Resend: welcome email, low-credits email (cron-triggered at ≤3)
- [ ] SEO: metadata, OG image, sitemap, robots; favicon + PWA manifest
- [ ] `/legal/terms` + `/legal/privacy` (plain language)
- [ ] PostHog events: signup→activation→paywall_view→paid funnel
- **DoD:** Lighthouse ≥90 mobile on landing; funnel events visible in PostHog; emails arrive (not in spam ideally).

## Stage 7 — Launch armor + go-live (Days 31–35)
- [ ] Sentry wired (client + server), test error captured
- [ ] `/api/health` (db + ai checks) + UptimeRobot 5-min monitor + phone alerts
- [ ] Public status page (BetterStack free) linked from footer
- [ ] Weekly `pg_dump` backup → GitHub Action → private backup repo, restore tested once
- [ ] Security checklist TRD §9 — every box verified (RLS attacker test included)
- [ ] RUNBOOK.md written (from ARCHITECTURE §7) + printed/saved offline
- [ ] Stripe live mode: business details, live keys in Vercel, $1 real test purchase, refund it
- [ ] 10 beta users personally onboarded → fix top-3 friction points
- [ ] LAUNCH 🚀 (build-in-public post, 2 communities, Product Hunt scheduled)
- **DoD:** paying a real $9 works end-to-end; killing the DB page alerts phone in <5 min; you can restore from backup; you know the runbook by heart.

---

## Standing rules for every coding session
1. Point the AI at this file + PROGRESS_LOG.md first: *"Read docs/IMPLEMENTATION_PLAN.md and docs/PROGRESS_LOG.md — continue at Stage X.Y"*
2. One task per commit, message like `feat: onboarding step 1 UI` — small commits = free undo buttons
3. If stuck >45 min: write the problem in DECISIONS.md, take a 10-min walk, then re-read the docs
4. Never edit prod DB by hand; migrations only
5. End of session → PROGRESS_LOG.md entry (done / next / blockers)
