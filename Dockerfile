# node-sass 4.14.1 requires node version <= 14 for Alpine Linux
# See: https://github.com/sass/node-sass/releases/tag/v4.14.1
FROM node:16-alpine as build-deps
WORKDIR /usr/src/app
RUN pwd && ls
COPY yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

COPY public/ ./public/
COPY src/ ./src/

EXPOSE 3000
CMD yarn run start
