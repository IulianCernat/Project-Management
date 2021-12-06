FROM node:14.17.5-alpine
WORKDIR /RealTimeUpdatesFeeder
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
