import path from 'path';
import express from 'express';
import { initializeAzureAd } from './azureAd';
import {
    ensureLoggedIn,
    opprettCookieFraAuthorizationHeader,
    removeIssoIdToken,
    setOnBehalfOfToken,
} from './middlewares';
import { setupProxy } from './proxy';

const app = express();
const port = process.env.PORT || 8080;

const buildPath = path.join(__dirname, '../build');

const cluster = process.env.NAIS_CLUSTER_NAME;
const fssMiljø = cluster === 'prod-gcp' ? 'prod-fss' : 'dev-fss';

const statistikkApiUrl = process.env.STATISTIKK_API_URL;
const statistikkApiScope = `api://${fssMiljø}.arbeidsgiver.rekrutteringsbistand-statistikk-api/.default`;

const startServer = () => {
    app.get([`/internal/isAlive`, `/internal/isReady`], (_, res) => res.sendStatus(200));

    const pathsForServingApp = ['/', '/*'];

    app.use('/static/js', express.static(`${buildPath}/static/js`));
    app.use('/static/css', express.static(`${buildPath}/static/css`));

    app.use(
        `/statistikk-api`,
        removeIssoIdToken,
        ensureLoggedIn,
        setOnBehalfOfToken(statistikkApiScope),
        setupProxy(`/statistikk-api`, statistikkApiUrl)
    );

    app.get(pathsForServingApp, ensureLoggedIn, opprettCookieFraAuthorizationHeader, (_, res) => {
        res.sendFile(`${buildPath}/index.html`);
    });

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

initializeAzureAd();

startServer();
