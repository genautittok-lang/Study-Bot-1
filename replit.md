# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Main product is **StudyBot** — a Telegram bot that generates academic reports, summaries, lab work, essays and more for students using AI.

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

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server + Telegram Bot
│       └── src/
│           └── bot/        # Bot logic
│               ├── index.ts     # Main bot, handlers, state machine
│               ├── ai.ts        # OpenAI report generation
│               ├── db.ts        # DB helpers for bot
│               ├── keyboards.ts # Inline keyboards
│               └── messages.ts  # Text templates + content lists
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
│       └── src/schema/
│           ├── users.ts    # Users table (balance, freeReportsUsed)
│           ├── reports.ts  # Generated reports table
│           └── payments.ts # Payments table
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Bot Features

- **Free first report** for every new user
- **6 document types**: Report, Summary, Database, Lab Work, Essay, Tasks
- **11 subjects**: Programming, Math, Physics, Chemistry, Biology, History, Geography, Databases, Networks, Economics, Other
- **3 payment methods**: Monobank (250 UAH), Crypto (5 USDT), Telegram Stars (500 XTR)
- **AI generation**: gpt-5.2 with structured Ukrainian prompts per document type

## Environment Variables / Secrets

- `TELEGRAM_BOT_TOKEN` — Bot token from @BotFather
- `DATABASE_URL` — PostgreSQL connection (auto-provisioned by Replit)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — Replit AI Integrations proxy URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI Integrations API key

## DB Schema

### users
- `telegram_id` — unique Telegram user ID
- `balance` — number of remaining reports
- `free_reports_used` — whether the free report was used
- `total_reports` — lifetime reports generated

### reports
- Stores all generated reports with content, type, subject, topic

### payments
- Tracks all payment requests (pending/confirmed)
- Methods: mono, crypto, stars, manual

## Telegram Mini App (TWA)

The study-app artifact is a React + Vite Telegram Mini App with:
- **Home page**: greeting, balance card, quick action grid
- **New Report**: multi-step form (type -> subject -> details -> generate -> done)
- **History**: list of generated reports with detail viewer
- **Balance**: payment options (Monobank, Crypto, Telegram Stars)
- **Bottom tab navigation**: Головна, Створити, Історія, Баланс
- **All UI in Ukrainian**, light blue/white premium theme
- **Demo mode**: works outside Telegram with test user (telegramId: 999999999)

### TWA API Routes (mounted at /api/twa)
- `POST /auth` — authenticate/create user from Telegram data
- `POST /generate` — generate a report (checks balance, calls AI, saves)
- `GET /reports?telegram_id=X` — list user's reports
- `POST /payment` — create a payment request

## Development

- `pnpm --filter @workspace/api-server run dev` — run the dev server + bot
- `pnpm --filter @workspace/study-app run dev` — run the Mini App frontend
- `pnpm --filter @workspace/db run push` — push schema changes to DB
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API types

## Bot Commands

- `/start` — Welcome screen + main menu
- `/menu` — Main menu
- `/balance` — Check balance
- `/help` — Help & instructions
