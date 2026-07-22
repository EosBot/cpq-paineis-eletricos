FROM node:20-slim
WORKDIR /app

RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --frozen-lockfile

COPY apps/web ./apps/web
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3001
ENV NEXTAUTH_URL=http://localhost

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

CMD ["node_modules/.bin/next", "start", "-p", "3001"]
