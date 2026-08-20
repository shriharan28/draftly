# TRD — Technical Requirements Document
## Draftly — AI Content Studio

| | |
|---|---|
| **Version** | 1.0 |
| **Status** | Approved for MVP build |
| **Constraint** | **$0/month while building** — free tiers only, upgrade only when revenue justifies |
| **Companion** | ARCHITECTURE.md (diagrams) · BACKEND_SCHEMA.md (SQL) |

---

## 1. Stack decisions & why

| Layer | Choice | Free tier | Why this and not the alternative |
|---|---|---|---|
| Language | **TypeScript** everywhere | — | One language front+back; types catch bugs before users do |
| Framework | **Next.js 15 (App Router)** | — | Frontend + API routes in one deploy; the default hiring/AI-assistant stack |
| Styling | **Tailwind CSS v4** | — | Speed; design tokens live in CSS = our design system is code |
| DB + Auth | **Supabase** (Postgres) | 500MB DB, 50k MAU | Postgres + Auth + Storage + Row Level Security in one free service |
| Hosting | **Vercel** | Hobby: generous | Zero-DevOps deploys, preview URLs per commit, one-click rollback |
| AI | **Google Gemini (AI Studio key)** via **adapter layer** | Free w/ rate limits | Genuinely free tier; adapter means we can swap to OpenAI/Groq/local in ONE file |
| Payments | **Stripe** (test mode → live) | Free, ~2.9%+30¢ per charge | Industry standard; webhooks + customer portal save weeks |
| Email | **Resend** | 3k/mo, 100/day | Transactional email, dead simple |
| Errors | **Sentry** | 5k errors/mo | Stack traces from real users |
| Uptime | **UptimeRobot** | 50 monitors, 5-min checks | "Server down" detection before users tweet it |
| Analytics | **PostHog** (or Vercel Analytics) | 1M events/mo | Funnels: signup→activation→paywall→paid |
| Code | **GitHub** private repo | Free | Version control + Vercel auto-deploy from it |

**Rule for the whole project:** managed services over self-hosting, boring proven tech over shiny, one vendor per job. Solopreneur time is the scarcest resource.

---

## 2. Repository & app structure

Monorepo? **No.** Single Next.js app at repo root:

```
/                       # repo root (this workspace)
├── docs/               # the Product Bible (this folder)
├── app/                # Next.js App Router — all screens & API routes
│   ├── (marketing)/    # landing, pricing  — public, no auth
│   ├── (auth)/         # login, signup     — centered minimal layout
│   ├── (app)/          # dashboard, generate, library, settings, billing — auth-only
│   ├── api/
│   │   ├── generate/         # POST — the core AI endpoint
│   │   ├── stripe/webhook/   # POST — billing events
│   │   ├── health/           # GET  — uptime monitor target
│   │   └── cron/             # Vercel cron entry (reconcile, emails)
│   └── layout.tsx / globals.css
├── components/         # ui/ (design system) + features/ (screen parts)
├── lib/
│   ├── supabase/       # client.ts, server.ts, admin.ts (service role)
│   ├── ai/             # provider.ts (adapter) + prompts.ts (templates)
│   ├── credits.ts      # spend/grant logic (calls DB function)
│   └── stripe.ts
├── supabase/
│   └── migrations/     # SQL files, applied in order
└── .env.local          # secrets — NEVER committed (in .gitignore)
```

---

## 3. Auth design (Supabase)

- **Method (MVP):** email + password. Magic-link & Google OAuth = v1.1.
- **Session:** Supabase JS reads HttpOnly cookies; `middleware.ts` refreshes session and guards `/(app)` routes → redirect to `/login?next=…`.
- **Profile bootstrap:** Postgres trigger `on_auth_user_created` inserts `profiles` row **and** the `signup_grant` ledger entry in one transaction (no race, no "user without credits" state).
- **Server-side rule:** browser NEVER talks to Postgres with a privileged key — only the user's own JWT, and Row Level Security decides what they may touch (see BACKEND_SCHEMA.md §4).

---

## 4. AI layer (the heart — provider-agnostic)

```
app/api/generate  →  lib/ai/provider.ts  →  [Gemini | OpenAI | Groq | ...]
                        ↑
                 lib/ai/prompts.ts   (content-type templates: rules, few-shots, format)
```

- `provider.ts` exports one interface: `generateVariants(prompt, opts) → { variants: string[], model, latencyMs }`. Provider/model chosen from env (`AI_PROVIDER`, `AI_MODEL`) — swapping vendors = changing env vars, zero code.
- **Prompt contract per content type** (in `prompts.ts`): platform rules (length, hashtags, structure), user's niche/tone/keywords, safety instructions (no medical/financial guarantees, no impersonation), output spec: **exactly 3 variants, `---` separated**.
- **Server-side only.** The AI API key lives only in Vercel env vars; the browser never sees it.
- **Failure handling:** 1 automatic retry (different provider if configured) → mark generation `failed`, refund the credit via ledger entry `refund`, show friendly error + "try again".
- **Timeouts:** 25s hard timeout (Vercel function limit 30s free tier... if exceeded → background job in v1.1).

---

## 5. Credits system (money-integrity critical)

**Model: append-only ledger.** Balance is never a mutable column — it is `balance_after` of the newest ledger row. Every credit movement has a row with a reason:

```
+15  signup_grant        (trigger, at account creation)
+15  monthly_grant       (lazy: on first request of a new cycle)
+500 plan_grant          (Stripe webhook, idempotent)
-1   generation          (atomic spend RPC)
+1   refund              (provider failure)
```

