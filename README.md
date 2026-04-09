# MailStudio

A modern email design and management platform. Monorepo with Next.js frontend and Express.js backend, featuring MJML email editing and AI-powered content generation.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Zustand, React Query
- **Backend**: Express.js, WebSockets, Google GenAI SDK
- **Database**: PostgreSQL, Drizzle ORM
- **Tools**: Turbo, pnpm

## Quick Start

```bash
# Clone and install
git clone <repo-url> && cd mailstudio
pnpm install

# Configure environment
cp packages/database/.env.example packages/database/.env
cp apps/api/.env.example apps/api/.env
# Edit both .env files with your database URL and API keys

# Setup database and run
pnpm --filter @repo/db drizzle:push
pnpm dev
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Run linting |
| `pnpm check-types` | TypeScript type checking |
| `pnpm format` | Format code with Prettier |
