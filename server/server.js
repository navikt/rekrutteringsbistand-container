const path = require('path');
const express = require('express');
const jws = require('jws');
const app = express();

const port = process.env.PORT || 8080;
const loginserviceUrl = process.env.LOGINSERVICE_URL;

const buildPath = path.join(__dirname, '../build');

const startServer = () => {
    app.get([`/container/internal/isAlive`, `/container/internal/isReady`], (_, res) =>
        res.sendStatus(200)
    );

    const pathsForServingApp = ['/', '/*'];

    app.use('/static/js', express.static(`${buildPath}/static/js`));
    app.use('/static/css', express.static(`${buildPath}/static/css`));

    app.get(pathsForServingApp, ensureLoggedIn, (_, res) => {
        res.sendFile(`${buildPath}/index.html`);
    });

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

const hentLoginTokenFraCookies = (cookies) => {
    if (cookies !== undefined) {
        const erLoginCookie = (cookie) => typeof cookie === 'string' && cookie.includes('-idtoken');
        const loginCookie = cookies.split(';').find(erLoginCookie);

        if (loginCookie) {
            return loginCookie.split('=').pop().trim();
        }
    }

    return undefined;
};

const tokenErUtløpt = (token) => {
    let expiration = jws.decode(token).payload.exp;
    if (expiration.toString().length === 10) {
        expiration = expiration * 1000;
    }

    return expiration - Date.now() < 0;
};

const ensureLoggedIn = (req, res, next) => {
    const loginToken = hentLoginTokenFraCookies(req.headers.cookie);
    if (loginToken === undefined || tokenErUtløpt(loginToken)) {
        const hostname = req.get('host');
        const redirectUrl = `${loginserviceUrl}?redirect=https://${hostname}`;
        return res.redirect(redirectUrl);
    }

    return next();
};

startServer();
