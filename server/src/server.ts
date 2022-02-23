import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';

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
const fssCluster = cluster === 'prod-gcp' ? 'prod-fss' : 'dev-fss';

const scopes = {
    statistikk: `api://${fssCluster}.arbeidsgiver.rekrutteringsbistand-statistikk-api/.default`,
    stillingssøk: `api://${cluster}.arbeidsgiver.rekrutteringsbistand-stillingssok-proxy/.default`,
    stilling: `api://${fssCluster}.arbeidsgiver.rekrutteringsbistand-stilling-api/.default`,
    kandidat: `api://${fssCluster}.arbeidsgiver.rekrutteringsbistand-kandidat-api/.default`,
};

const proxyWithAuth = (path: string, apiUrl: string, apiScope: string) => {
    app.use(
        path,
        removeIssoIdToken,
        ensureLoggedIn,
        setOnBehalfOfToken(apiScope),
        setupProxy(path, apiUrl)
    );
};

const {
    STILLING_API_URL,
    STATISTIKK_API_URL,
    STILLINGSSOK_PROXY_URL,
    KANDIDAT_API_URL,
} = process.env;

const startServer = () => {
    app.use(cookieParser());

    app.get([`/internal/isAlive`, `/internal/isReady`], (_, res) => res.sendStatus(200));

    const pathsForServingApp = ['/', '/*'];

    app.use('/static/js', express.static(`${buildPath}/static/js`));
    app.use('/static/css', express.static(`${buildPath}/static/css`));

    proxyWithAuth('/statistikk-api', STATISTIKK_API_URL, scopes.statistikk);
    proxyWithAuth('/stillingssok-proxy', STILLINGSSOK_PROXY_URL, scopes.stillingssøk);
    proxyWithAuth('/stilling-api', STILLING_API_URL, scopes.stilling);
    proxyWithAuth('/kandidat-api', KANDIDAT_API_URL, scopes.kandidat);

    app.get(pathsForServingApp, ensureLoggedIn, opprettCookieFraAuthorizationHeader, (_, res) => {
        res.sendFile(`${buildPath}/index.html`);
    });

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

initializeAzureAd();

startServer();
