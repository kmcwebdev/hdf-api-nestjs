
FROM node:14.17.3-alpine3.12

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

CMD ["node", "dist/src/main"]