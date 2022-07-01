import path from 'path';
import express from 'express';
import compression from 'compression';
import winston from 'winston';

import { initializeAzureAd } from './azureAd';
import {
    opprettCookieFraAuthorizationHeader,
    redirectIfUnauthorized,
    respondUnauthorizedIfUnauthorized,
} from './middlewares';
import {
    responderOmBrukerErAutorisertForKandidatmatch,
    validerAtBrukerErAutorisertForKandidatmatch,
} from './featureToggle';
import { proxyTilKandidatsøkEs, proxyMedOboToken } from './proxy';

export const app = express();
const port = process.env.PORT || 8080;

export const logger = winston.createLogger({
    format: winston.format.json(),
    transports: new winston.transports.Console(),
});

const buildPath = path.join(__dirname, '../build');

const cluster = process.env.NAIS_CLUSTER_NAME;
const clusterOnPrem = cluster === 'prod-gcp' ? 'prod-fss' : 'dev-fss';

const scopes = {
    statistikk: `api://${clusterOnPrem}.toi.rekrutteringsbistand-statistikk-api/.default`,
    stillingssøk: `api://${cluster}.toi.rekrutteringsbistand-stillingssok-proxy/.default`,
    stilling: `api://${cluster}.toi.rekrutteringsbistand-stilling-api/.default`,
    kandidat: `api://${clusterOnPrem}.toi.rekrutteringsbistand-kandidat-api/.default`,
    sms: `api://${clusterOnPrem}.toi.rekrutteringsbistand-sms/.default`,
    forespørselOmDelingAvCv: `api://${clusterOnPrem}.arbeidsgiver-inkludering.foresporsel-om-deling-av-cv-api/.default`,
    synlighetsmotor: `api://${cluster}.toi.toi-synlighetsmotor/.default`,
    kandidatmatch: `api://${cluster}.team-ai.team-ai-match/.default`,
};

const {
    STILLING_API_URL,
    STATISTIKK_API_URL,
    STILLINGSSOK_PROXY_URL,
    KANDIDAT_API_URL,
    SMS_API,
    FORESPORSEL_OM_DELING_AV_CV_API,
    SYNLIGHETSMOTOR_API,
    KANDIDATMATCH_API,
    KANDIDATSOK_ES_URL,

    // TODO: Bruk de faktiske miljøvariablene fra Nais
    KANDIDATSOK_ES_USERNAME,
    KANDIDATSOK_ES_PASSWORD,
} = process.env;

const startServer = () => {
    app.use(compression());
    app.get([`/internal/isAlive`, `/internal/isReady`], (_, res) => res.sendStatus(200));

    const pathsForServingApp = ['/', '/*'];

    app.use('/static/js', express.static(`${buildPath}/static/js`));
    app.use('/static/css', express.static(`${buildPath}/static/css`));

    app.get(
        '/feature-toggle/kandidatmatch',
        respondUnauthorizedIfUnauthorized,
        responderOmBrukerErAutorisertForKandidatmatch
    );

    proxyMedOboToken('/statistikk-api', STATISTIKK_API_URL, scopes.statistikk);
    proxyMedOboToken('/stillingssok-proxy', STILLINGSSOK_PROXY_URL, scopes.stillingssøk);
    proxyMedOboToken('/stilling-api', STILLING_API_URL, scopes.stilling);
    proxyMedOboToken('/kandidat-api', KANDIDAT_API_URL, scopes.kandidat);
    proxyMedOboToken('/sms-api', SMS_API, scopes.sms);
    proxyMedOboToken(
        '/foresporsel-om-deling-av-cv-api',
        FORESPORSEL_OM_DELING_AV_CV_API,
        scopes.forespørselOmDelingAvCv
    );
    proxyMedOboToken('/synlighet-api', SYNLIGHETSMOTOR_API, scopes.synlighetsmotor);
    proxyMedOboToken(
        '/kandidatmatch-api',
        KANDIDATMATCH_API,
        scopes.kandidatmatch,
        validerAtBrukerErAutorisertForKandidatmatch
    );

    proxyTilKandidatsøkEs(
        '/kandidatsok-es',
        KANDIDATSOK_ES_URL,
        KANDIDATSOK_ES_USERNAME,
        KANDIDATSOK_ES_PASSWORD
    );

    app.get(
        pathsForServingApp,
        redirectIfUnauthorized,
        opprettCookieFraAuthorizationHeader,
        (_, res) => {
            res.sendFile(`${buildPath}/index.html`);
        }
    );

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
