FROM node:16-alpine as builder

RUN apk add --no-cache python2 make g++

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . /app/

EXPOSE 80

CMD ["quasar build -m pwa && quasar serve ./dist/pwa -p 80"]
