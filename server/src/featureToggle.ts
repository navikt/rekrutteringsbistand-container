import { decodeJwt } from 'jose';
import { Middleware, retrieveToken } from './middlewares';
import { logger } from './server';

const autoriserteBrukereForKandidatmatch = (
    process.env.KANDIDATMATCH_AUTORISERTE_BRUKERE || ''
).split(',');

const navIdentClaim = 'NAVident';

export const featureToggleForKandidatmatch: Middleware = (req, res, next) => {
    // TODO: Tillat alle i cluster:dev-gcp
    const brukerensAccessToken = retrieveToken(req.headers);
    const claims = decodeJwt(brukerensAccessToken);
    const navIdent = String(claims[navIdentClaim]) || '';

    if (autoriserteBrukereForKandidatmatch.includes(navIdent)) {
        logger.info(`Bruker "${navIdent}" bruker kandidatmatch`);
        next();
    } else {
        res.status(403).send(`Bruker "${navIdent}" er ikke autorisert til å bruke kandidatmatch`);
    }
};
