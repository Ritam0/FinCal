FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./


RUN npm install

# Copy source code
COPY . .

# Vite default port
EXPOSE 3000

RUN ls -l

# --host flag allows requests from outside the container
CMD ["npm", "run", "dev", "--", "--host"]