FROM navikt/node-express:14-alpine

WORKDIR /var

COPY build/ build/
COPY server/build server/

WORKDIR /var/server

EXPOSE 8080
ENTRYPOINT ["node", "server.js"]
