# Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build arguments
ARG VITE_API_URL
ARG VITE_FRONTEND_URL
ARG VITE_FB_API_KEY
ARG VITE_FB_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID
ARG VITE_MEASUREMENT_ID

# Create .env file
RUN echo "VITE_API_URL=$VITE_API_URL" >> .env && \
    echo "VITE_FRONTEND_URL=$VITE_FRONTEND_URL" >> .env && \
    echo "VITE_FB_API_KEY=$VITE_FB_API_KEY" >> .env && \
    echo "VITE_FB_AUTH_DOMAIN=$VITE_FB_AUTH_DOMAIN" >> .env && \
    echo "VITE_PROJECT_ID=$VITE_PROJECT_ID" >> .env && \
    echo "VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET" >> .env && \
    echo "VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID" >> .env && \
    echo "VITE_APP_ID=$VITE_APP_ID" >> .env && \
    echo "VITE_MEASUREMENT_ID=$VITE_MEASUREMENT_ID" >> .env

# Build the app
RUN npm run build
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "8080"]

EXPOSE 8080