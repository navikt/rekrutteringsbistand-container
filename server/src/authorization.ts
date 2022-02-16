import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { tokenIsValid } from './azureAd';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const cluster = process.env.NAIS_CLUSTER_NAME;

const retrieveToken = (headers: IncomingHttpHeaders) =>
    headers.authorization?.replace('Bearer ', '');

const userIsLoggedIn = async (req: Request): Promise<boolean> => {
    const token = retrieveToken(req.headers);
    console.log('Authorization header er definert:', !!token);

    return token && (await tokenIsValid(token));
};

export const ensureLoggedIn: Middleware = async (req, res, next) => {
    if (await userIsLoggedIn(req)) {
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
