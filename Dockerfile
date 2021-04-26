## Stage 1 (base)
FROM node:15.5.1-alpine3.12 as base

RUN adduser node root
RUN mkdir /app
WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development
# ENV NODE_ENV=production

RUN npm install -g @nestjs/cli
# RUN npm install --only=production 

RUN npm install && npm cache clean --force

EXPOSE 3333

