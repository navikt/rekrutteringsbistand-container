const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 8080;
const buildPath = path.join(__dirname, '../build');

const startServer = () => {
    app.get([`/container/internal/isAlive`, `/container/internal/isReady`], (_, res) =>
        res.sendStatus(200)
    );

    app.use('/static/js', express.static(`${buildPath}/static/js`));
    app.use('/static/css', express.static(`${buildPath}/static/css`));

    app.get(['/', '/*'], (_, res) => {
        res.sendFile(`${buildPath}/index.html`);
    });

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

startServer();
