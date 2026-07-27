# 💰 Hisob Bot - AI Finance Ecosystem

> Production-ready Telegram AI Finance Bot with Premium Mini App

## 🏗️ Architecture

```
hisob_bot/
├── packages/
│   ├── shared/          # Common types, utils, validators
│   ├── bot/             # Telegraf.js Telegram Bot
│   ├── backend/         # NestJS API Server
│   ├── miniapp/         # Next.js 15 Telegram Mini App
│   └── admin/           # Next.js Admin Panel
├── prisma/              # PostgreSQL Database Schema
├── .env                 # Environment Variables
└── package.json         # Root workspace config
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion, Recharts, Zustand |
| **Backend** | NestJS, TypeScript, Prisma ORM |
| **Bot** | Telegraf.js, Node-cron |
| **Database** | PostgreSQL |
| **AI** | OpenAI GPT-4o |
| **Voice** | Fireflies AI |
| **Auth** | Telegram Mini App SDK |

## ⚡ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 3. Configure Environment

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hisob_bot"
BOT_TOKEN="your_telegram_bot_token"
OPENAI_API_KEY="your_openai_api_key"
FIREFLIES_API_KEY="your_fireflies_api_key"
```

### 4. Start Development

```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:bot       # Telegram Bot (port 3002)
npm run dev:backend   # API Server (port 3001)
npm run dev:miniapp   # Mini App (port 3000)
npm run dev:admin     # Admin Panel (port 3003)
```

## 📱 Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Start bot & show welcome message |
| `/balance` | View current balance |
| `/add` | Add expense |
| `/income` | Add income |
| `/stats` | Monthly statistics |
| `/budget` | View budgets |
| `/setbudget` | Set budget limit |
| `/goals` | Financial goals |
| `/advice` | AI financial advice |
| `/chat` | Chat with AI |
| `/score` | Financial health score |
| `/voice` | Voice input guide |
| `/history` | Transaction history |
| `/report` | Monthly report |

## 🎯 Features

### Mini App (Premium Fintech UI)
- **Dark mode** with glassmorphism design
- **Dashboard** with balance, income, expenses
- **Transactions** with search, filter, CRUD
- **Analytics** with Recharts (bar, line, area, pie)
- **Budget** management with progress bars
- **AI Assistant** chat interface
- **Profile** settings
- **Bottom navigation** with smooth transitions

### AI Assistant
- Financial health score (0-100)
- Spending analysis & predictions
- Savings recommendations
- Budget suggestions
- Natural language chat

### Voice Input
- Telegram voice messages → Fireflies AI → Text → Transaction
- Automatic category detection
- Amount extraction from speech

### Notifications
- Budget exceeded alerts
- Daily reminders
- Weekly summaries
- Monthly reports

## 🔐 Security

- JWT authentication
- Telegram verification
- Input validation & sanitization
- Rate limiting ready
- CORS configured

## 📊 API Endpoints

### Auth
- `POST /api/auth/sync` - Sync Telegram user

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:telegramId` - List transactions
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `POST /api/budgets` - Create/update budget
- `GET /api/budgets/:telegramId` - List budgets
- `DELETE /api/budgets/:id` - Delete budget

### Analytics
- `GET /api/analytics/:telegramId` - Full analytics
- `GET /api/analytics/dashboard/:telegramId` - Dashboard data

### AI
- `POST /api/ai/advice` - Get AI advice
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/score` - Get financial score

### Voice
- `POST /api/voice/process` - Process voice message
- `POST /api/voice/confirm` - Confirm voice transaction

### Reports
- `GET /api/reports/:telegramId/monthly` - Monthly report

## 🌐 Production Deployment

### Docker (Recommended)

```dockerfile
# Each package has its own Dockerfile
# Use docker-compose.yml for orchestration
```

### Manual Deployment

1. Build all packages: `npm run build`
2. Setup PostgreSQL database
3. Run migrations: `npx prisma migrate deploy`
4. Start services with PM2 or systemd

## 📄 License

MIT

---

Built with ❤️ for the Uzbek developer community
