FROM node:16.13-alpine
WORKDIR /exposeDomainOverInternet
COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY . .
