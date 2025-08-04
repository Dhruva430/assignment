# Use Node.js base image
FROM node:20

# Create app directory
WORKDIR /app

# Install PNPM globally
RUN npm install -g pnpm

# Copy only what's needed first for faster rebuilds
COPY package.json pnpm-lock.yaml ./

# Install deps
RUN pnpm install

# Copy everything else
COPY . .

# Build the project
RUN pnpm run build

# Expose app port
EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["pnpm","exec", "prisma","generate","&&","pnpm", "run", "start:dev"]
