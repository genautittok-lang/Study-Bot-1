# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Main product is **SmartStudy** — a Telegram bot + Mini App that generates academic reports, summaries, lab work, essays and more for students using AI. Supports 30 languages with CIS focus.

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
- **3 payment methods**: Card (250 UAH, card 5232 4410 5654 6307 — Ukraine only), Crypto USDT (5 USDT TRC-20, address TRYbty4Ew9knf61brdrixeY5M34mQTt3zY), Telegram Stars (500 XTR)
- **Card visibility**: Card payment only shown when user language is "uk" (Ukrainian); all other users see Stars + Crypto only
- **Receipt flow**: After card/crypto payment, user sends screenshot to @smartstudy_support admin for manual verification
- **AI generation**: gpt-5.2 with structured prompts per document type (specific prompts for all 11 types), vision support for photo attachments
- **File upload**: Users can attach photos of tasks from textbooks (base64, max 5MB, JPG/PNG), AI reads the image via vision
- **Referral system**: +2 reports for referrer and invitee, unique codes per user
- **Level progression**: Beginner (0-5), Student (6-20), Expert (21-50), Master (51-100), Legend (101+)
- **Achievements**: First Step, Expert, Master, Networker, Speed Runner, Legend

## Telegram Mini App (TWA)

Premium React + Vite fintech-grade TWA with light premium design:

### Design System (Light Premium Theme — v2)
- **Background**: `#F0F0F8` with gradient overlay `(#EEEDF8 → #F0F0F8 → #EDF5FF → #F0F8F4)`
- **Cards**: `rgba(255,255,255,0.75)` with `backdrop-filter: blur(28px) saturate(200%)`, border `rgba(255,255,255,0.7)`, dual shadow layers
- **Text**: Primary `#12122a`, secondary `#5a5f72`, tertiary `#8b90a0`
- **Color Palette**: Purple `#7B68EE` (deep `#5B4CCF`), Blue `#4A90FF`, Cyan `#00D4AA`, Green `#00C48C`, Pink `#FF6B9D`, Orange `#FF8A50`
- **Hero cards**: Gradient backgrounds (purple 145deg) with radial glow overlays + diagonal stripe pattern
- **Interactive**: 3D tilt cards (perspective transform on pointer move), animated progress rings (SVG), animated counters
- **Ambient**: 4 floating liquid orbs with blur(90px) + subtle noise texture overlay
- **Accessibility**: `@media (prefers-reduced-motion: reduce)` disables animations and hides orbs

#### CSS Classes
- `.hero-card` — Gradient card with radial glow overlays (`.hero-purple`, `.hero-blue`, `.hero-dark`)
- `.hero-shimmer` — Animated shimmer sweep on hero cards
- `.g-card` — White frosted glass card with backdrop-blur (22px radius)
- `.g-card-glow` — Glass card with purple border glow
- `.g-card-s` — Smaller glass card variant
- `.btn-main` — Purple gradient with shadow and glass highlight
- `.btn-accent` — Green gradient with glow
- `.btn-ghost` — Transparent with border
- `.btn-outline` — Transparent with strong border
- `.gradient-text` — Purple→blue→cyan gradient text
- `.gradient-text-animated` — Animated flowing gradient text
- `.gradient-border` — Animated gradient border using mask
- `.avatar-ring` — Holographic spinning border ring (CSS `@property --holo-angle`)
- `.badge` / `.badge-g` / `.badge-blue` / `.badge-orange` — Pill badges
- `.input-field` — Clean focus ring with purple glow (16px radius)
- `.icon-box` — 44px icon container (15px radius)
- `.icon-box-sm` — 36px icon container
- `.section-label` — Uppercase tracking label (11px, 750 weight)
- `.nav-floating` — Floating pill nav bar (24px radius, blur 40px, elevated shadow)
- `.spinner` — Purple loading spinner
- `.progress-bar` — White/translucent progress bar
- `.skeleton` — Animated shimmer loading placeholder
- `.glass-strong` — Heavy glassmorphism (blur 40px)
- `.slide-up` / `.pop-in` — Entry animations
- `.create-btn-glow` — Pulsing glow animation for create button

**Nav**: Floating pill-shaped bar with 24px border-radius, centered raised purple Create (+) button with glow animation, animated gradient indicator line on active tab.

### 3D Icon System
- `Icon3D` component in `src/components/icons-3d.tsx` — 22+ icon types with gradient SVG fills
- `REPORT_ICON_MAP` maps report type IDs to icon IDs
- Used across: new-report type grid, home quick actions, balance payment methods, referral sections

### Pages
- **Home**: Time-based greeting with avatar, 3D tilt CTA card "Create Report" with rotating sparkle icon, balance card with SVG progress ring, horizontal scroll quick actions (with 3D icons), bento stats grid, recent subjects horizontal scroll, referral section with step-by-step flow + stats cards + Telegram share CTA
- **Create**: 4-step gradient progress bar, 11 report types grid with 3D icons, education level segmented tabs, search with clear, details form with photo upload/preview, dual-ring AI generation animation with localized tips carousel + progress bar
- **History**: Search bar with clear, report type filter tabs (dynamic), skeleton loading, detail viewer with Markdown + copy + word count, share via Telegram, repeat button, better empty state with CTA
- **Balance**: Credit-card style blue gradient balance display, featured Telegram Stars button with HOT badge, Card/Crypto tiles with 3D icons, unified payment flow with dark package card
- **Profile**: Purple gradient header card with avatar + level progress, stats grid, 6 achievements with SVG progress rings, Settings section (Language/Support/Rate App), About section (Telegram ID/Version), referral section with step-by-step flow + stats + Telegram share as primary CTA
- **Admin**: Dashboard stats, user management (+balance), payment approval/rejection, broadcast to all users

### Admin Panel

- **Route**: `/admin` (frontend), `/api/admin/*` (backend)
- **Auth**: Server-side check via `ADMIN_IDS` env var (comma-separated telegram IDs, defaults to `999999999`)
- **Tabs**:
  - **Dashboard**: Total users, reports, payments, pending payments count; recent users list
  - **Users**: Paginated list with search, add balance to any user (notifies via bot)
  - **Payments**: Filter by status (all/pending/completed/rejected), approve/reject pending payments (notifies users)
  - **Broadcast**: Send message (HTML formatted) with optional image to all users via Telegram bot

### Telegram BackButton
- Native Telegram BackButton shown on all sub-pages (History, Profile, Balance, New Report, Admin)
- Hidden on home page; navigates back to home on press with haptic feedback
- Gracefully handles unsupported Telegram versions

### i18n
- 39 languages selectable, 3 full translations (en/ru/uk)
- CIS languages with Russian fallback
- Other languages with English fallback
- Generating tips (genTip1-6) localized in EN/RU/UK

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
- Telegram: @smartstudy_support
- Payment recipient: SmartStudy
