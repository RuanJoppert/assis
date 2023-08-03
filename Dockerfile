FROM node:18.17-slim AS base
WORKDIR /app
COPY package.json      ./
COPY package-lock.json ./
RUN apt-get update && apt-get -y install procps curl
RUN npm install

FROM base as development
ENV NODE_ENV=development
WORKDIR /app
COPY . .