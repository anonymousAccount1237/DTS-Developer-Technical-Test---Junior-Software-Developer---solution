# frontend/Dockerfile

# --- Stage 1: The "Builder" ---
# Use a Node.js image to build our React app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the package files from our 'client' folder
COPY client/package.json client/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of our 'client' app's source code
COPY client/ .

#run the frontend tests once
RUN CI=true npm test

# Build the production version of our app
RUN npm run build

# --- Stage 2: The "Server" ---
# Use a tiny, fast Nginx server to serve the static files
FROM nginx:1.25-alpine

# Copy the final 'build' folder from the 'builder' stage
COPY --from=builder /app/build /usr/share/nginx/html

# Add a custom config file to make React Router work
COPY nginx.conf /etc/nginx/conf.d/default.conf