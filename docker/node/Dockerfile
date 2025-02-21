# Use Node.js 22 LTS Alpine as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /var/www/app

# Copy package.json and package-lock.json for efficient dependency caching
COPY package*.json ./

# Install dependencies in production mode
RUN npm i

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port (default: 3000)
EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]
