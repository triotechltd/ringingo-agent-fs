# -------------------------
# 1. BUILD STAGE
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy all source code
COPY . .

# Build Next.js (Outputs .next/)
RUN npm run build

# -------------------------
# 2. PRODUCTION STAGE
# -------------------------
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Only copy what the app needs to run
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Install only production deps
RUN npm install --production --force

EXPOSE 3100

# Start Next.js on port 3100
CMD ["npm", "start", "--", "-p", "3100"]
