# Crypto Casino - Provably Fair Gaming Platform

A comprehensive, production-ready crypto casino platform built with TypeScript, featuring provably fair gaming, KYC/AML compliance, responsible gaming controls, and multi-currency support.

## 🎰 Features

### Core Gaming
- **Provably Fair System**: HMAC-SHA256 based RNG with server/client seed verification
- **Multiple Games**: Dice, Coinflip, and Slots with configurable RTPs
- **Real-time Verification**: Client-side result verification tool
- **Seed Management**: Manual and automatic seed rotation

### User Management
- **Multi-Auth**: Magic link (email) and wallet connect (MetaMask/WalletConnect)
- **KYC/AML**: Document upload, verification workflows, risk scoring
- **Responsible Gaming**: Deposit/loss limits, session controls, self-exclusion
- **Multi-Currency**: BTC, ETH, USDT, USDC, USD support

### Financial Features
- **Payment Adapters**: Coinbase Commerce, BTCPay Server, NOWPayments integration
- **Bonus System**: Welcome, deposit, cashback bonuses with wagering requirements
- **Affiliate Program**: Multi-tier commission structure with detailed analytics
- **Accounting**: Double-entry ledger with transaction history

### Admin & Compliance
- **Admin Dashboard**: Real-time metrics, user management, game configuration
- **Audit Logging**: Complete activity tracking for compliance
- **Security**: Rate limiting, encryption, CORS, CSRF protection
- **Observability**: Prometheus metrics, Grafana dashboards, structured logging

## 🏗️ Architecture

### Monorepo Structure
```
crypto-casino/
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # Next.js frontend
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── config/       # Configuration schemas
│   └── ui/           # Shared UI components
└── infra/            # Infrastructure configuration
```

### Tech Stack

**Backend:**
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache/Queues**: Redis with BullMQ
- **Storage**: MinIO (S3-compatible) for KYC documents
- **Auth**: JWT with refresh tokens + wallet signatures

**Frontend:**
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS + shadcn/ui components
- **State**: TanStack Query for server state
- **Forms**: React Hook Form + Zod validation
- **i18n**: Spanish/English support

**Infrastructure:**
- **Containerization**: Docker Compose for development
- **Monitoring**: Prometheus + Grafana
- **Email**: Mailhog (dev) / SMTP (production)
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Docker and Docker Compose
- Git

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd crypto-casino
   pnpm install
   ```

2. **Start development environment:**
   ```bash
   make dev
   ```
   This will:
   - Start all Docker services (PostgreSQL, Redis, MinIO, etc.)
   - Run database migrations and seed data
   - Start the API and web applications

3. **Access the applications:**
   - 🎰 **Web App**: http://localhost:3000
   - 🔧 **API**: http://localhost:3001
   - 📊 **API Docs**: http://localhost:3001/api/docs
   - 📈 **Grafana**: http://localhost:3000 (admin/admin)
   - 📧 **Mailhog**: http://localhost:8025
   - 💾 **MinIO**: http://localhost:9001 (minioadmin/minioadmin123)

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables to customize:
- `JWT_SECRET`: Secure JWT signing key (32+ characters)
- `ENCRYPTION_KEY`: Data encryption key (32+ characters)
- `DATABASE_URL`: PostgreSQL connection string
- Payment provider API keys (optional for development)

## 🎲 Provably Fair System

### How It Works

1. **Server Seed**: Casino generates random seed, publishes hash
2. **Client Seed**: Player provides their own seed
3. **Nonce**: Incremental counter for each bet
4. **Result**: `HMAC-SHA256(server_seed, client_seed:nonce)`

### Verification

Players can verify any game result:
```typescript
const result = crypto
  .createHmac('sha256', serverSeed)
  .update(`${clientSeed}:${nonce}`)
  .digest('hex');
```

### API Endpoints
- `POST /provably-fair/seed/commit` - Commit new seeds
- `POST /provably-fair/seed/reveal` - Reveal and rotate seeds
- `POST /provably-fair/verify` - Verify game results

## 🎮 Gaming System

### Dice Game
- **Range**: 0.00-99.99
- **Betting**: Under/Over target number
- **House Edge**: 1% (configurable)
- **Min/Max Bets**: Configurable per currency

### Coinflip
- **Options**: Heads or Tails
- **Payout**: 1.98x (1% house edge)
- **Simple**: 50/50 probability

### Slots
- **Reels**: 3x3 grid with 7 symbols
- **Paylines**: 1-25 configurable lines
- **Paytable**: Configurable multipliers
- **Features**: Multiple winning combinations

## 💰 Payment System

### Supported Providers
- **Coinbase Commerce**: Full integration with webhooks
- **BTCPay Server**: Self-hosted Bitcoin payments
- **NOWPayments**: Multi-cryptocurrency processor
- **Internal Wallet**: Custodial wallet simulation

### Deposit Flow
1. User creates deposit intent
2. Payment address/URL generated
3. User sends cryptocurrency
4. Webhook confirms payment
5. Balance updated automatically

### Withdrawal Flow
1. User submits withdrawal request
2. 2FA verification (if enabled)
3. Admin approval (configurable)
4. Transaction broadcast
5. Confirmation tracking

## 🛡️ Security & Compliance

### Security Features
- **Rate Limiting**: Per-IP and per-user limits
- **Data Encryption**: PII encrypted at rest
- **Secure Headers**: Helmet.js protection
- **Input Validation**: Zod schema validation
- **Audit Logging**: All sensitive actions logged

### Responsible Gaming
- **Deposit Limits**: Daily/weekly/monthly caps
- **Loss Limits**: Configurable loss protection
- **Time Limits**: Session duration controls
- **Self-Exclusion**: Temporary and permanent options
- **Reality Checks**: Periodic session reminders

### KYC/AML Compliance
- **Document Upload**: Secure S3 storage
- **Verification Workflow**: Admin review process
- **Risk Scoring**: Automated AML screening
- **Geographic Restrictions**: Country-based blocking
- **Transaction Monitoring**: Suspicious activity detection

## 📊 Admin Dashboard

### Key Metrics
- **Financial**: GGR, NGR, deposits, withdrawals
- **Users**: Registration, verification, activity
- **Games**: Popular games, house edge performance
- **Security**: Failed logins, suspicious activities

### Management Features
- **User Management**: View, suspend, verify users
- **Game Configuration**: RTPs, limits, enable/disable
- **Bonus Management**: Create, modify, track bonuses
- **Withdrawal Approval**: Review and approve requests
- **Seed Rotation**: Manual seed rotation for security

## 🔧 Development

### Available Commands

```bash
# Development
make dev              # Start development environment
make build           # Build all applications
make test            # Run all tests
make lint            # Run linters

