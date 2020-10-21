FROM navikt/node-express:14-alpine

WORKDIR /app

COPY build/ build/
COPY server/ server/

EXPOSE 8080
ENTRYPOINT ["node", "server/server.js"]