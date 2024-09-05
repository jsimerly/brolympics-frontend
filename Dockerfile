# Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Run stage
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

CMD ["serve", "-s", "dist", "-l", "8080"]
EXPOSE 8080