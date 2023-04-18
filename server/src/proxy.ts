import { createProxyMiddleware } from 'http-proxy-middleware';
import { respondUnauthorizedIfNotLoggedIn, tomMiddleware, setOnBehalfOfToken } from './middlewares';
import {
    harTilgangTilKandidatsøk,
    leggTilAuthorizationForKandidatsøkEs,
    loggSøkPåFnrEllerAktørId,
} from './kandidatsøk/kandidatsøk';
import { app } from './server';
import express, { RequestHandler } from 'express';
import { logger } from './logger';

// Krever ekstra miljøvariabler, se nais.yaml
export const setupProxy = (fraPath: string, tilTarget: string): RequestHandler =>
    createProxyMiddleware({
        target: tilTarget,
        pathFilter: fraPath,
        changeOrigin: true,
        secure: true,
        pathRewrite: (path) => path.replace(fraPath, ''),
        logger,
    });

export const proxyMedOboToken = (
    path: string,
    apiUrl: string,
    apiScope: string,
    customMiddleware?: RequestHandler
) => {
    app.use(
        path,
        respondUnauthorizedIfNotLoggedIn,
        customMiddleware ? customMiddleware : tomMiddleware,
        setOnBehalfOfToken(apiScope),
        setupProxy(path, apiUrl)
    );
};

export const proxyTilKandidatsøkEs = (
    path: string,
    proxyUrl: string,
    brukernavn: string,
    passord: string
) => {
    app.use(
        path,
        respondUnauthorizedIfNotLoggedIn,
        harTilgangTilKandidatsøk,
        express.json(),
        loggSøkPåFnrEllerAktørId,
        leggTilAuthorizationForKandidatsøkEs(brukernavn, passord),
        setupProxy(path, proxyUrl + '/veilederkandidat_current/_search')
    );
};
