FROM node:16-alpine as builder

RUN apk add --no-cache python2 make g++

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

FROM node:alpine as app

RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules

COPY . /app/

ENTRYPOINT [ "npm", "run"]
CMD "dev"