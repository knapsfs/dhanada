FROM node:22-alpine AS build

WORKDIR /app

COPY frontend/knaps/package*.json ./
RUN npm ci

COPY frontend/knaps/ ./

RUN npm run build

FROM nginx:alpine

COPY --from=build /dhanada/public/knaps /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
