# Project Overview

This document provides a comprehensive technical overview of the **MailStudio** project. It is designed to assist developers in understanding the architecture, technology stack, and key patterns used across the codebase.

## 1. Technology Stack

- **Monorepo Management**: Turbo Repo
- **Backend Runtime**: Node.js
- **API Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM (with Drizzle Kit for migrations)
- **Language**: TypeScript
- **AI Integration**: Google GenAI
- **Email Templating**: MJML
- **Real-time**: WebSockets (`ws`)

## 2. Project Structure

The project follows a monorepo structure:

- **`apps/api`**: The main backend service.
  - Handles HTTP requests, authentication, and business logic.
  - manages WebSocket connections.
- **`packages/database`**: Shared database module.
  - Contains the Drizzle ORM configuration, schema definitions, and database connection logic.
- **`packages/shared`**: Shared utilities and types used across applications.

## 3. Database Architecture

The project uses **Drizzle ORM** to interact with a **PostgreSQL** database.

- **Configuration**: Located in `packages/database/drizzle.config.ts`.
- **Schema**: Defined in `packages/database/src/schema/`.
  - **Key Tables**:
    - `users`: Stores user profile information, roles, and auth details.
    - `accounts`: Manages linked accounts.
    - `user-otps`: Handles one-time passwords.
    - `brand-kits`, `chats`, `chat-media`: Application-specific data.

## 4. Authentication & Security

The API implements a secure, cookie-based authentication mechanism using **Google OAuth**.

### Authentication Flow

1.  **Login**: Users authenticate via Google OAuth (`apps/api/src/controllers/auth/google-auth.ts`).
2.  **Session Creation**: Upon successful authentication, the server generates a JSON object containing the user's essential details (ID, email, role, etc.).
3.  **Cookie Storage**: This JSON object is serialized and stored in a secure HTTP-only cookie named `session`.

### Authorization Middleware

Access control is managed by the `checkAuthorization` middleware (`apps/api/src/middlewares/check-authorization.ts`).

- **Mechanism**:
  1.  Intercepts incoming requests.
  2.  Retrieves the `session` cookie.
  3.  Parses and validates the session data using **Zod** schemas.
  4.  **Context Embedding**: Embeds the validated user object into the request object (`req["user"]`). This allows downstream controllers to easily access the authenticated user's ID (`req["user"].id`) and other details.
- **Role-Based Access Control (RBAC)**:
  - The middleware accepts an array of allowed roles (e.g., `["admin"]`, `["user"]`, or `["all"]`).
  - It verifies if the authenticated user's role matches the required permissions before granting access.

### Example Usage

```typescript
// Route definition
router.get(
  "/protected-resource",
  checkAuthorization(["admin"]), // Only admins can access
  (req, res) => {
    const userId = req["user"].id; // User ID is readily available
    // ...
  },
);
```

## 5. API Features

- **AI Integration**: Utilizes `@google/genai` for AI-powered features (likely for email content generation or refinement).
- **Email Processing**: Uses `mjml` for responsive email template generation.
- **WebSockets**: Implements real-time features using the `ws` library (handlers located in `apps/api/dist/web-sockets`).
