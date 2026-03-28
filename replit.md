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

Premium React + Vite app with Framer Motion animations:
- **Home**: greeting with level icon, gradient balance card with shimmer, 2x2 quick action grid, referral invite banner, quick start CTA
- **Create**: multi-step form (type -> category -> subject -> details -> generate with progress bar -> done)
- **History**: animated list of reports with detail viewer and copy
- **Balance**: gradient balance card, 5 payment methods (Visa/MC, Google Pay, Apple Pay, Crypto, Stars) with individual payment flows
- **Profile**: dark gradient header with avatar/level, achievements (4 badges), referral system with code/stats/copy link, 3-column stats, language selector (30 langs), account info
- **i18n**: 30 languages with IP-based auto-detection and Telegram language_code fallback
- **Bottom nav**: frosted glass effect with animated indicator (5 tabs)
- **Demo mode**: works outside Telegram with test user (telegramId: 999999999)
- **Premium CSS**: shimmer, glow, float, pulse animations; gradient text; glass effects

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
