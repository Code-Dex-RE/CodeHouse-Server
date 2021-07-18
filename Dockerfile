## Stage 1 (base)
FROM node:14.15.1 as base

RUN adduser node root

RUN apt-get update && apt-get install -y sudo

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development
# ENV NODE_ENV=production
RUN sudo npm i -g npm@6.14.10
RUN npm install -g @nestjs/cli
# RUN npm install --only=production 

RUN npm install && npm cache clean --force

EXPOSE 3333