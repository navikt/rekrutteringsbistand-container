import { decodeJwt } from 'jose';
import { Middleware, retrieveToken } from './middlewares';

const autoriserteBrukereForKandidatmatch = process.env.KANDIDATMATCH_AUTORISERTE_BRUKERE || [];

export const featureToggleForKandidatmatch: Middleware = (req, res, next) => {
    // TODO: Tillat alle i cluster:dev-gcp
    const brukerensAccessToken = retrieveToken(req.headers);
    const claims = decodeJwt(brukerensAccessToken);

    console.log('Access token:', featureToggleForKandidatmatch);
    console.log('Claims:', claims);

    const navIdent = 'A12345';

    if (autoriserteBrukereForKandidatmatch.includes(navIdent)) {
        next();
    } else {
        res.status(403).send('Brukeren er ikke autorisert til å bruke kandidatmatch');
    }
};
