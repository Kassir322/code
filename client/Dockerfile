# Dockerfile for production mode

#
# ---------------------------------------------------------
#
FROM node:20-alpine AS base

ENV CLIENT_DIR=/home/frontend

#
# ---------------------------------------------------------
#
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR $CLIENT_DIR

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN npm ci

#
# ---------------------------------------------------------
#
FROM base AS builder

WORKDIR $CLIENT_DIR

ENV NEXT_PUBLIC_SKIP_BUILD_STATIC_GENERATION=true

COPY --from=deps $CLIENT_DIR/node_modules ./node_modules
COPY . .

RUN npm run build

#
# ---------------------------------------------------------
#
FROM base AS runner

WORKDIR $CLIENT_DIR

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs $CLIENT_DIR/public ./public
COPY --from=builder --chown=nextjs:nodejs $CLIENT_DIR/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs $CLIENT_DIR/.next ./.next
COPY --from=builder --chown=nextjs:nodejs $CLIENT_DIR/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
