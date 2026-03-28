# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Main product is **StudyPro** — a Telegram bot + Mini App that generates academic reports, summaries, lab work, essays and more for students using AI. Supports 30 languages with CIS focus.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)
- **Telegram Bot**: Telegraf
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2)
- **Frontend**: React + Vite + Framer Motion + Tailwind CSS

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API + Telegram Bot
│   │   └── src/bot/        # Bot logic (index, ai, db, keyboards, messages)
│   └── study-app/          # React Vite Mini App (TWA)
│       └── src/
│           ├── pages/      # home, new-report, history, balance, profile
│           └── lib/        # api, store, telegram, i18n
├── lib/
│   ├── api-spec/           # OpenAPI spec
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle schema (users, reports, payments)
```

## Bot Features

- **Free first report** for every new user
- **11 document types**: Report, Summary, Database, Lab Work, Essay, Tasks, Course Work, Diploma, Presentation, Test Paper, Notes
- **150+ subjects** in **17 categories**: School Math (7-11), Ukrainian Language & Lit (7-11), Sciences (7-11), History & Geography (7-11), Foreign Languages, Other School; College IT, College Tech; University Math, IT, Humanities, Business, Law, Engineering, Medicine; Other
- **Education level filter**: All / School / College / University tabs in category selection
- **3 payment methods**: Card (250 UAH, card 5375 4141 2121 2120), Crypto USDT (5$ TRC-20), Telegram Stars (500 XTR)
- **Receipt flow**: After card payment, user sends screenshot to @studypro_support moderator
- **AI generation**: gpt-5.2 with structured prompts per document type (specific prompts for all 11 types), vision support for photo attachments
- **File upload**: Users can attach photos of tasks from textbooks (base64, max 5MB, JPG/PNG), AI reads the image via vision
- **Referral system**: +2 reports for referrer and invitee, unique codes per user
- **Level progression**: Beginner (0-5), Student (6-20), Expert (21-50), Master (51-100), Legend (101+)
- **Achievements**: First Step, Expert, Master, Networker

## Telegram Mini App (TWA)

Premium React + Vite fintech-grade TWA with animated design system:

### Design System (CSS Classes)
- `.hero-card` — Rotating conic gradient border (`@property --card-angle`), glass bg with backdrop-blur, subtle glow overlays, shimmer sweep
- `.g-card` — Clean glass card with backdrop-filter blur(6px), subtle hover/active states
- `.g-card-s` — Static glass card (no interaction states)
- `.btn-main` — Violet gradient (`#8b5cf6→#7c3aed`) with top highlight, clean shadow
- `.btn-accent` — Green gradient with top highlight
- `.btn-ghost` — Subtle transparent button
- `.num-glow` — Gradient text (`white→#c4b5fd→#67e8f9`) with drop-shadow
- `.gradient-text` — Purple-to-cyan gradient text
- `.avatar-ring` — Linear gradient border (violet→cyan)
- `.app-bg` — Subtle aurora blobs with blur(80px) animation
- `.particles` + `.particle` — Floating particle system (14 dots, subtle opacity)
- `.badge` / `.badge-g` — Pill badges (violet / green)
- `.input-field` — Clean focus ring with subtle glow
- `.icon-box` — 44px icon container
- `.section-label` — Uppercase tracking label
- `.top-line` — Accent line helper for card top edges
- `.nav-bar` — Frosted glass nav with blur(30px)

**Color scheme**: Primary violet `#7c3aed`/`#8b5cf6`, cyan `#06b6d4`/`#67e8f9`, green `#34d399`, amber `#fbbf24`. Background `#0a0b10`.
**Design direction**: Clean, simple but premium professional. Subtler effects, reduced opacity, tighter spacing, smaller font sizes, rounded-xl corners (14-16px). Special raised violet Create button in nav.

### Pages
- **Home**: Greeting + Telegram avatar, hero-card balance with animated number + progress bar, 2-column action cards (Create Report + Top Up), 3-column stats, recent reports, referral invite section
- **Create**: 4-step progress bar with labels, 2-column grid of 11 report types, education level tabs (All/School/College/University) for filtering 17 categories, search within subjects, details form with topic + group, AI generation spinner with percentage
- **History**: Skeleton loading, detail viewer with word count + copy, empty state
- **Balance**: Hero balance card, Telegram Stars golden button, Card payment + Crypto USDT tiles, individual payment flows with copy fields, receipt note
- **Profile**: Hero card with Telegram avatar + username + ID, level progress, 3-column stats, 4 achievements, referral code + copy link, 30-language selector, version footer

### i18n
- 30 languages selectable, 3 full translations (en/ru/uk)
- CIS languages with Russian fallback: Kazakh, Uzbek, Kyrgyz, Tajik, Turkmen, Azerbaijani, Armenian, Georgian, Belarusian, Moldovan, Mongolian
- Other languages with English fallback
- Subject categories: `school_math`, `school_ukr`, `school_science`, `school_history`, `school_langs`, `school_other`, `college_it`, `college_tech`, `uni_math`, `uni_it`, `uni_humanities`, `uni_business`, `uni_law`, `uni_eng`, `uni_medicine`, `other`

### TWA API Routes (/api/twa)
- `POST /auth` — authenticate/create user (returns referralCode, referralCount)
- `POST /generate` — generate report (balance check, AI, save)
- `GET /reports?telegram_id=X` — list reports
- `POST /payment` — create payment request (card/crypto/stars)
- `POST /create-invoice` — create Telegram Stars invoice URL

## Environment Variables

- `TELEGRAM_BOT_TOKEN` — Bot token from @BotFather
- `DATABASE_URL` — PostgreSQL (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — Replit AI proxy URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI proxy key

## DB Schema

### users
- `id` serial PK, `telegram_id` unique bigint, `username`, `first_name`, `last_name`
- `balance` int, `free_reports_used` bool, `total_reports` int
- `referral_code` varchar(20) unique, `referred_by` bigint, `referral_count` int
- timestamps

### reports
- Generated reports with content, type, subject, topic, group, status

### payments
- Payment requests: amount, currency, method (card/crypto/stars/manual), status

## Development

- `pnpm --filter @workspace/api-server run dev` — API server + bot
- `pnpm --filter @workspace/study-app run dev` — Mini App frontend
- `pnpm --filter @workspace/db run push` — push schema to DB
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types

## Support
- Telegram: @studypro_support
- Payment recipient: StudyPro
