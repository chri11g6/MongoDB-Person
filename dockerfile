FROM node:14.15

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY . .

ENTRYPOINT ["node", "server.js"]