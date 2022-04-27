# Hvordan docker er setup {ignore=true}

[TOC]
## Docker-compose

```mermaid
flowchart LR
	db[(mongodb)]
	Web[nodejs]
	client[Client]

	subgraph Docker
		Web --> db
	end

	client --> Web
```

```yaml
version: '3'
services:
  nodejs:
    build: .

    depends_on:
      - mongodb

    environment:
      DB_HOST: mongodb
      DB_USER: ${MONGO_ROOT_USERNAME}
      DB_PASS: ${MONGO_ROOT_PASSWORD}
      DB_DATABASE: skoleDB

    ports:
      - '3000:3000'

  mongodb:
    image: mongo:5.0
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    ports:
      - 27017:27017
    volumes:
      - mongodb_data_container:/data/db

volumes:
  mongodb_data_container:
```

## Dockerfile

```dockerfile
FROM node:14-alpine3.10 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:14-alpine3.10 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
RUN npm install --only=production
COPY --from=ts-compiler /usr/app/build ./

FROM gcr.io/distroless/nodejs:14
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./
USER 1000
CMD ["server.js"]
```

### Hvordan virker det?
Jeg har sat det op i 3 processor

```mermaid
flowchart LR
	start([Start build docker image])
	compiler[ts-compiler]
	remover[ts-remover]
	final[Final]

	start --> compiler
	compiler --> remover
	remover --> final
```
Det er kun Final proces delen der bliver til et image. De 2 andre ts-compiler og ts-remover vil ikke komme med i image kun det der er bygget.

#### ts-compiler
I den her del compiler den typescript filerne. Den kopier `package.json` og `tsconfig.json` filer ind og installer de packet fra dependencies og dev-dependencies. Og der efter kopier den resten ind. Og compiler alle typescript filerne i en mappe der hedder Build.

> Hvorfor kopier man ikke det helle ind og der efter installer packet og compiler det?
>
> Man kunne godt gør det, men docker cache system[^docker-cache] fungere sådan at den cacher være linje den udfør af proces, så den ikke skal lave den samme proces igen og igen når du skal bygge det her image. Hvis der er lavet ændringer en eller flere filer der bliver kopier ind, så vil den ikke bruge cachen fra den linje hvor der kopier filer ind og nedad.
> Det vil sige at hvis jeg gjorde det med at kopier alt ind på en gang, så vil docker install packet igen og igen være gang man ændringer en eller flere filer der bliver kopier ind.
> Så den måde jeg har sat det op på er at den ikke skal install packet igen og igen være gang der bliver ændringer filer. Men kun hvis `package.json` eller `tsconfig.json` bliver ændringer på fx at der bliver install en ny packet.

[^docker-cache]: [https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#leverage-build-cache](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#leverage-build-cache)

```dockerfile
FROM node:14-alpine3.10 as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build
```
#### ts-remover
I den her del henter den alt fra mappen Build og `package.json` i ts-compiler proces delen. Og installer kun de packet fra dependencies, så den bliver letter i image. Den vil ikke install dev-dependencies packet fordi det bliver kun bruget i build eller develop fasen.

```dockerfile
FROM node:14-alpine3.10 as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package*.json ./
RUN npm install --only=production
COPY --from=ts-compiler /usr/app/build ./
```
#### Final
I den her del henter den alt fra ts-remover proces delen og image is done.

> Jeg kunne have stoppe i ts-remover proces delen og udgive image der fra, men google har lavet et image[^google-images] der er mere letter i størrelsen.

[^google-images]: [https://github.com/GoogleContainerTools/distroless/tree/main/nodejs](https://github.com/GoogleContainerTools/distroless/tree/main/nodejs)

```dockerfile
FROM gcr.io/distroless/nodejs:14
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./
USER 1000
CMD ["server.js"]
```