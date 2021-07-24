FROM node:14.15.4-alpine as builder

RUN apk add --no-cache \
    build-base \
    gcc \
    g++ \
    make

WORKDIR /usr/src/app
COPY "tsconfig.json" "package.json" "package-lock.json" "./"
RUN npm ci --production
RUN npm i typescript
COPY . "./"
RUN npm run build

FROM node as app

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app "./"
RUN npm prune --production

CMD ["node", "dist/main.js"]
