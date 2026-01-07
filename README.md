# MailStudio

MailStudio is a modern, comprehensive email design and management platform. Built as a monorepo, it combines a powerful Next.js frontend with a robust Express.js backend to deliver real-time email editing capabilities using MJML and AI-powered content generation.

## Project Structure

This project uses [Turbo](https://turbo.build/) for monorepo management and includes the following workspaces:

### Applications

- **apps/web**: The frontend application built with [Next.js 16](https://nextjs.org/). It features a rich UI for email composition, utilizing React 19, Zustand for state management, and React Query for data fetching.
- **apps/api**: The backend server built with [Express.js](https://expressjs.com/). It handles business logic, provides real-time updates via WebSockets, and integrates with Google GenAI for intelligent features.

### Packages

- **packages/database**: Database schema and connection configuration using [Drizzle ORM](https://orm.drizzle.team/) and PostgreSQL.
- **packages/ui**: A shared UI component library.
- **packages/shared**: Shared utilities and types used across the application.
- **packages/eslint-config**: Shared ESLint configurations.
- **packages/typescript-config**: Shared TypeScript configurations.

## Requirements

Before starting, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (install via `npm install -g pnpm`)
- **PostgreSQL**: A running PostgreSQL database instance

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mailstudio
```

### 2. Install Dependencies

Install all dependencies for the monorepo using pnpm:

```bash
pnpm install
```

### 3. Environment Configuration

You need to configure environment variables for the database and API.

**Database:**

1. Navigate to `packages/database`.
2. Create or update the `.env` file.
3. Add your database connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mailstudio"
   ```

**API:**

1. Navigate to `apps/api`.
2. Create or update the `.env` file.
3. Configure necessary variables (e.g., Google GenAI keys, Database URL if needed directly, Port, etc.).

### 4. Database Setup

Initialize the database schema using Drizzle Kit:

```bash
# From the root directory
pnpm --filter @repo/db drizzle:push
```

### 5. Run the Application

Start the development servers for all applications:

```bash
pnpm dev
```

This command will start:

- The **Web** application (usually at `http://localhost:3000`)
- The **API** server (usually at `http://localhost:3001` or similar, check logs)

## Development Commands

- **`pnpm build`**: Build all applications and packages.
- **`pnpm lint`**: Run linting across the monorepo.
- **`pnpm check-types`**: Run TypeScript type checking.
- **`pnpm format`**: Format code using Prettier.

## Technologies Used

- **Frontend**: Next.js 16, React 19, Tailwind CSS, MJML, Zustand, React Query
- **Backend**: Express.js, WebSockets (ws), Google GenAI SDK
- **Database**: PostgreSQL, Drizzle ORM
- **Monorepo Tooling**: Turbo, pnpm
