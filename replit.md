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
- **6 document types**: Report, Summary, Database, Lab Work, Essay, Tasks
- **50+ subjects** in **10 categories**: IT, Math, Sciences, Humanities, Business, Law, Languages, Engineering, Medicine, Other
- **5 payment methods**: Visa/Mastercard (250 UAH), Google Pay (250 UAH), Apple Pay (250 UAH), Crypto USDT (5$), Telegram Stars (500 XTR)
- **AI generation**: gpt-5.2 with structured prompts per document type
- **Referral system**: +2 reports for referrer and invitee, unique codes per user
- **Level progression**: Beginner (0-5), Student (6-20), Expert (21-50), Master (51-100), Legend (101+)
- **Achievements**: First Step, Expert, Master, Networker

## Telegram Mini App (TWA)

Premium React + Vite fintech-grade TWA:
- **Design system**: CSS classes — `hero-card` (deep navy gradient with radial glow + shimmer), `card` / `card-interactive` (white/dark, 20px radius, border, tap scale), `btn-primary` (gradient #667eea→#764ba2 with inner highlight + shadow), `btn-success` (green gradient), `btn-ghost`, `badge` / `badge-success`, `section-title` (uppercase tracking), `input-field` (focus ring), `nav-glass` (backdrop-filter blur), `avatar-ring` (gradient border), `glass`, `skeleton`, `spinner`, `pop-in`, `stat-value`, `progress-bar`. Primary = `hsl(239 84% 67%)`. Gradients: `linear-gradient(135deg, #667eea, #764ba2)`.
- **Dark mode**: Full dark theme via .dark class, auto-synced with Telegram colorScheme every 1s. Dark bg `hsl(224 71% 4%)`, cards `hsl(224 50% 7%)`.
- **Telegram integration**: `photo_url` pulled from WebApp.initDataUnsafe.user, stored in globalPhotoUrl, displayed in profile and home page avatars with gradient ring. Username and ID displayed in profile hero card.
- **Page transitions**: AnimatePresence with fade+slide variants, staggered item animations.
- **Home**: greeting + avatar (Telegram photo), hero-card balance with shimmer + AnimatedNumber, progress bar to next level, "Create Report" CTA, 3-column stats, recent reports, referral invite section.
- **Create**: 4-step animated progress bar (type → category → subject → details), staggered list animations, search within subjects, char count, AI generation spinner with percentage + progress bar.
- **History**: skeleton loading states, detail viewer with word count, copy with feedback, empty state with icon.
- **Balance**: hero-card balance with shimmer, 5 payment methods as card-interactive tiles with branded icons, individual payment flows (card copy, crypto address, stars instructions), CopyField component with visual feedback.
- **Profile**: hero-card with Telegram avatar (photo_url), username (@user), ID display, level progress bar, 3-column stats, emoji achievements, referral system with code + copy link, 30-language selector with search.
- **i18n**: 30 languages with IP-based auto-detection and Telegram language_code fallback. Full translations: en/ru/uk.
- **Bottom nav**: frosted glass backdrop-filter with spring-animated gradient pill indicator, filled icons for active tab, balance badge.
- **Demo mode**: works outside Telegram with test user (telegramId: 999999999).

### i18n Languages (30 selectable, 3 full translations)
Full translations: English (en), Russian (ru), Ukrainian (uk)
CIS languages with Russian fallback: Kazakh, Uzbek, Kyrgyz, Tajik, Turkmen, Azerbaijani, Armenian, Georgian, Belarusian, Moldovan, Mongolian
Other languages with English fallback: Turkish, Polish, German, French, Spanish, Portuguese, Italian, Romanian, Czech, Bulgarian, Serbian, Croatian, Arabic, Hindi, Chinese, Japanese

### TWA API Routes (/api/twa)
- `POST /auth` — authenticate/create user (returns referralCode, referralCount)
- `POST /generate` — generate report (balance check, AI, save)
- `GET /reports?telegram_id=X` — list reports
- `POST /payment` — create payment request (card/google_pay/apple_pay/crypto/stars)

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
- Payment requests: amount, currency, method (card/google_pay/apple_pay/crypto/stars/manual), status

## Development

- `pnpm --filter @workspace/api-server run dev` — API server + bot
- `pnpm --filter @workspace/study-app run dev` — Mini App frontend
- `pnpm --filter @workspace/db run push` — push schema to DB
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types

## Support
- Telegram: @studypro_support
- Payment recipient: StudyPro
