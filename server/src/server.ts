import path from 'path';
import express from 'express';
import winston from 'winston';

import { initializeAzureAd } from './azureAd';
import {
    ensureLoggedIn,
    opprettCookieFraAuthorizationHeader,
    setOnBehalfOfToken,
} from './middlewares';
import { setupProxy } from './proxy';

const app = express();
const port = process.env.PORT || 8080;

export const logger = winston.createLogger({
    format: winston.format.json(),
    transports: new winston.transports.Console(),
});

const buildPath = path.join(__dirname, '../build');

const cluster = process.env.NAIS_CLUSTER_NAME;
const clusterOnPrem = cluster === 'prod-gcp' ? 'prod-fss' : 'dev-fss';

const scopes = {
    statistikk: `api://${clusterOnPrem}.arbeidsgiver.rekrutteringsbistand-statistikk-api/.default`,
    stillingssøk: `api://${cluster}.toi.rekrutteringsbistand-stillingssok-proxy/.default`,
    stilling: `api://${clusterOnPrem}.arbeidsgiver.rekrutteringsbistand-stilling-api/.default`,
    kandidat: `api://${clusterOnPrem}.toi.rekrutteringsbistand-kandidat-api/.default`,
    sms: `api://${clusterOnPrem}.toi.rekrutteringsbistand-sms/.default`,
    finnKandidatApi: `api://${clusterOnPrem}.arbeidsgiver.finn-kandidat-api/.default`,
    forespørselOmDelingAvCv: `api://${clusterOnPrem}.arbeidsgiver-inkludering.foresporsel-om-deling-av-cv-api/.default`,
    synlighetsmotor: `api://${cluster}.toi.toi-synlighetsmotor/.default`,
};

const proxyWithAuth = (path: string, apiUrl: string, apiScope: string) => {
    app.use(path, ensureLoggedIn, setOnBehalfOfToken(apiScope), setupProxy(path, apiUrl));
};

const {
    STILLING_API_URL,
    STATISTIKK_API_URL,
    STILLINGSSOK_PROXY_URL,
    KANDIDAT_API_URL,
    SMS_API,
    FINN_KANDIDAT_API,
    FORESPORSEL_OM_DELING_AV_CV_API,
    SYNLIGHETSMOTOR_API
} = process.env;

const startServer = () => {
    app.get([`/internal/isAlive`, `/internal/isReady`], (_, res) => res.sendStatus(200));

    const pathsForServingApp = ['/', '/*'];

    app.use('/static/js', express.static(`${buildPath}/static/js`));
    app.use('/static/css', express.static(`${buildPath}/static/css`));

    proxyWithAuth('/statistikk-api', STATISTIKK_API_URL, scopes.statistikk);
    proxyWithAuth('/stillingssok-proxy', STILLINGSSOK_PROXY_URL, scopes.stillingssøk);
    proxyWithAuth('/stilling-api', STILLING_API_URL, scopes.stilling);
    proxyWithAuth('/kandidat-api', KANDIDAT_API_URL, scopes.kandidat);
    proxyWithAuth('/sms-api', SMS_API, scopes.sms);
    proxyWithAuth('/finn-kandidat-api', FINN_KANDIDAT_API, scopes.finnKandidatApi);
    proxyWithAuth(
        '/foresporsel-om-deling-av-cv-api',
        FORESPORSEL_OM_DELING_AV_CV_API,
        scopes.forespørselOmDelingAvCv
    );
    proxyWithAuth('/toi-synlighetsmotor', SYNLIGHETSMOTOR_API, scopes.synlighetsmotor);

    app.get(pathsForServingApp, ensureLoggedIn, opprettCookieFraAuthorizationHeader, (_, res) => {
        res.sendFile(`${buildPath}/index.html`);
    });

    app.listen(port, () => {
        logger.info('Server kjører på port', port);
    });
};

const initializeServer = async () => {
    try {
        await initializeAzureAd();
        startServer();
    } catch (e) {
        logger.error(`Klarte ikke å starte server: ${e}`);
    }
};

initializeServer();
