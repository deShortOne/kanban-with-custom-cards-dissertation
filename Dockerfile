FROM node:18 AS base

FROM base AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV PORT 3000

FROM base AS deploy
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/package*.json .
COPY --from=build /app/public ./public

COPY next.config.js .

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=nextjs:nodejs /app/.next/ ./.next/
# RUN chown nextjs:nodejs .next

COPY middleware.tsx .
COPY prisma prisma

EXPOSE 3000
ENV PORT 3000

# USER nextjs

CMD ["npm", "run", "docker-start"]

