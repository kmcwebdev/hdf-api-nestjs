
FROM node:14.17.3-alpine3.12

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

COPY --from=development /app/dist ./dist

CMD ["node", "dist/src/main"]