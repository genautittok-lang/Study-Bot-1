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
- **Background**: `#F5F5FA` (light lavender-gray)
- **Cards**: `rgba(255,255,255,0.72)` with `backdrop-filter: blur(24px) saturate(180%)`, border `rgba(255,255,255,0.6)`, shadow `0 4px 16px rgba(0,0,0,0.03)`
- **Text**: Primary `#1a1a2e`, secondary `#6b7280`, tertiary `#9ca3af`
- **Primary**: `#6C5CE7` (purple), `#0984E3` (blue), `#00CEC9` (cyan), `#00B894` (green), `#FF9F43` (orange)
- **Hero cards**: Gradient backgrounds (purple 145deg, blue 145deg) with radial glow overlays
- **Interactive**: 3D tilt cards (perspective transform on pointer move), animated progress rings (SVG), animated counters

#### CSS Classes
- `.hero-card` — Gradient card with radial glow overlays (`.hero-purple`, `.hero-blue`, `.hero-dark`)
- `.hero-shimmer` — Animated shimmer sweep on hero cards
- `.g-card` — White frosted glass card with backdrop-blur
- `.btn-main` — Purple gradient with shadow
- `.btn-accent` — Green gradient
- `.btn-ghost` — Transparent with border
- `.gradient-text` — Purple→cyan gradient text
- `.avatar-ring` — Holographic spinning border ring (CSS `@property --holo-angle`)
- `.badge` / `.badge-g` / `.badge-blue` — Pill badges
- `.input-field` — Clean focus ring with purple glow
- `.icon-box` — 38px icon container
- `.section-label` — Uppercase tracking label
- `.nav-bar` — White frosted glass nav with blur(24px)
- `.spinner` — Purple loading spinner
- `.progress-bar` — White/translucent progress bar
- `.skeleton` — Animated shimmer loading placeholder
- Ambient orbs: Floating colored circles in background
- Water ripple tap effect

**Nav**: Centered raised purple Create (+) button with glow, white frosted glass bar, active tab has purple dot indicator.

### Pages
- **Home**: Time-based greeting with avatar, 3D tilt CTA card "Create Report" with rotating sparkle icon, balance card with SVG progress ring, horizontal scroll quick actions, bento stats grid, recent activity feed, referral banner
- **Create**: 4-step gradient progress bar, 11 report types grid, education level segmented tabs, search with clear, details form with photo upload/preview, AI generation spinner with percent
- **History**: Skeleton loading, detail viewer with Markdown + copy, empty state with illustration
- **Balance**: Credit-card style blue gradient balance display, featured Telegram Stars button with HOT badge, Card/Crypto tiles with icons, unified payment flow with dark package card
- **Profile**: Purple gradient header card with avatar + level progress, stats grid, achievements with SVG progress rings showing completion %, referral with inline copy, language selector
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
