import { ClientRequest } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { respondUnauthorizedIfNotLoggedIn, tomMiddleware, setOnBehalfOfToken } from './middlewares';
import { leggTilAuthorizationForKandidatsøkEs } from './kandidatsøk';
import { app, logger } from './server';
import { RequestHandler } from 'express';

const removeIssoIdToken = (request: ClientRequest) => {
    const requestCookies = request.getHeader('Cookie')?.toString();

    return typeof requestCookies === 'string'
        ? requestCookies
              .split('; ')
              .filter((cookie) => cookie.split('=')[0] !== 'isso-idtoken')
              .join('; ')
        : '';
};

// Krever ekstra miljøvariabler, se nais.yaml
export const setupProxy = (
    fraPath: string,
    tilTarget: string,
    fjernIssoIdToken = true
): RequestHandler =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        pathRewrite: (path) => path.replace(fraPath, ''),
        onProxyReq: (request) => {
            if (fjernIssoIdToken) {
                request.setHeader('Cookie', removeIssoIdToken(request));
            }
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
        leggTilAuthorizationForKandidatsøkEs(brukernavn, passord),
        setupProxy(path, proxyUrl)
    );
};
