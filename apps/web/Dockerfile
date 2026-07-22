FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV NEXTAUTH_URL=http://localhost

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY apps/web/package.json ./package.json
COPY apps/web/next.config.js ./next.config.js

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

CMD ["sh", "-c", "find /app/node_modules/.pnpm -path '*/next/dist/bin/next' -type f 2>/dev/null | head -1 | xargs -I{} {} start -p 3001"]
