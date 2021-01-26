FROM node:lts-alpine

WORKDIR /workspaces/onepiece

RUN set -ex
RUN apk add --no-cache --update curl

COPY common common
RUN npm i --only=prod --prefix common

COPY maestro maestro
RUN npm i --only=prod --prefix maestro

ENV NODE_ENV=production
ENV SERVICE_PORT=4000

CMD [ "npm", "start" ,"--prefix", "maestro"]
