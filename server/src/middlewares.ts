import { NextFunction, Request, RequestHandler, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { tokenIsValid } from './azureAd';
import { hentOnBehalfOfToken } from './onBehalfOfToken';

export const cluster = process.env.NAIS_CLUSTER_NAME;

export const redirectIfUnauthorized: RequestHandler = async (req, res, next) => {
    if (await userIsLoggedIn(req)) {
        next();
    } else {
        res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
    }
};

export const respondUnauthorizedIfUnauthorized: RequestHandler = async (req, res, next) => {
    if (await userIsLoggedIn(req)) {
        next();
    } else {
        res.status(401).send('Brukeren har ingen gyldig sesjon');
    }
};

export const opprettCookieFraAuthorizationHeader: RequestHandler = (req, res, next) => {
    const token = retrieveToken(req.headers);

    if (token) {
        // Alltid sett domene til "intern.nav.no", dette fungerer også i dev
        // fordi "intern.nav.no" er en substring av "dev.intern.nav.no"
        const cookieDomain = cluster === 'prod-gcp' ? 'intern.nav.no' : 'intern.nav.no';

        res.header(
            'Set-Cookie',
            `isso-idtoken=${token}; Domain=${cookieDomain}; Path=/; Secure; HttpOnly; SameSite=Lax;`
        );

        next();
    } else {
        res.status(500).send('Klarte ikke å opprette isso-idtoken-cookie');
    }
};

export const setOnBehalfOfToken =
    (scope: string) => async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = retrieveToken(req.headers);

        if (!accessToken) {
            res.status(500).send('Kan ikke be om OBO-token siden access-token ikke finnes');
        } else {
            try {
                const token = await hentOnBehalfOfToken(accessToken, scope);
                req.headers.authorization = `Bearer ${token.access_token}`;
                next();
            } catch (e) {
                res.status(500).send('Feil ved henting av OBO-token: ' + e);
            }
        }
    };

export function retrieveToken(headers: IncomingHttpHeaders) {
    return headers.authorization?.replace('Bearer ', '');
}

async function userIsLoggedIn(req: Request): Promise<boolean> {
    const token = retrieveToken(req.headers);
    return token && (await tokenIsValid(token));
}

export const tomMiddleware: RequestHandler = (_, __, next) => {
    next();
};
