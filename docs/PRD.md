# PRD — Product Requirements Document
## Draftly — AI Content Studio for Creators

| | |
|---|---|
| **Version** | 1.0 |
| **Status** | Approved for MVP build |
| **Owner** | Deepak (solo founder) |
| **Last updated** | 2026-08-20 |
| **Companion docs** | TRD.md · APP_FLOW.md · UIUX_DESIGN_BRIEF.md · BACKEND_SCHEMA.md · ARCHITECTURE.md |

---

## 1. Vision

**One-liner:** Draftly turns a creator's raw idea into platform-ready content — captions, threads, posts, hooks — in their own voice, in under 30 seconds.

**Long vision:** Every creator's biggest bottleneck is not filming or designing — it's *writing*. Draftly is the always-on co-writer that knows your niche, your tone, and each platform's unwritten rules, so you never stare at an empty caption box again.

**North star metric:** **Weekly Active Generators** (users who generate ≥1 piece of content per week).

---

## 2. Problem

| Who | Pain today | Current fix | Why it fails |
|---|---|---|---|
| Creators (TikTok/IG/YouTube) | Writing captions/hooks daily is draining; consistency collapses | Copy-paste from ChatGPT | Generic voice, no platform formatting, context re-explained every time |
| Freelancers / personal brands | Need LinkedIn/X presence but hate writing | Ghostwriters ($500+/mo) or nothing | Too expensive; DIY is inconsistent |
| Small businesses | Owner must market on socials alongside running the business | Agencies | Cost; owner loses authentic voice |

**Core insight:** ChatGPT is free but *context-free*. The value is not "AI writes text" — it's **AI that already knows your brand voice + the platform's format rules + reuses your winning angles.** That is a product, not a chat box.

---

## 3. Target users & personas

### P1 — "Aisha", 22, UGC & TikTok creator (PRIMARY)
- Posts 5×/week, gets brand deals, writes on her phone between classes
- **Needs:** fast captions + hooks, emoji-fluent tone, works on mobile
- **Pays for:** anything that saves 30 min/day (budget: pocket money → $9/mo OK)

### P2 — "Rohan", 27, freelance designer building a personal brand
- Knows LinkedIn matters, posts 3×/week max, writes formally (badly)
- **Needs:** professional-but-human voice, LinkedIn + X formats, idea → post pipeline
- **Pays for:** tools that make him look consistent (already pays for Figma, Notion)

### P3 — "Meera", 31, bakery owner
- 2 hrs/week for marketing, posts specials on Instagram
- **Needs:** dead-simple, phone-first, seasonal/promo content
- **Pays for:** if it visibly brings footfall (price-sensitive)

**Design implication:** mobile-first UI, zero learning curve, GenZ-native but not childish (P2/P3 must not feel excluded).

---

## 4. Market & positioning

- **Competitors:** Jasper (enterprise, $$), Copy.ai (team tools), ChatGPT (free, generic), Canva Magic Write (buried inside design tool), Typefully (scheduling-first, AI-light)
- **Draftly's wedge:** *voice-locked, platform-aware, one-tap generation* — the fastest path from idea → postable text. GenZ-clean UX that feels like a consumer app, not B2B software.
- **Positioning statement:** For creators who post consistently, Draftly is the co-writer that sounds like you — unlike generic chatbots, it remembers your voice and formats for each platform.

---

## 5. Product pillars (what makes it "not a dumb website")

1. **Instant value** — first generated caption within 2 minutes of signup, before paying anything
2. **Voice memory** — brand voice built in 60-second onboarding, applied to every generation
3. **Platform-native output** — correct length, hashtags, structure per platform (IG caption ≠ X thread ≠ LinkedIn post)
4. **Credits transparency** — always see credits left, what they buy, and what Pro adds. No dark patterns, no fake urgency.

---

## 6. Features (MoSCoW)

### MUST have — MVP (Weeks 1–5)
| ID | Feature | User story | Acceptance criteria |
|---|---|---|---|
| F01 | Email signup/login | As a new user, I can create an account with email + password so my content is saved | Supabase Auth; verify email; session persists; password reset works |
| F02 | Onboarding wizard (3 steps) | As a new user, I tell Draftly my niche, platforms, and tone so generations fit me | 3 screens; skippable step 3; saved to profile; completion sets `onboarding_completed=true` |
| F03 | Free credits on signup | As a new user, I get 15 free credits so I can try before buying | Ledger entry `signup_grant +15` created atomically with account |
| F04 | Content generator | As a user, I pick content type + topic + tone and get 3 ready-to-paste variants | <15s response; 1 credit per generation; copy button per variant; failures retried once |
| F05 | Content types (MVP set) | IG caption, TikTok/Reel hook + caption, X (Twitter) thread, X single post, LinkedIn post, YouTube title+description | Each has own prompt template w/ platform rules; output formatted correctly |
| F06 | Credits meter & history | As a user, I always see remaining credits and past generations | Meter in header; library lists all generations w/ re-copy; ledger reconciles exactly |
| F07 | Paywall & Stripe subscription | As a free user out of credits, I can buy Pro and instantly get 500 credits | Stripe Checkout; webhook grants credits within 60s; cancel via Stripe portal; state never drifts (reconciliation job) |
| F08 | Pricing page | As a visitor, I understand free vs Pro in 10 seconds | 2-tier cards; FAQ; no dark patterns |
| F09 | Dashboard | As a returning user, I land on a dashboard that gets me generating in one tap | Credits stat, quick-generate card, recent generations list, empty states with guidance |
| F10 | Landing page | As a visitor, I get the value prop and a signup CTA | Hero + demo sample + social proof placeholders + CTA; loads <2s; mobile perfect |

