
# Base image with Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Install a simple http server to serve the app
RUN npm install -g serve

# Set the command to run when the container starts
CMD ["serve", "-s", "dist", "-l", "8080"]

# Expose port 8080
EXPOSE 8080
