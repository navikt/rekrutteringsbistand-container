FROM navikt/node-express:14-alpine

WORKDIR /app

COPY build/ build/
COPY server/ server/

WORKDIR /app/server
RUN npm ci

EXPOSE 8080
ENTRYPOINT ["node", "server.js"]