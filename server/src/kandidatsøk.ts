import { Middleware } from './middlewares';

export const leggTilAuthorizationForKandidatsøkEs =
    (brukernavn: string, passord: string): Middleware =>
    (_, req, next) => {
        const encodedAuth = Buffer.from(`${brukernavn}:${passord}`).toString('base64');
        req.setHeader('Authorization', `Basic ${encodedAuth}`);

        next();
    };
