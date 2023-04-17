import { createProxyMiddleware } from 'http-proxy-middleware';
import { respondUnauthorizedIfNotLoggedIn, tomMiddleware, setOnBehalfOfToken } from './middlewares';
import {
    harTilgangTilKandidatsøk,
    leggTilAuthorizationForKandidatsøkEs,
    loggSøkPåFnrEllerAktørId,
} from './kandidatsøk/kandidatsøk';
import { app } from './server';
import { RequestHandler } from 'express';

// Krever ekstra miljøvariabler, se nais.yaml
export const setupProxy = (fraPath: string, tilTarget: string): RequestHandler =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        pathRewrite: (path) => path.replace(fraPath, ''),
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
        leggTilAuthorizationForKandidatsøkEs(brukernavn, passord),
        loggSøkPåFnrEllerAktørId,
        setupProxy(path, proxyUrl + '/veilederkandidat_current/_search')
    );
};
