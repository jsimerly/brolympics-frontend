# Use Node.js 18 Alpine as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Declare build arguments
ARG VITE_API_URL
ARG VITE_FRONTEND_URL
ARG VITE_FB_API_KEY
ARG VITE_FB_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_MEASUREMENT_ID

# Set environment variables
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL
ENV VITE_FB_API_KEY=$VITE_FB_API_KEY
ENV VITE_FB_AUTH_DOMAIN=$VITE_FB_AUTH_DOMAIN
ENV VITE_PROJECT_ID=$VITE_PROJECT_ID
ENV VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET
ENV VITE_MESSAGING_SENDER_ID=$VITE_MESSAGING_SENDER_ID
ENV VITE_MEASUREMENT_ID=$VITE_MEASUREMENT_ID

# Echo the environment variables for debugging
RUN echo "VITE_API_URL: $VITE_API_URL"
RUN echo "VITE_FRONTEND_URL: $VITE_FRONTEND_URL"
RUN echo "VITE_FB_API_KEY: $VITE_FB_API_KEY"
RUN echo "VITE_FB_AUTH_DOMAIN: $VITE_FB_AUTH_DOMAIN"
RUN echo "VITE_PROJECT_ID: $VITE_PROJECT_ID"
RUN echo "VITE_STORAGE_BUCKET: $VITE_STORAGE_BUCKET"
RUN echo "VITE_MESSAGING_SENDER_ID: $VITE_MESSAGING_SENDER_ID"
RUN echo "VITE_MEASUREMENT_ID: $VITE_MEASUREMENT_ID"

# Build the application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["serve", "-s", "dist", "-l", "8080"]