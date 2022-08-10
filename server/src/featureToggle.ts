import { Request, RequestHandler } from 'express';
import { hentNavIdent } from './azureAd';
import { retrieveToken } from './middlewares';
import { logger } from './server';

const autoriserteBrukereForKandidatmatch = (
    process.env.KANDIDATMATCH_AUTORISERTE_BRUKERE || ''
).split(',');

export const validerAtBrukerErAutorisertForKandidatmatch: RequestHandler = (req, res, next) => {
    const { autorisert, navIdent } = erAutorisertForKandidatmatch(req);

    if (autorisert) {
        logger.info(`Bruker "${navIdent}" bruker kandidatmatch`);
        next();
    } else {
        res.status(403).send(`Bruker "${navIdent}" er ikke autorisert til å bruke kandidatmatch`);
    }
};

export const responderOmBrukerErAutorisertForKandidatmatch: RequestHandler = (req, res) => {
    res.status(200).json(erAutorisertForKandidatmatch(req).autorisert);
};

const erAutorisertForKandidatmatch = (
    req: Request
): {
    autorisert: boolean;
    navIdent: string;
} => {
    const brukerensAccessToken = retrieveToken(req.headers);
    const navIdent = hentNavIdent(brukerensAccessToken);

    return {
        autorisert: autoriserteBrukereForKandidatmatch.includes(navIdent),
        navIdent,
    };
};
