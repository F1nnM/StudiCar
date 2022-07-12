FROM node:16 as builder
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . /app/

RUN npm run build

FROM httpd:2.4

COPY --from=builder /app/dist/pwa /usr/local/apache2/htdocs/