### SHOULD have — v1.1 (Weeks 6–8, post-launch)
- S01 Saved brand voices (multiple, switchable)
- S02 Regenerate / "more like this variant" (0.5 credit)
- S03 Export to clipboard-formatted bundle + share link
- S04 Welcome & low-credits emails (Resend)
- S05 Google OAuth login

### COULD have — v2
- C01 Content calendar + scheduling (partner API, e.g. Buffer)
- C02 Team seats (Studio plan)
- C03 Analytics: which generations got copied → "winning angles"
- C04 Chrome extension (generate inside X/LinkedIn composer)
- C05 Image prompt suggestions for each post

### WON'T have — this year
- Direct auto-posting to socials (API review hell; scheduling partners solve it)
- Mobile native apps (PWA is enough)
- Free-form chat mode (we are a tool, not a chatbot — this is positioning)

---

## 7. Pricing & business model

| | **Free** | **Pro — $9/mo** |
|---|---|---|
| Credits/month | 15 | 500 |
| Content types | All 6 | All 6 |
| Brand voice | 1 (from onboarding) | Unlimited saved voices (v1.1) |
| History | Last 10 generations | Full history |
| Support | Community/email | Priority email |

- 1 credit = 1 generation (3 variants). No token math for users — one simple number.
- Credits reset monthly, no rollover (MVP simplicity; revisit with data).
- No annual plan at launch (later: 2 months free).
- Overage: blocked with upsell, never surprise-billed.
- Stripe fees: ~2.9% + 30¢ — at $9/mo we keep ≈ $8.42. Break-even AI cost per Pro user target: **<$1.50/mo** (model mix + prompt discipline).

---

## 8. Success metrics

| Metric | Launch target (30 days) | Healthy (6 mo) |
|---|---|---|
| Signups | 150 | 3,000 |
| **Activation** (1st generation <5 min after signup) | ≥60% | ≥75% |
| D7 retention | ≥25% | ≥40% |
| Free→Paid conversion | ≥3% | ≥5% |
| MRR | $50 | $2,000 |
| Generation success rate | ≥98% | ≥99.5% |
| p95 generation latency | <12s | <8s |

---

## 9. Non-goals (v1)

- No multi-tenant teams, no white-label, no API for third parties, no mobile apps, no direct posting, no chat interface, no image generation.

---

## 10. Risks & mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | AI provider outage / free-tier rate limits hit | High | High | Provider-agnostic adapter (swap model in one config); retry + queue UX; provider health check |
| R2 | AI cost exceeds revenue per user | Medium | High | Credits cap spend by design; monitor cost/generation in ledger; hard monthly user cap |
| R3 | Users churn after free credits ("tourist problem") | High | Medium | Activation <5 min; weekly value loop (library, voices); low-credits email with before/after examples |
| R4 | Solo founder outage/bus factor | Medium | High | Runbook (ARCHITECTURE.md §7), uptime alerts to phone, one-click rollback on Vercel |
| R5 | Supabase free-tier pause (7 days inactivity) | Medium | Medium | UptimeRobot pings every 5 min = activity; upgrade trigger = 1st paying user |
| R6 | Copycats / OpenAI ships "voices" natively | Medium | Medium | Speed + niche UX + distribution; moat is audience & workflow, not tech |
| R7 | Chargebacks/refunds | Low | Low | Clear pricing page; Stripe portal self-serve cancel; no-questions 7-day refund policy |
| R8 | Privacy/DPDP-GDPR exposure storing user content | Low | Medium | Store only generations (needed for product); delete-my-data endpoint; Privacy policy honest & plain-language |

---

## 11. Launch checklist (business side — detailed in IMPLEMENTATION_PLAN Stage 7)

- [ ] Stripe live-mode activation (business details)
- [ ] Terms of Service + Privacy Policy pages (generator + legal review when revenue justifies)
- [ ] Support email + response SLA promise (48h)
- [ ] Launch channels: build-in-public thread, 2 communities, Product Hunt prep
- [ ] 10 beta users from personal network before public launch
