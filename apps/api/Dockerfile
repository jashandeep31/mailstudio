FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install turbo --global

WORKDIR /app


FROM base AS builder
COPY . .
RUN rm -rf apps/web
RUN rm -rf packages/ui
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN npm run build 

# removing the source files
RUN  rm -rf apps/api/src
RUN  rm -rf packages/database/src
RUN  rm -rf packages/shared/src
RUN find . -type d -name "src" -exec rm -rf {} +

FROM node:20-slim AS runner
RUN corepack enable
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
CMD ["npm" , "start"]
