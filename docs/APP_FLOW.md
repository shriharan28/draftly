# App Flow — Screens & User Journeys
## Draftly

Every screen, every journey, every state. **Before building any screen, an HTML mockup is approved first** (mockup gate — see IMPLEMENTATION_PLAN).

---

## 1. Screen map (sitemap)

```
/Public (marketing layout — nav: Logo · Pricing · Log in · [Get started])
 ├── /                      Landing page
 ├── /pricing               Free vs Pro + FAQ
 ├── /login                 Email + password
 ├── /signup                Email + password
 └── /legal/terms · /legal/privacy      (Stage 6)

/Auth-only (app layout — sidebar on desktop, bottom tab bar on mobile)
 ├── /onboarding            3-step wizard (new users only)
 ├── /dashboard             Home: stats, quick-generate, recent
 ├── /generate              The studio: create content
 ├── /library               All past generations (search + filter)
 ├── /settings              Profile, brand voice, timezone
 └── /billing               Plan, credits ledger, manage in Stripe, upgrade

/API
 ├── POST /api/generate · GET /api/generations
 ├── POST /api/stripe/webhook · GET /api/health · POST /api/cron/reconcile
 └── /billing/welcome       Post-checkout success screen (polls until Pro active)
```

---

## 2. Journey A — First visit → Activation (THE critical funnel)

| # | Step | Screen | What happens | Success condition |
|---|---|---|---|---|
| A1 | Land from social/ad | `/` | Hero: input demo ("type your idea, see sample output" — fake but real-looking generation preview) | Understands product in 5s |
| A2 | Click "Get started free" | `/signup` | Email, password, (no card). Button disabled till valid | Signup < 30s |
| A3 | Verify email | Link in email | → back to site logged-in | Opens on phone browser fine |
| A4 | Onboarding wizard | `/onboarding` | Step 1 niche (chips), Step 2 platforms (multi-select cards), Step 3 tone (sliders/chips) + 3 keywords | ≤ 60s, all skippable except niche |
| A5 | **First generation** | `/generate` | Pre-filled with onboarding answers; big CTA "Generate — 3 variants" | **Generates within 5 min of signup** ← activation metric |
| A6 | Copy variant | `/generate` | Tap copy → toast "Copied! 14 credits left" | User feels ownership |

Anti-drop rules: no email verification blocking generation for 24h grace (send email, allow session); onboarding progress bar; skippable = never a dead end.

## 3. Journey B — Daily return loop (retention)

Open app → `/dashboard` → "Generate again" one-tap (last settings remembered) → `/generate` → copy → done. Library builds up ("Your 47 posts"). Weekly: "You saved ~3h this week" stat. This loop is the product.

## 4. Journey C — Out of credits → Paywall → Pro (revenue)

| # | Step | Screen | Notes |
|---|---|---|---|
| C1 | Credits hit 0 (meter pulses red at ≤3) | `/generate` | On Generate click → paywall modal, NOT a dead error |
| C2 | Paywall modal | over `/generate` | "You're out of credits. You created 12 posts this month — keep the streak." · Price card · **[Upgrade — $9/mo]** · "Not now" (honest, small) | 
| C3 | Stripe Checkout | hosted | Card, UPI (India!), Apple Pay — Stripe handles everything |
| C4 | Success | `/billing/welcome` | Confetti, "500 credits added", polls DB till webhook lands (≤60s), then → `/dashboard` |
| C5 | Ongoing | `/billing` | Cancel anytime → Stripe portal (self-serve — we never touch it) |

## 5. Journey D — Cancel (keep the door open)

Cancel in Stripe portal → webhook `subscription.deleted` → `plan=free` at period end → user keeps free 15/mo + library. Cancellation exit survey (1 tap: price / value / leaving content creation / other).

---

## 6. Screen-by-screen spec

### 6.1 `/` Landing (marketing)
- Hero: headline + live-feeling demo widget (type topic → animated fake variants appear) + CTA
- Social proof strip (counter + placeholder avatars at launch), 3 feature cards, pricing teaser, footer
- States: n/a · Analytics events: `landing_view`, `signup_click`

### 6.2 `/signup` & `/login`
- Centered card on negative-space background, logo, 2 inputs, button, link swap
- Errors inline (weak password, email exists, wrong password); loading state on button

### 6.3 `/onboarding` (3 steps, one thing per screen — GenZ rule)
- **S1:** "What do you create about?" — chip cloud (Fitness, Food, Tech, Fashion, Finance, Travel, Art, Education, Business, Other + free text)
- **S2:** "Where do you post?" — platform cards multi-select (IG, TikTok, X, LinkedIn, YouTube)
- **S3:** "How should you sound?" — tone chips (Bold, Chill, Professional, Funny, Poetic, No-nonsense) + 3 keyword inputs ("words that are SO you")
- Progress bar top; Back/Skip bottom; completes → toast "🎉 15 credits loaded" → `/generate`

### 6.4 `/dashboard`
- Row 1: stat cards — **Credits left** (big, accent) · Generations this week · Trending type
- Row 2: **Quick-Generate hero card** (topic input + type pills + Generate button — the whole product in one card)
- Row 3: Recent generations (list, copy shortcut) / empty state: "Your first post is 30 seconds away →"
- States: skeleton loading; error banner w/ retry

### 6.5 `/generate` (the studio — flagship screen)
- Left (or top on mobile): content-type pills (IG caption · Reel hook · X thread · X post · LinkedIn · YouTube) · Topic textarea (500 char cap w/ counter) · Tone chips (default = onboarding tone) · Generate button (shows "1 credit")
- Right: results — 3 variant cards, each: variant text, [Copy] [♡ favorite], model/latency footer
- States: empty ("Tell me what to post about 👀"), loading (skeleton + rotating fun status lines: "channeling your vibe…"), error (friendly + credit refunded note + Retry), 402 → paywall modal (Journey C)

### 6.6 `/library`
- Filter pills by type + search; generation rows (type icon, topic snippet, date, credits); click → expand full variants + copy
- Free users: oldest beyond 10 locked with subtle Pro badge (no rage-wall)

### 6.7 `/settings`
- Profile (name, email read-only), brand voice editor (re-runs onboarding S1/S3 on those fields), timezone, danger zone: **Delete my account & data** (GDPR/DPDP — deletes auth user; cascade wipes)

### 6.8 `/billing`
- Current plan card + credits bar + this-cycle ledger (last 20 entries) · [Manage subscription] → Stripe portal · [Upgrade] when free

---

## 7. Edge cases (a real product handles these)

| Edge | Behavior |
|---|---|
| Session expires mid-typing | Text preserved; login redirect `?next=` returns to same screen w/ draft |
| AI provider down | 502 → auto-refund credit → toast "Our writer's bot took a coffee break — credit refunded, try again" |
| Webhook delayed after checkout | Welcome screen polls ≤60s; if still pending → "Confirming… we'll email you" + cron reconciles within 24h; credits backdated |
| Double-click Generate | Idempotency key (generation id) → one charge, one request |
| Offline | PWA cached shell + "You're offline" banner |
| Free-tier DB paused (shouldn't happen — UptimeRobot pings) | `/api/health` alerts us within 5 min → runbook (ARCHITECTURE §7) |
