# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build Next.js app
RUN npm run build

# Set environment variable to production
ENV NODE_ENV=production

# Expose the port (customize if needed)
EXPOSE 3100

# Start the production server
CMD ["npm", "run", "start", "--", "-p", "3100"]