# Database
make db-migrate      # Run migrations
make db-seed         # Seed sample data
make db-reset        # Reset database (⚠️ destroys data)
make db-studio       # Open Prisma Studio

# Docker
make docker-up       # Start services
make docker-down     # Stop services
make docker-reset    # Reset with fresh volumes

# Monitoring
make logs-api        # API logs
make logs-web        # Web logs
make logs-db         # Database logs
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:cov

# Watch mode
pnpm test:watch
```

### Database Migrations

```bash
# Create new migration
pnpm --filter=@crypto-casino/api prisma migrate dev --name migration_name

# Deploy migrations
pnpm --filter=@crypto-casino/api prisma migrate deploy

# Reset database
pnpm --filter=@crypto-casino/api prisma migrate reset
```

## 🌐 API Documentation

### Authentication
All protected endpoints require a Bearer token:
```bash
Authorization: Bearer <jwt_token>
```

### Key Endpoints

**Authentication:**
- `POST /auth/magic-link` - Send magic link
- `GET /auth/callback` - Verify magic link
- `POST /auth/wallet/nonce` - Get wallet nonce
- `POST /auth/wallet/verify` - Verify wallet signature

**Gaming:**
- `POST /games/dice/play` - Play dice
- `POST /games/coinflip/play` - Play coinflip
- `POST /games/slots/play` - Play slots
- `GET /games/stats` - User game stats

**Payments:**
- `POST /payments/deposits` - Create deposit
- `POST /payments/withdrawals` - Request withdrawal
- `GET /payments/deposits` - Get deposit history

**Admin:**
- `GET /admin/dashboard` - Dashboard stats
- `GET /admin/users` - User management
- `POST /admin/bonus` - Create bonus

Full API documentation available at: http://localhost:3001/api/docs

## 🚢 Deployment

### Production Checklist

**Security:**
- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Configure proper CORS origins
- [ ] Set up proper firewall rules
- [ ] Enable rate limiting

**Database:**
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Set up read replicas (if needed)
- [ ] Monitor database performance

**Infrastructure:**
- [ ] Set up monitoring and alerting
- [ ] Configure log aggregation
- [ ] Set up backup strategies
- [ ] Plan disaster recovery

**Compliance:**
- [ ] Obtain necessary gaming licenses
- [ ] Implement required KYC/AML procedures
- [ ] Set up compliance reporting
- [ ] Configure responsible gaming controls

### Environment Variables

Production environment requires:
```bash
# Security
NODE_ENV=production
JWT_SECRET=<secure-32-char-secret>
ENCRYPTION_KEY=<secure-32-char-key>

# Database
DATABASE_URL=<production-postgres-url>

# External Services
COINBASE_COMMERCE_API_KEY=<api-key>
SUMSUB_APP_TOKEN=<kyc-provider-token>

# Monitoring
PROMETHEUS_ENABLED=true
LOG_LEVEL=info
LOG_FORMAT=json
```

## 📜 Legal & Compliance

### Disclaimer
This is an educational/demonstration project. Operating a real-money gambling platform requires:

- **Gaming Licenses**: Proper jurisdiction licensing
- **AML Compliance**: Anti-money laundering procedures  
- **Responsible Gaming**: Player protection measures
- **Financial Regulations**: Payment processing compliance
- **Data Protection**: GDPR/CCPA compliance
- **Tax Obligations**: Revenue and player winnings reporting

### Responsible Gaming Notice
This platform includes responsible gaming features:
- Configurable deposit and loss limits
- Session time controls  
- Self-exclusion options
- Reality check reminders
- Problem gambling resources

### Data Protection
- All PII is encrypted at rest
- Audit logs track data access
- Players can request data export/deletion
- Secure document storage for KYC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `pnpm test`
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier configuration
- Conventional commits required
- 80%+ test coverage target

## 📞 Support

### Getting Help
- **Documentation**: Check this README and API docs
- **Issues**: Open GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions

### Monitoring
- **Health Check**: `GET /health`
- **Metrics**: `GET /metrics` (Prometheus format)
- **Logs**: Structured JSON logging with correlation IDs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS**: Powerful Node.js framework
- **Prisma**: Next-generation ORM
- **Next.js**: React production framework  
- **shadcn/ui**: Beautiful UI components
- **Prometheus**: Monitoring and alerting toolkit

---

**⚠️ Important**: This is a demonstration project. Always ensure proper licensing, compliance, and security measures before deploying any gambling platform in production.