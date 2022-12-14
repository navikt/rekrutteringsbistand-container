import { RequestHandler } from 'express';
import { hentNavIdent } from '../azureAd';
import { AdGruppe, hentBrukerensAdGrupper } from '../microsoftGraphApi';
import { retrieveToken } from '../middlewares';
import { logger } from '../logger';
import TilgangCache from './cache';

const adGrupperMedTilgangTilKandidatsøket = [
    AdGruppe.ModiaGenerellTilgang,
    AdGruppe.ModiaOppfølging,
].map((a) => a.toLowerCase());

export const cache = new TilgangCache();

const sjekkTilgang = async (
    accessToken: string
): Promise<{ harTilgang: boolean; brukerensAdGrupper: AdGruppe[] }> => {
    const brukerensAdGrupper = await hentBrukerensAdGrupper(accessToken);
    const harTilgang = brukerensAdGrupper.some((adGruppeBrukerErMedlemAv) =>
        adGrupperMedTilgangTilKandidatsøket.includes(adGruppeBrukerErMedlemAv.toLowerCase())
    );

    return {
        harTilgang,
        brukerensAdGrupper,
    };
};

export const harTilgangTilKandidatsøk: RequestHandler = async (request, response, next) => {
    const brukerensAccessToken = retrieveToken(request.headers);
    const navIdent = hentNavIdent(brukerensAccessToken);

    if (cache.hentTilgang(navIdent)) {
        logger.info(`Bruker ${navIdent} fikk tilgang til kandidatsøket, tilgang er cachet`);
        return next();
    }

    try {
        const { harTilgang } = await sjekkTilgang(brukerensAccessToken);
        const forklaring = `Kandidatsøket krever en av følgened AD-grupper: ${adGrupperMedTilgangTilKandidatsøket}, som brukeren ikke har.`;

        if (harTilgang) {
            logger.info(`Bruker ${navIdent} fikk tilgang til kandidatsøket.\n${forklaring}`);

            cache.lagreTilgang(navIdent);
            next();
        } else {
            logger.info(`Bruker ${navIdent} har ikke tilgang til kandidatsøket.\n${forklaring}`);

            response
                .status(403)
                .send(
                    'Du har ikke tilgang til kandidatsøket fordi det krever én av følgende AD-grupper: ' +
                        adGrupperMedTilgangTilKandidatsøket
                );
        }
    } catch (e) {
        const feilmelding = 'Klarte ikke å sjekke brukerens tilgang til kandidatsøket:';
        logger.error(feilmelding + ': ' + e);
        response.status(500).send(feilmelding);
    }
};

export const leggTilAuthorizationForKandidatsøkEs =
    (brukernavn: string, passord: string): RequestHandler =>
    (request, _, next) => {
        const encodedAuth = Buffer.from(`${brukernavn}:${passord}`).toString('base64');
        request.headers.authorization = `Basic ${encodedAuth}`;

        next();
    };
