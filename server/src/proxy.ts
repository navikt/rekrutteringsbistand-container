import { legacyCreateProxyMiddleware } from 'http-proxy-middleware';
import { respondUnauthorizedIfNotLoggedIn, tomMiddleware, setOnBehalfOfToken } from './middlewares';
import {
    harTilgangTilKandidatsøk,
    leggTilAuthorizationForKandidatsøkEs,
    loggSøkPåFnrEllerAktørId,
} from './kandidatsøk/kandidatsøk';
import { app } from './server';
import { RequestHandler } from 'express';
import { logger } from './logger';

// Krever ekstra miljøvariabler, se nais.yaml
export const setupProxy = (fraPath: string, tilTarget: string): RequestHandler =>
    legacyCreateProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        pathRewrite: (path) => {
            console.log(
                'Proxy:' +
                    JSON.stringify({
                        path,
                        fraPath,
                        tilTarget,
                        replacetPath: path.replace(fraPath, ''),
                    })
            );
            return path.replace(fraPath, '');
        },
        logProvider: () => logger,
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
        loggSøkPåFnrEllerAktørId,
        leggTilAuthorizationForKandidatsøkEs(brukernavn, passord),
        setupProxy(path, proxyUrl + '/veilederkandidat_current/_search')
    );
};
