import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { respondUnauthorizedIfNotLoggedIn, tomMiddleware, setOnBehalfOfToken } from './middlewares';
import {
    harTilgangTilKandidatsøk,
    leggTilAuthorizationForKandidatsøkEs,
} from './kandidatsøk/kandidatsøk';
import { app } from './server';
import { RequestHandler } from 'express';
import { logger } from './logger';

// Krever ekstra miljøvariabler, se nais.yaml
export const setupProxy = (fraPath: string, tilTarget: string): RequestHandler =>
    createProxyMiddleware({
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        on: {
            proxyReq: fixRequestBody,
        },
        pathRewrite: (path) => {
            console.log(
                `Proxyer kall fra ${fraPath} til target ${tilTarget}. Requesten sendes til ${path.replace(
                    fraPath,
                    ''
                )}`
            );
            return path.replace(fraPath, '');
        },
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
        // loggSøkPåFnrEllerAktørId,
        leggTilAuthorizationForKandidatsøkEs(brukernavn, passord),
        setupProxy(path, proxyUrl + '/veilederkandidat_current/_search')
    );
};
