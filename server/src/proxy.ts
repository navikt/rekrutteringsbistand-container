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

// Krever ekstra miljøvariabler, se nais.yaml
export const setupProxy = (fraPath: string, tilTarget: string) =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        onProxyReq: (request) => {
            const bearerTokenlength = request.getHeader('authorization')?.toString()?.length;
            const cookieNames = getCookieNames(request);

            logger.info(
                `Proxy request fra ${fraPath} til ${tilTarget}, Bearer token er på ${bearerTokenlength} tegn. Alle cookies:`,
                cookieNames
            );
        },
        pathRewrite: (path) => path.replace(fraPath, ''),
    });
