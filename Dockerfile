# Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]