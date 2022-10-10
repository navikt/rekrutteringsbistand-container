import { RequestHandler } from 'express';
import { hentNavIdent } from './azureAd';
import { AdGruppe, hentBrukerensAdGrupper } from './microsoftGraphApi';
import { retrieveToken } from './middlewares';
import { logger } from './logger';

const adGrupperMedTilgangTilKandidatsøket = [
    AdGruppe.ModiaGenerellTilgang,
    AdGruppe.ModiaOppfølging,
].map((a) => a.toLowerCase());

type NavIdent = string;
type TilgangCache = Record<
    NavIdent,
    {
        utløper: Date;
    }
>;

export let navIdenterMedTilgang: TilgangCache = {};

export const harTilgangTilKandidatsøk: RequestHandler = async (request, response, next) => {
    const brukerensAccessToken = retrieveToken(request.headers);
    const navIdent = hentNavIdent(brukerensAccessToken);

    const cachetTilgang = navIdenterMedTilgang[navIdent];
    if (cachetTilgang && tilgangErFremdelesGyldig(cachetTilgang.utløper)) {
        logger.info(
            `Bruker ${navIdent} fikk tilgang til kandidatsøket, tilgang er cachet til ${cachetTilgang.utløper.toISOString()}`
        );

        return next();
    }

    try {
        const brukerensAdGrupper = await hentBrukerensAdGrupper(brukerensAccessToken);
        const harTilgang = brukerensAdGrupper.some((adGruppeBrukerErMedlemAv) =>
            adGrupperMedTilgangTilKandidatsøket.includes(adGruppeBrukerErMedlemAv.toLowerCase())
        );

        const forklaring = `Kandidatsøket krever en av følgened AD-grupper: ${adGrupperMedTilgangTilKandidatsøket}\nBrukeren har følgende AD-grupper: ${brukerensAdGrupper}`;

        if (harTilgang) {
            logger.info(`Bruker ${navIdent} fikk tilgang til kandidatsøket.\n${forklaring}`);

            lagreTilgangICache(navIdent);
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

const lagreTilgangICache = (navIdent: string) => {
    navIdenterMedTilgang[navIdent] = {
        utløper: new Date(Date.now() + 1000 * 60 * 60),
    };
};

const tilgangErFremdelesGyldig = (utløper: Date) => {
    return utløper >= new Date();
};

export const slettCache = () => {
    navIdenterMedTilgang = {};
};

export const leggTilAuthorizationForKandidatsøkEs =
    (brukernavn: string, passord: string): RequestHandler =>
    (request, _, next) => {
        const encodedAuth = Buffer.from(`${brukernavn}:${passord}`).toString('base64');
        request.headers.authorization = `Basic ${encodedAuth}`;

        next();
    };
