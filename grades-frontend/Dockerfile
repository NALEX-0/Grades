# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

# Serve with nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
