FROM node:20-slim AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate

FROM base AS deps
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN npx prisma generate
RUN pnpm run build

FROM base AS production
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/package.json
COPY apps/api/prisma ./apps/api/prisma

RUN cd /app/apps/api && npx prisma generate

WORKDIR /app/apps/api
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

COPY apps/api/docker-entrypoint.sh /app/apps/api/docker-entrypoint.sh
ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]
