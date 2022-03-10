import { ClientRequest } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from './server';

const getCookieNames = (request: ClientRequest) => {
    const requestCookies = request.getHeader('Cookie');

    return typeof requestCookies === 'string'
        ? requestCookies.split('; ').map((cookie) => cookie.split('=')[0])
        : [];
};

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
export const setupProxy = (fraPath: string, tilTarget: string, fjernIssoIdToken = true) =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        pathRewrite: (path) => path.replace(fraPath, ''),
        onProxyReq: (request) => {
            if (fjernIssoIdToken) {
                request.setHeader('Cookie', removeIssoIdToken(request));
            }

            const bearerTokenlength = request.getHeader('authorization')?.toString()?.length;
            const cookieNames = getCookieNames(request);
            logger.info(
                `Proxy request fra ${fraPath} til ${tilTarget}, Bearer token er på ${bearerTokenlength} tegn. Alle cookies: ${cookieNames}`
            );
        },
        logProvider: () => logger,
    });
