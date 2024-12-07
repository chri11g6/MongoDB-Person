FROM node:20-alpine3.20 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:20-alpine3.20 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
RUN npm install --only=production
COPY --from=ts-compiler /usr/app/build ./
USER 1000
CMD ["server.js"]