**Atomic spend** — a Postgres function `spend_credits(p_amount, p_reason, p_generation_id)` that:
1. `SELECT … FOR UPDATE` the user's latest ledger row (locks against concurrent spends)
2. `IF balance < amount → RAISE insufficient_credits`
3. `INSERT` new row with `balance_after = balance - amount`
4. Uses `idempotency_key = generation_id` (unique) so a double-click can never double-charge.

**Monthly reset (lazy grant):** on any authenticated request, if `now() > profiles.credits_reset_at`, a transaction advances the cycle and inserts `monthly_grant` (free=15, pro=500). No cron needed at MVP scale; a nightly reconciliation cron (Vercel cron, free) double-checks drift.

**Entitlement source of truth:** Stripe subscription status. `profiles.plan` is a cache updated by webhooks; the nightly cron reconciles cache vs Stripe via API so a missed webhook can never permanently break billing.

---

## 6. Payments flow (Stripe)

1. User clicks Upgrade → server creates **Stripe Checkout Session** (`mode: subscription`, price = Pro $9/mo) with `client_reference_id = user_id`, returns redirect URL.
2. Success → `/billing/welcome` (polls our DB until webhook lands; shows credits granted).
3. `POST /api/stripe/webhook` (raw body, **signature verified** with `STRIPE_WEBHOOK_SECRET`):
   - `checkout.session.completed` / `customer.subscription.updated` → upsert `subscriptions`, set `profiles.plan='pro'`, insert `plan_grant +500` (idempotent by Stripe event id)
   - `customer.subscription.deleted` → `plan='free'`, status updated
4. Manage/cancel → **Stripe Customer Portal** (no self-built billing UI — this is the solopreneur cheat code).
- **Test mode** during all of Stages 1–6; live keys only in Stage 7.

---

## 7. API surface (Next.js route handlers)

| Route | Method | Auth | Purpose | Failure codes |
|---|---|---|---|---|
| `/api/generate` | POST | user JWT | Generate 3 variants, spends 1 credit | 401, 402 `insufficient_credits`, 429 `rate_limited`, 502 `provider_error` (refunds) |
| `/api/stripe/webhook` | POST | signature | Billing events | 400 bad signature |
| `/api/health` | GET | public | `{status, db, ai}` for UptimeRobot | 200/503 |
| `/api/cron/reconcile` | POST | Vercel cron secret | Billing+credits reconciliation, weekly emails | 401 |
| `/api/generations` | GET | user JWT | Paginated history | 401 |

All request bodies validated with **Zod** schemas; unknown fields rejected.

---

## 8. Abuse & rate limiting (free tier, zero extra services)

- **DB-based limiter:** count user's `generation` ledger rows in the last 60s → max 3/min; per day capped by credits anyway.
- Supabase Auth built-in email rate limits (default) + hCaptcha on signup if abuse appears.
- Vercel's platform-level DDoS protection is on by default; Cloudflare DNS later for scale.
- Prompt-injection defense: user topic text is wrapped in delimiters in prompts and never interpreted as instructions.

---

## 9. Security requirements (checklist — verified at Stage 7)

- [ ] RLS enabled on **every** table; policies tested as attacker-user in tests
- [ ] Service-role key used ONLY in webhook/cron routes (never shipped to browser bundle — verified via build output)
- [ ] Stripe webhook: raw body + signature verification, idempotent handlers
- [ ] Zod validation on every API input; size caps (topic ≤ 500 chars)
- [ ] Secrets only in env vars; `.env*` in `.gitignore`; keys rotated before live launch
- [ ] Security headers: CSP, X-Frame-Options DENY, Referrer-Policy (via `next.config`)
- [ ] Auth: HttpOnly cookies, password min 8 chars, email verification required
- [ ] Dependency audit: `npm audit` + Dependabot on
- [ ] No PII in logs; error events scrub URLs of query params

---

## 10. Performance budgets

- Landing: LCP < 2.0s (static, image-optimized)
- Dashboard TTFB < 500ms; generation p95 < 12s (perceived: streaming skeleton + progress copy)
- DB: every user-facing query indexed (see BACKEND_SCHEMA.md §5); no N+1 (list views paginate 20/page)

---

## 11. Scaling ladder (what changes, when)

| Users | Change needed | Cost |
|---|---|---|
| 0–1k | Nothing. Architecture as specced | $0 |
| 1k–10k | Supabase Pro (no pause, backups, PITR); Vercel Pro if bandwidth | ~$50/mo |
| 10k–100k | Upstash Redis rate-limiting; background queue for generations (Inngest); read replica | ~$150–300/mo |
| 100k+ | Multi-region, dedicated AI budget, CDN-cached marketing, team 😅 | revenue-funded |

Each step is a billing decision, not a rewrite — that is why we chose stateless + Postgres + adapter patterns now.

---

## 12. Environment variables (names only — values NEVER in git)

```
NEXT_PUBLIC_SUPABASE_URL=          NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         (server only)
AI_PROVIDER=google                 AI_MODEL=gemini-2.0-flash
GOOGLE_AI_API_KEY=
STRIPE_SECRET_KEY=                 STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= STRIPE_PRICE_PRO_ID=
RESEND_API_KEY=                    EMAIL_FROM="Draftly <hello@…>"
CRON_SECRET=                       APP_URL=
```

`.env.local` for dev; same names in Vercel project settings for prod.
