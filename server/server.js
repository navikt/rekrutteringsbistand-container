const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 8080;
const basePath = '/rekrutteringsbistand';
const buildPath = path.join(__dirname, '../build');

const startServer = () => {
    app.get([`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`], (_, res) =>
        res.sendStatus(200)
    );

    app.use(`${basePath}/static/js`, express.static(`${buildPath}/static/js`));
    app.use(`${basePath}/static/css`, express.static(`${buildPath}/static/css`));

    app.get([`${basePath}/`, `${basePath}/*`], (_, res) => {
        res.sendFile(`${buildPath}/index.html`);
    });

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

startServer();
