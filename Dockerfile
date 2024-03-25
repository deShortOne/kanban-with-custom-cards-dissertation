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

FROM base AS deploy
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/package*.json .
COPY --from=build /app/public ./public

COPY next.config.js .

COPY --from=build /app/.next/ ./.next/

COPY middleware.tsx .
COPY prisma prisma
COPY .env.example .env.example

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "docker-start"]

