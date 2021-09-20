FROM node:14.17.5-alpine
WORKDIR /client
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
