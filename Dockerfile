FROM navikt/node-express:16

WORKDIR /var

COPY dist/ dist/
COPY server/build server/
copy server/node_modules  server/node_modules

WORKDIR /var/server

EXPOSE 8080
ENTRYPOINT ["node", "server.js"]
