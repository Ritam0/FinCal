FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests first for build caching
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Expose the port your server listens on (adjust if not 5000)
EXPOSE 3001

# Run the backend
CMD ["npm", "start"]