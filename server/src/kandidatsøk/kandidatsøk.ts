import { RequestHandler } from 'express';
import { hentNavIdent } from '../azureAd';
import { hentBrukerensAdGrupper } from '../microsoftGraphApi';
import { retrieveToken } from '../middlewares';
import { logger, spesifisertKandidatsøkCEFLoggformat, secureLog } from '../logger';
import TilgangCache from './cache';
import { SearchQuery } from './elasticSearchTyper';

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

export const loggSøkPåFnrEllerAktørId: RequestHandler = async (request, response, next) => {
    logger.info('er inni middleware loggSøkPåFnrEllerAktørId');
    secureLog.info(`requst: ${simpleStringify(request)}`);
    secureLog.info(`request query: ${JSON.stringify(request.query)}`);
    secureLog.info(`request body: ${simpleStringify(request.body)}`);
    secureLog.info(`response: ${simpleStringify(response)}`);
    secureLog.info(`response json: ${simpleStringify(response.json)}`);
    const fnrEllerAktørId = await hentFnrEllerAktørIdFraESBody(request.body);

    if (fnrEllerAktørId) {
        const brukerensAccessToken = retrieveToken(request.headers);
        const navIdent = hentNavIdent(brukerensAccessToken);
        const msg = spesifisertKandidatsøkCEFLoggformat(fnrEllerAktørId, navIdent);
        //auditLog.info(msg);
        secureLog.info(msg);
    }

    logger.info('skal gå videre fra loggSøkPåFnrEllerAktørId');

    next();
};

export const simpleStringify = (object) => {
    // stringify an object, avoiding circular structures
    // https://stackoverflow.com/a/31557814
    var simpleObject = {};
    for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        if (typeof object[prop] == 'object') {
            continue;
        }
        if (typeof object[prop] == 'function') {
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};

export const hentFnrEllerAktørIdFraESBody = (query: SearchQuery): Promise<string | null> => {
    let fnrEllerAktørId = null;

    secureLog.info(`query inni hentFnrEllerAktørIdFraEsBody: ${query}`);

    query.query.bool?.must?.forEach((must) =>
        must.bool?.should?.forEach((should) => {
            if (should.term.fodselsnummer || should.term.aktorId) {
                fnrEllerAktørId = should.term.fodselsnummer || should.term.aktorId;
            }
        })
    );

    return fnrEllerAktørId;
};
