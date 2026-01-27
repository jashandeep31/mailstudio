
# ---------- BASE ----------
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ---------- PRUNE MONOREPO ----------
FROM base AS prepare
COPY . .
RUN pnpm dlx turbo prune api --docker

# ---------- INSTALL + BUILD ----------
FROM base AS builder

COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=prepare /app/out/full/ .
RUN pnpm turbo build

# 🔥 Remove devDependencies AFTER build
RUN pnpm prune --prod

# ---------- RUNTIME ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./
RUN  rm -rf apps/api/src  packages/shared/src packages/database/src
WORKDIR /app/apps/api
CMD ["node", "dist/index.js"]
# docker build -t test -f ./apps/api/Dockerfile .
