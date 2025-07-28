# Base image
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed for install & postinstall
COPY package*.json ./
COPY prisma ./prisma          
RUN npm ci --omit=dev

# Copy the rest
COPY . .

# Expose port
EXPOSE 3000

CMD ["node", "src/server.js"]
