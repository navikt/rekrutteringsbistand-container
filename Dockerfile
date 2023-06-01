FROM navikt/node-express:16

# For å logge riktig timestamp til archsight trenger vi å inkludere dette
USER root
RUN apk add --no-cache tzdata
ENV TZ=CET
USER apprunner
#

WORKDIR /var

COPY dist/ dist/
COPY server/build server/
copy server/node_modules  server/node_modules

WORKDIR /var/server

EXPOSE 8080
ENTRYPOINT ["node", "server.js"]
