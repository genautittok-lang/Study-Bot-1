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
│           └── lib/        # api, store, telegram, i18n, constants
├── lib/
│   ├── api-spec/           # OpenAPI spec
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle schema (users, reports, payments)
```

## Bot Features

- **Free first report** for every new user
- **6 document types**: Report, Summary, Database, Lab Work, Essay, Tasks
- **11 subjects**: Programming, Math, Physics, Chemistry, Biology, History, Geography, Databases, Networks, Economics, Other
- **3 payment methods**: Monobank (250 UAH), Crypto (5 USDT), Telegram Stars (500 XTR)
- **AI generation**: gpt-5.2 with structured prompts per document type

## Telegram Mini App (TWA)

Premium React + Vite app with Framer Motion animations:
- **Home**: greeting, gradient balance card, quick action grid, quick start CTA
- **Create**: multi-step form (type -> subject -> details -> generate with progress bar -> done)
- **History**: animated list of reports with detail viewer and copy
- **Balance**: gradient payment cards (Monobank, Crypto, Telegram Stars)
- **Profile**: user card, language selection (30 languages), statistics
- **i18n**: 30 languages with IP-based auto-detection and Telegram language_code fallback
- **Bottom nav**: frosted glass effect with animated indicator (5 tabs)
- **Demo mode**: works outside Telegram with test user (telegramId: 999999999)

### i18n Languages (30 selectable, 3 full translations)
Full translations: English (en), Russian (ru), Ukrainian (uk)
CIS languages with Russian fallback: Kazakh, Uzbek, Kyrgyz, Tajik, Turkmen, Azerbaijani, Armenian, Georgian, Belarusian, Moldovan, Mongolian
Other languages with English fallback: Turkish, Polish, German, French, Spanish, Portuguese, Italian, Romanian, Czech, Bulgarian, Serbian, Croatian, Arabic, Hindi, Chinese, Japanese

### TWA API Routes (/api/twa)
- `POST /auth` — authenticate/create user
- `POST /generate` — generate report (balance check, AI, save)
- `GET /reports?telegram_id=X` — list reports
- `POST /payment` — create payment request

## Environment Variables

- `TELEGRAM_BOT_TOKEN` — Bot token from @BotFather
- `DATABASE_URL` — PostgreSQL (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — Replit AI proxy URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI proxy key

## DB Schema

### users
- `id` serial PK, `telegram_id` unique bigint, `username`, `first_name`, `last_name`
- `balance` int, `free_reports_used` bool, `total_reports` int, timestamps

### reports
- Generated reports with content, type, subject, topic, group, status

### payments
- Payment requests: amount, currency, method (mono/crypto/stars/manual), status

## Development

- `pnpm --filter @workspace/api-server run dev` — API server + bot
- `pnpm --filter @workspace/study-app run dev` — Mini App frontend
- `pnpm --filter @workspace/db run push` — push schema to DB
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types
