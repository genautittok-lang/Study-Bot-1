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

Professional React + Vite app with clean, minimal UI:
- **Design system**: card-pro, card-elevated, card-highlight, nav-pro (frosted glass), badge-pro, section-label, skeleton loaders, shimmer-subtle, input-pro, spinner, success-pop animation. Light bg (hsl 220 14% 96%), white cards, navy gradient accent (#1a1a2e → #0f3460). Inter font, tight tracking (-0.011em).
- **Dark mode**: Full dark theme via .dark class, auto-synced with Telegram colorScheme. Dark card bg (hsl 224 25% 11%), adjusted borders/shadows/text.
- **Page transitions**: AnimatePresence with fade+slide variants between all pages.
- **Home**: greeting with animated level avatar, dark navy balance card with shimmer + animated number counter, "Create Report" CTA, 3-column stats grid, recent reports list, referral invite card with copy feedback.
- **Create**: 4-step animated progress bar (type → category → subject → details), staggered list animations, search within subjects, char count, AI generation spinner with percentage + progress bar.
- **History**: search/filter, skeleton loading states, detail viewer with word count, copy with visual feedback (button color change), date formatting.
- **Balance**: dark navy balance card with shimmer, 5 payment methods as list items with branded icons and prices, individual payment flows per method, success-pop animation on confirmation.
- **Profile**: dark gradient user card with level progress bar animation, 3-column stats with count-up, 4 achievement badges, referral code with copy, 30-language selector with search.
- **i18n**: 30 languages with IP-based auto-detection and Telegram language_code fallback.
- **Bottom nav**: frosted glass backdrop-filter with spring-animated pill indicator, filled icons for active tab, balance badge.
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
