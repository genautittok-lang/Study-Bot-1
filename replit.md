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
│   │   └── src/
│   │       ├── bot/        # Bot logic (index, ai, db, keyboards, messages)
│   │       └── routes/
│   │           ├── twa/    # TWA API routes
│   │           └── admin/  # Admin API routes (stats, users, payments, broadcast)
│   └── study-app/          # React Vite Mini App (TWA)
│       └── src/
│           ├── pages/      # home, new-report, history, balance, profile, admin
│           └── lib/        # api, admin-api, store, telegram, i18n
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

Premium React + Vite fintech-grade TWA with light premium design:

### Design System (Light Theme)
- **Background**: `#f0f1f5` (light gray)
- **Cards**: White `#ffffff` with subtle shadows `0 1px 3px rgba(0,0,0,0.04)`
- **Text**: Primary `#1a1b23`, secondary `#888`/`#999`
- **Accent**: Violet `#7c3aed`/`#8b5cf6`

#### CSS Classes
- `.hero-card` — Violet gradient with glass overlays, shimmer sweep
- `.g-card` — White card with subtle border and shadow
- `.btn-main` — Violet gradient with top highlight, shadow
- `.btn-accent` — Green gradient with top highlight
- `.btn-ghost` — Light gray button
- `.gradient-text` — Purple-to-cyan gradient text
- `.avatar-ring` — Linear gradient border (violet→cyan)
- `.badge` / `.badge-g` — Pill badges (violet / green)
- `.input-field` — Clean focus ring with violet glow
- `.icon-box` — 44px icon container
- `.section-label` — Uppercase tracking label
- `.nav-bar` — White frosted glass nav with blur(24px)
- `.spinner` — Violet loading spinner

**Nav**: Centered raised violet Create (+) button, white frosted glass bar with blur.

### Pages
- **Home**: Greeting + Telegram avatar, hero-card balance, 2-column action cards, 3-column stats, recent reports, referral invite
- **Create**: 4-step progress bar, 11 report types grid, education level tabs, search, details form with photo upload, AI generation spinner
- **History**: Skeleton loading, detail viewer with Markdown + copy, empty state
- **Balance**: Hero balance card, Telegram Stars golden button, Card/Crypto tiles, payment flows with copy fields
- **Profile**: Hero card with avatar + username, level progress, stats, achievements, referral code + copy, 30-language selector
- **Admin**: Dashboard stats, user management (+balance), payment approval/rejection, broadcast to all users

### Admin Panel

- **Route**: `/admin` (frontend), `/api/admin/*` (backend)
- **Auth**: Server-side check via `ADMIN_IDS` env var (comma-separated telegram IDs, defaults to `999999999`)
- **Tabs**:
  - **Dashboard**: Total users, reports, payments, pending payments count; recent users list
  - **Users**: Paginated list with search, add balance to any user (notifies via bot)
  - **Payments**: Filter by status (all/pending/completed/rejected), approve/reject pending payments (notifies users)
  - **Broadcast**: Send message (HTML formatted) with optional image to all users via Telegram bot

### i18n
- 30 languages selectable, 3 full translations (en/ru/uk)
- CIS languages with Russian fallback
- Other languages with English fallback

### TWA API Routes (/api/twa)
- `POST /auth` — authenticate/create user
- `POST /generate` — generate report
- `GET /reports?telegram_id=X` — list reports
- `POST /payment` — create payment request
- `POST /create-invoice` — create Telegram Stars invoice

### Admin API Routes (/api/admin)
- `GET /stats` — dashboard statistics
- `GET /users?page=N&search=Q` — paginated users with search
- `POST /users/:telegramId/balance` — add balance to user
- `GET /payments?status=S&page=N` — paginated payments with status filter
- `POST /payments/:id/approve` — approve pending payment
- `POST /payments/:id/reject` — reject pending payment
- `POST /broadcast` — send message to all users

## Environment Variables

- `TELEGRAM_BOT_TOKEN` — Bot token from @BotFather
- `DATABASE_URL` — PostgreSQL (auto-provisioned)
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — Replit AI proxy URL
- `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit AI proxy key
- `ADMIN_IDS` — Comma-separated Telegram IDs for admin access (default: `999999999`)

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
