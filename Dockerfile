# Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build the app
# Environment variables will be passed at build time
RUN npm run build

# Production stage
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
# Other environment variables will be set at runtime

CMD ["serve", "-s", "dist", "-l", "8080"]

EXPOSE 8080