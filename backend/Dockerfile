# Use Node.js LTS image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy resten af appens kode ind i containeren
COPY . .

# Build TypeScript til JavaScript
RUN npm run build

# Expose port 5002
EXPOSE 5002

# Define miljøvariabler (kan også sættes via docker-compose.yml)
ENV NODE_ENV=production

# Start backend-serveren, sørg for at serveren lytter på port 5002
CMD ["node", "dist/app.js"]
