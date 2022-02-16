import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const cluster = process.env.NAIS_CLUSTER_NAME;

const retrieveToken = (headers: IncomingHttpHeaders) =>
    headers.authorization?.replace('Bearer ', '');

const tokenIsValid = (token: string) => {
    return true;
};

const userIsLoggedIn = (req: Request) => {
    const token = retrieveToken(req.headers);
    console.log('Authorization header er definert:', !!token);

    return token && tokenIsValid(token);
};

export const ensureLoggedIn: Middleware = (req, res, next) => {
    if (userIsLoggedIn(req)) {
        next();
    } else {
        res.redirect(`/oauth2/login?redirect=${req.originalUrl}`);
    }
};

export const opprettCookieFraAuthorizationHeader: Middleware = (req, res, next) => {
    const token = retrieveToken(req.headers);

    if (token) {
        const cookieDomain = cluster === 'prod-gcp' ? 'intern.nav.no' : 'dev.intern.nav.no';

        res.header(
            'Set-Cookie',
            `isso-idtoken=${token}; Domain=${cookieDomain}; Secure; HttpOnly; SameSite=Lax;`
        );

        next();
    } else {
        res.status(500).send('Klarte ikke å opprette isso-idtoken-cookie');
    }
};
