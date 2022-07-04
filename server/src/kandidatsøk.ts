import { RequestHandler } from 'express';

export const leggTilAuthorizationForKandidatsøkEs =
    (brukernavn: string, passord: string): RequestHandler =>
    (_, req, next) => {
        const encodedAuth = Buffer.from(`${brukernavn}:${passord}`).toString('base64');
        req.setHeader('Authorization', `Basic ${encodedAuth}`);

        next();
    };
