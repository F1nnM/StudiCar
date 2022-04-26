FROM node:16-slim

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "index.js" ]