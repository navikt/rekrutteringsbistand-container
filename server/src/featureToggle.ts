import { Request, RequestHandler } from 'express';
import { hentNavIdent } from './azureAd';
import { retrieveToken } from './middlewares';
import { logger } from './logger';

const autoriserteBrukereForKandidatmatch = (
    process.env.KANDIDATMATCH_AUTORISERTE_BRUKERE || ''
).split(',');

export const validerAtBrukerErAutorisertForKandidatmatch: RequestHandler = (req, res, next) => {
    const { autorisert, navIdent } = erAutorisertForKandidatmatch(req);
    logger.info(`req.url i validerAtbruker...: ${req.url}`);

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
    logger.info(`req.url i erAutorisertForKandidatmatch: ${req.url}`);

    return {
        autorisert: autoriserteBrukereForKandidatmatch.includes(navIdent),
        navIdent,
    };
};
