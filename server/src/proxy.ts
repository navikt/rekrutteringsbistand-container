import { ClientRequest } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from './server';

const getCookieNames = (request: ClientRequest) => {
    const requestCookies = request.getHeader('Cookie')?.toString();

    if (requestCookies) {
        const cookies = requestCookies.split('; ');
        return cookies.map((cookie) => cookie.split('=')[0]);
    } else {
        return [];
    }
};

const removeIssoIdToken = (request: ClientRequest) => {
    const requestCookies = request.getHeader('Cookie')?.toString();

    if (requestCookies) {
        return requestCookies
            .split('; ')
            .filter((cookie) => cookie.split('=')[0] !== 'isso-idtoken')
            .join('; ');
    } else {
        return '';
    }
};

// Krever ekstra miljøvariabler, se nais.yaml
export const setupProxy = (fraPath: string, tilTarget: string, fjernCookies = true) =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        onProxyReq: (request) => {
            if (fjernCookies) {
                request.setHeader('Cookie', removeIssoIdToken(request));
            }

            const bearerTokenlength = request.getHeader('authorization')?.toString()?.length;
            const cookieNames = getCookieNames(request);

            logger.info(
                `Proxy request fra ${fraPath} til ${tilTarget}, Bearer token er på ${bearerTokenlength} tegn. Alle cookies:`,
                cookieNames
            );
        },
        pathRewrite: (path) => path.replace(fraPath, ''),
    });
