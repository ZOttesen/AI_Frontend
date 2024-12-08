# Use the Node.js image to build the app
FROM node:20 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Set environment variables
ARG REACT_APP_AUTH_URL
ARG REACT_APP_BACKEND_URL

ENV REACT_APP_AUTH_URL=$REACT_APP_AUTH_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Copy resten af appen
COPY . .

# Build React-appen
RUN npm run build

# Use Nginx to serve the built files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the server
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
