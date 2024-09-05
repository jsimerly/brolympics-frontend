FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Build arguments
ARG VITE_API_URL
ARG VITE_OTHER_VAR

# Create .env file
RUN echo "VITE_API_URL=$VITE_API_URL" >> .env
RUN echo "VITE_OTHER_VAR=$VITE_OTHER_VAR" >> .env


RUN npm run build

# Run stage
FROM node:18-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "8080"]
EXPOSE 8080