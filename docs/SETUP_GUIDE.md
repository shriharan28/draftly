# Setup Guide — Stage 1 (Windows, zero to ready)
*Written for a complete beginner. Follow top to bottom. ~2–3 hours including account signups.*

---

## §0. First, understand your tools (2-minute masterclass)

- **Terminal (CMD/PowerShell/Git Bash):** a text window where you type commands instead of clicking. Developers live here. We'll use the one **built into VS Code**.
- **VS Code:** the editor where code lives (like Word for code).
- **Node.js + npm:** JavaScript's engine + its app store. `npm install` brings in code libraries.
- **Git:** a time machine for code — saves checkpoints ("commits") you can always return to.
- **GitHub:** cloud storage for Git projects; Vercel reads it and deploys automatically.
- **Vercel / Supabase / Stripe / Resend:** rented specialists — hosting, database+login, payments, email. Free tiers.

---

## §1. Install the big three

### 1. VS Code
1. https://code.visualstudio.com → Download for Windows → run installer (accept defaults).
2. Open VS Code → left icon bar → Extensions (4 squares) → install **"Markdown Preview Mermaid Support"** (to see our architecture diagrams rendered!) and optionally **Prettier**.

### 2. Node.js (LTS version)
1. https://nodejs.org → click the big **LTS** download → installer, accept defaults.
2. Restart VS Code (so it finds Node).

### 3. Git
1. https://git-scm.com/download/win → download → installer, accept defaults (it installs "Git Bash" too — fine).
2. When done, in VS Code: top menu **Terminal → New Terminal**.
3. In the terminal that opens at the bottom, type these one per line and press Enter:

```bash
node -v      # should print like: v22.x.x
npm -v       # like: 10.x.x
git --version # like: git version 2.xx
```

✅ If all three print a version number — **your machine is now a dev machine.** If one fails, restart VS Code and retry; still failing → tell your AI assistant the exact error.

### 4. Tell Git who you are (one time)
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### 5. Terminal survival phrases
```bash
pwd      # where am I? (print working directory)
ls       # what's in this folder?
cd docs  # go into the docs folder
cd ..    # go back up one folder
clear    # clean the screen
```
That's genuinely 90% of daily terminal use. Everything else we'll learn by doing.

---

## §2. Accounts (all free) — do in this order

| # | Service | URL | What to do | What to SAVE |
|---|---|---|---|---|
| 1 | **GitHub** | github.com | Sign up → verify email → create private repo named `draftly` (no README) | login |
| 2 | **Supabase** | supabase.com | Sign up with GitHub → (project itself created in Stage 3) | login |
| 3 | **Vercel** | vercel.com | Sign up **with GitHub** (connects the two) | login |
| 4 | **Google AI Studio** | aistudio.google.com | Sign in with Google → **Get API key** → Create key | 🔑 `AIza…` key |
| 5 | **Stripe** | stripe.com | Sign up → dashboard → ensure **Test mode** toggle ON | 🔑 later |
| 6 | **Resend** | resend.com | Sign up | 🔑 later |
| 7 | **UptimeRobot** | uptimerobot.com | Sign up (monitor added Stage 7) | login |
| 8 | **Sentry** | sentry.io | Sign up with GitHub | 🔑 later |

**🔑 Golden rules for secrets:**
- API keys go in a **password manager** (or an encrypted note) — never in chat, never in docs, never in code, never in GitHub. Keys committed to Git are scraped by bots within *minutes*.
- `.env.local` (created Stage 2) is the only home for secrets in the project — it's auto-ignored by Git.

---

## §3. Done? Verify this checklist
- [ ] `node -v`, `npm -v`, `git --version` all print versions
- [ ] VS Code opens; Mermaid preview extension installed
- [ ] GitHub account + private repo `draftly` exists
- [ ] Gemini API key saved in password manager
- [ ] Supabase / Vercel / Stripe / Resend / UptimeRobot / Sentry accounts exist

Then: **update docs/PROGRESS_LOG.md** (new entry: Stage 1 complete, next = Stage 2 skeleton) and come back saying:
> "Stage 1 done. Read docs/PROGRESS_LOG.md — start Stage 2."

Stage 2 is where it gets fun: you create the app, push to GitHub, and see it **live on the internet** on day one.
