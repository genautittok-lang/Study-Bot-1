# Railway Deployment Guide — StudyFlush API

## Required Environment Variables

### AI (Gemini — free tier)
Get your free API key at https://aistudio.google.com
```
GEMINI_API_KEY=your_google_gemini_api_key
```
Free limits: 15 RPM / 1500 RPD — enough for start.

### Database (PostgreSQL)
Add a PostgreSQL plugin in Railway, it auto-sets DATABASE_URL.
```
DATABASE_URL=postgresql://...
```

### Telegram Bot
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

### Server
```
PORT=3000
```

### Admin Panel
Set your Telegram ID to access the admin panel:
```
ADMIN_IDS=123456789
```
Multiple admins: `ADMIN_IDS=123456789,987654321`

### Optional
```
AI_MODEL=gemini-2.5-flash
NODE_ENV=production
```

## Deploy Steps

1. Create a new project on Railway
2. Connect your GitHub repo (or use Railway CLI)
3. Add PostgreSQL plugin
4. Set all env vars above
5. Deploy — Railway will use `railway.json` automatically
6. Bot uses long-polling mode by default (no webhook setup needed)

## Architecture
- API server: Express.js with Telegraf bot (long-polling)
- AI: Google Gemini via OpenAI-compatible API
- DB: PostgreSQL with Drizzle ORM
- Frontend: Static Telegram Mini App (hosted separately or via GitHub Pages)
