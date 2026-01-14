# Project Overview

This document provides a comprehensive technical overview of the **MailStudio** project. It details the architecture, technology stack, and specific implementations for the database, UI, and authentication systems.

## 1. High-Level Architecture

The project is a **Monorepo** managed by **Turbo Repo**, organizing code into applications (`apps/`) and shared packages (`packages/`).

- **`apps/api`**: The backend REST and WebSocket API (Express.js).
- **`apps/web`**: The frontend application (Next.js 16).
- **`packages/database`**: Shared database schema and Drizzle ORM configuration.
- **`packages/ui`**: Shared UI component library (Shadcn UI + Tailwind CSS 4).
- **`packages/shared`**: Common utilities and types.

## 2. Technology Stack

| Category          | Technology   | Version / Details                   |
| :---------------- | :----------- | :---------------------------------- |
| **Runtime**       | Node.js      | v20+ (implied)                      |
| **Language**      | TypeScript   | v5.9+                               |
| **Backend**       | Express.js   | with generic routing and middleware |
| **Frontend**      | Next.js      | v16.1.0 (App Router)                |
| **Database**      | PostgreSQL   | Relational Database                 |
| **ORM**           | Drizzle ORM  | Type-safe SQL wrapper               |
| **UI Styling**    | Tailwind CSS | v4.x                                |
| **UI Lib**        | Shadcn UI    | Radix UI primitives                 |
| **State**         | Zustand      | Global client state                 |
| **Data Fetching** | React Query  | Server state management on client   |
| **AI**            | Google GenAI | For content generation              |
| **Email**         | MJML         | Responsive email templating         |

## 3. Database Architecture (`packages/database`)

The database layer is isolated in `packages/database` to allow type sharing across the monorepo.

- **Location**:
  - **Config**: `packages/database/drizzle.config.ts`
  - **Schema Definition**: `packages/database/src/schema/`
  - **Connection/Entry**: `packages/database/src/index.ts`
- **ORM**: Drizzle ORM is used for both schema definition and query execution.
- **Tables**:
  - **User & Auth**: `users`, `accounts`, `user-otps`, `plans`, `billings`.
  - **Core Logic**: `chats`, `chat-categories`, `chat-media`, `user-liked-chats`.
  - **Application Assets**: `brand-kits`, `upload-media`, `user-test-mails`.
  - **Finances**: `payments`, `credit-wallets`.

The frontend (`apps/web`) imports table definitions (e.g., `creditWalletsTable`) directly from `@repo/db` to infer TypeScript types (`$inferSelect`) for API responses, ensuring end-to-end type safety.

## 4. Frontend Architecture (`apps/web`)

The frontend is a modern **Next.js 16** application using the **App Router**.

- **UI Components**:
  - Built using a custom package **`@repo/ui`**.
  - Based on **Shadcn UI** (Radix UI primitives).
  - Styled with **Tailwind CSS 4**.
  - Icons provided by **Lucide React**.
- **State Management**:
  - **Zustand**: Used for global UI state.
  - **TanStack Query (React Query)**: Used for data fetching, caching, and server state synchronization.
- **API Integration**:
  - Services are located in `apps/web/services/`.
  - **Axios** is used for HTTP requests with `withCredentials: true` to ensure the authentication cookie is passed to the backend.

## 5. Authentication & Security

The system uses a **Cookie-based Session** strategy initiated via **Google OAuth**.

### A. The Setup

1.  **Backend**: `apps/api/dist/controllers/auth/google-auth.ts` handles the OAuth callback.
2.  **Frontend**: `apps/web/lib/get-session.ts` handles session retrieval in Server Components.

### B. The Authentication Flow

1.  **Login**: User authenticates via Google.
2.  **Session Generation**: The API creates a session object (User ID, Email, Name, Role).
3.  **Cookie Storage**:
    - The session object is serialized to JSON.
    - Stored in a secure, **HTTP-only cookie** named `session`.
    - No JWTs or database session lookups are required for basic request validation (stateless-like efficiency).

### C. Authorization (Backend)

Requests are protected by the `checkAuthorization` middleware (`apps/api/src/middlewares/check-authorization.ts`):

1.  **Intercepts** request.
2.  **Decrypts/Parses** the `session` cookie using **Zod** schema validation.
3.  **Injects** the user object into `req["user"]`.
4.  **Verifies Role**: Checks if the user's role matches the required roles (e.g., `["admin"]` or `["user"]`).

### D. Authorization (Frontend)

- **Server Side**: `getSession()` in `apps/web/lib/get-session.ts` reads the cookie directly using `next/headers`. This allows protecting routes or pre-fetching user data in Server Components.
- **Client Side**: API calls automatically include the cookie.

## 6. Key Directories & files

- **`apps/api/src/controllers`**: Business logic grouped by domain (auth, chats, payments).
- **`apps/api/src/web-sockets`**: Real-time communication handlers.
- **`apps/web/services`**: Frontend API client functions.
- **`packages/ui/src/components`**: Reusable UI components (buttons, dialogs, etc.).
