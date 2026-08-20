# DECISIONS Log — every major choice & why
*(The founder's journal. Append anytime we lock a choice. A decision without a reason is a future argument.)*

| ID | Date | Decision | Why | Alternatives rejected |
|---|---|---|---|---|
| D-001 | 2026-08-20 | Build **AI Content Studio** (vs habit tracker / budget tracker) | Highest-skill-value path: AI integration + metered billing + paywalls = most marketable founder skills; biggest market | Habit tracker (smaller moat), budget app (regulatory + trust burden) |
| D-002 | 2026-08-20 | Working name **"Draftly"** | Short, brandable, verb-able ("draft it") | Validate domain availability before launch; rename is a 1-file change |
| D-003 | 2026-08-20 | **Free-tier-only** budget | Discipline; revenue triggers upgrades (see ARCHITECTURE §8) | Paid tiers (unjustified before users) |
| D-004 | 2026-08-20 | Stack: **Next.js 15 + TS + Tailwind + Supabase + Vercel** | One language, zero-devops, RLS security, industry default | Django/Rails (heavier solo), Vue/Svelte (smaller ecosystem) |
| D-005 | 2026-08-20 | AI via **provider-agnostic adapter**, Gemini free tier first | Swap providers by env var; free tier lets us build at $0; provider outage ≠ product outage (PRD R1) | Direct SDK lock-in |
| D-006 | 2026-08-20 | Credits = **append-only ledger** (never a mutable balance) | Auditable, race-safe, refund-safe; money integrity | `credits INT` column (drift + race conditions) |
| D-007 | 2026-08-20 | 1 generation = 1 credit = 3 variants | Simplest story users understand | Token metering (confusing, support burden) |
| D-008 | 2026-08-20 | Pricing: Free 15/mo · Pro $9/mo 500cr | Impulse-buy price; AI cost ceiling ≪ revenue (PRD §7) | Freemium-forever, per-post micro-payments |
| D-009 | 2026-08-20 | Email+password auth first (Google OAuth v1.1) | OAuth needs production domain + review; email works day 1 | OAuth-first (launch blocker) |
| D-010 | 2026-08-20 | Monthly credits **reset, no rollover** | MVP simplicity; pushes monthly active habit | Rollover (ledger complexity, hoarding) |
| D-011 | 2026-08-20 | Rate limiting via DB count (3 gen/min) | Zero extra services at MVP scale | Upstash Redis (add at 10k users, ARCH §8) |
| D-012 | 2026-08-20 | Stripe Customer Portal for cancel/manage | Never build billing UI; self-serve = zero support load | Custom billing pages |
| D-013 | 2026-08-20 | Supabase free tier + UptimeRobot pings to prevent auto-pause | Cheapest path; monitoring doubles as keep-alive (PRD R5) | Pay from day 1 |
