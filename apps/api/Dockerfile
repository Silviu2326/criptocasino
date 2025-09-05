FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build packages
RUN pnpm --filter=@crypto-casino/types build
RUN pnpm --filter=@crypto-casino/config build

# Generate Prisma client
RUN pnpm --filter=@crypto-casino/api prisma generate

# Build API
RUN pnpm --filter=@crypto-casino/api build

# Production stage
FROM node:18-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY apps/api/package.json ./apps/api/

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base /app/packages/types/dist ./packages/types/dist
COPY --from=base /app/packages/config/dist ./packages/config/dist
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

CMD ["pnpm", "--filter=@crypto-casino/api", "start:prod"]