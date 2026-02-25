# --- FASE 1: Construcción ---
# Usamos Node.js para empaquetar Vite/React
FROM node:18-alpine AS build
WORKDIR /app
# Instalar librerías de package.json
COPY package*.json ./
RUN npm install
# Compilar código TypeScript/JSX a JS estático puro
COPY . .
RUN npm run build

# --- FASE 2: Producción ---
# Usamos Nginx, un servidor web rapidísimo y ligero
FROM nginx:alpine
# Tomamos la carpeta 'dist' y la ponemos en el servidor web
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]