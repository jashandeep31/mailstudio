
# Base image
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install turbo --global
WORKDIR /app

# Prepare stage (prune monorepo for api)
FROM base AS prepare
RUN corepack enable
COPY . .
RUN turbo prune api --docker

# Builder stage (install deps + build)
FROM base AS builder
COPY --from=prepare /app/out/json/ .
RUN pnpm install
COPY --from=prepare /app/out/full/ .
RUN pnpm turbo build

# Runner stage (production container)
FROM base AS runner
COPY --from=builder /app/apps/api ./apps/api
CMD ["npm" , "start"]
# docker build -t test -f ./apps/api/Dockerfile .
