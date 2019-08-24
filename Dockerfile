# From github.com/noahzemlin/roboto-ts : Thank you! :)
# (If there are any problems with me using this please let me know I can create a different one)

FROM node:10-alpine
WORKDIR /opt/hexa

COPY package.json .
COPY package-lock.json .
RUN apk add --no-cache bash git make gcc g++ python && \
  npm install --no-optional && \
  apk del bash git make gcc g++ python

COPY src src
COPY tsconfig.json .
RUN npm run build

CMD npm run start