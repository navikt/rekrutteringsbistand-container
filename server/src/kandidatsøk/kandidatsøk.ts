import { RequestHandler } from 'express';
import { hentNavIdent } from '../azureAd';
import { hentBrukerensAdGrupper } from '../microsoftGraphApi';
import { retrieveToken } from '../middlewares';
import { auditLog, logger, opprettLoggmeldingForAuditlogg } from '../logger';
import { SearchQuery } from './elasticSearchTyper';
import TilgangCache from './cache';

export const { AD_GRUPPE_MODIA_GENERELL_TILGANG, AD_GRUPPE_MODIA_OPPFOLGING } = process.env;

export const adGrupperMedTilgangTilKandidatsøket = [
    AD_GRUPPE_MODIA_GENERELL_TILGANG,
    AD_GRUPPE_MODIA_OPPFOLGING,
];

export const cache = new TilgangCache();

const sjekkTilgang = async (
    accessToken: string
): Promise<{ harTilgang: boolean; brukerensAdGrupper: string[] }> => {
    const brukerensAdGrupper = await hentBrukerensAdGrupper(accessToken);
    const harTilgang = brukerensAdGrupper.some((adGruppeBrukerErMedlemAv) =>
        adGrupperMedTilgangTilKandidatsøket.includes(adGruppeBrukerErMedlemAv)
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
        const forklaring = `Kandidatsøket krever medlemskap i en av følgende AD-grupper: ${adGrupperMedTilgangTilKandidatsøket}.`;

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

export const loggSøkPåFnrEllerAktørId: RequestHandler = async (request, _, next) => {
    if (request.body) {
        try {
            const fnrEllerAktørId = hentFnrEllerAktørIdFraESBody(request.body);

            if (fnrEllerAktørId) {
                const brukerensAccessToken = retrieveToken(request.headers);
                const navIdent = hentNavIdent(brukerensAccessToken);

                const melding = opprettLoggmeldingForAuditlogg(
                    'NAV-ansatt har gjort spesifikt kandidatsøk på brukeren',
                    fnrEllerAktørId,
                    navIdent
                );

                auditLog.info(melding);
            }
        } catch (e) {
            logger.error('Klarte ikke å logge søk på fnr eller aktørId:', e);
        }
    }

    next();
};

export const hentFnrEllerAktørIdFraESBody = (request: SearchQuery): string | null => {
    let fnrEllerAktørId = null;

    request.query?.bool?.must?.forEach((mustQuery) =>
        mustQuery.bool?.should?.forEach((shouldQuery) => {
            if (shouldQuery.term?.fodselsnummer || shouldQuery.term?.aktorId) {
                fnrEllerAktørId = shouldQuery.term?.fodselsnummer || shouldQuery.term?.aktorId;
            }
        })
    );

    return fnrEllerAktørId;
};
