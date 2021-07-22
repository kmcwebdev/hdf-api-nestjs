FROM node:14.17.3-alpine3.12 AS development

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --only=development

COPY . .

RUN yarn build

FROM node:14.17.3-alpine3.12 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]