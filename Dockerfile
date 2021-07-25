FROM node:14.17.3-alpine3.12 AS development

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install

RUN yarn install --only=development

COPY . .

RUN npm run build

FROM node:14.17.3-alpine3.12 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/src/main"]