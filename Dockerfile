# Install dependencies
FROM node:18-slim AS deps

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

# Build source code
FROM node:18-slim AS builder
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn db:generate
RUN yarn build

# Production runtime
FROM node:18-slim AS runner
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD yarn prod

# Development runtime
FROM node:18-slim AS dev
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY nodemon.json ./nodemon.json
COPY tsconfig.json ./tsconfig.json
COPY . .

CMD yarn dev