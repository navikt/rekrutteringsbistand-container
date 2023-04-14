import { expect, test, jest, describe, beforeEach } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import * as kandidatsøk from '../src/kandidatsøk/kandidatsøk';
import * as microsoftGraphApi from '../src/microsoftGraphApi';
import * as middlewares from '../src/middlewares';
import * as azureAd from '../src/azureAd';
import { SearchQuery } from '../src/kandidatsøk/elasticSearchTyper';
import { logger, loggSpesifisertKandidatsøkTilAuditLog } from '../src/logger';

describe('Tilgangskontroll for kandidatsøket', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
        } as Partial<Response>;

        mockRequest = {
            headers: {
                authorization: '',
            },
        };

        nextFunction = jest.fn();
        kandidatsøk.cache.clear();
    });

    test('En bruker med ModiaGenerellTilgang skal få tilgang til kandidatsøket', async () => {
        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue([
            kandidatsøk.AD_GRUPPE_MODIA_GENERELL_TILGANG!,
        ]);

        await kandidatsøk.harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalled();
    });

    test('En bruker med ModiaOppfølging skal få tilgang til kandidatsøket', async () => {
        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue([
            kandidatsøk.AD_GRUPPE_MODIA_OPPFOLGING!,
        ]);

        await kandidatsøk.harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalled();
    });

    test('En bruker der tilgang er cachet skal få tilgang til kandidatsøket', async () => {
        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue([
            kandidatsøk.AD_GRUPPE_MODIA_OPPFOLGING!,
        ]);

        await kandidatsøk.harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockRejectedValue(
            'Prøvde å hente brukerens AD-grupper når tilgang skal være cachet'
        );

        await kandidatsøk.harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalledTimes(2);
    });

    test('En bruker med andre tilganger skal ikke få tilgang til kandidatsøket', async () => {
        const andreTilganger = ['en-annen-tilgang'];

        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue(andreTilganger);

        await kandidatsøk.harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalledTimes(0);
        expect(mockResponse.status).toBeCalledWith(403);
    });

    test('En bruker uten noen tilganger skal ikke få tilgang til kandidatsøket', async () => {
        jest.spyOn(middlewares, 'retrieveToken').mockReturnValue('');
        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue([]);

        await kandidatsøk.harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalledTimes(0);
        expect(mockResponse.status).toBeCalledWith(403);
    });
});

describe('ES body for søk', () => {
    let queryMock = (bool?: object): SearchQuery => {
        return {
            query: {
                bool: {
                    must: [
                        {
                            bool: bool,
                        },
                    ],
                },
            },
        };
    };

    test('Er ES body med søk på fødselsnummer og aktørId', () => {
        const resultat = kandidatsøk.hentFnrEllerAktørIdFraESBody(
            queryMock({
                should: [
                    {
                        term: {
                            aktorId: '21909899211',
                        },
                    },
                    {
                        term: {
                            fodselsnummer: '21909899211',
                        },
                    },
                ],
            })
        );
        expect(resultat).toBeTruthy();
    });

    test('Er ES body med søk på fødselsnummer', () => {
        const resultat = kandidatsøk.hentFnrEllerAktørIdFraESBody(
            queryMock({
                should: [
                    {
                        term: {
                            fodselsnummer: '21909899211',
                        },
                    },
                ],
            })
        );
        expect(resultat).toBeTruthy();
    });

    test('Er ES body med søk på aktørId', () => {
        const resultat = kandidatsøk.hentFnrEllerAktørIdFraESBody(
            queryMock({
                should: [
                    {
                        term: {
                            aktorId: '21909899211',
                        },
                    },
                ],
            })
        );
        expect(resultat).toBeTruthy();
    });

    test('Er ES body uten søk på fødselsnummer eller aktørId', () => {
        const resultat = kandidatsøk.hentFnrEllerAktørIdFraESBody(queryMock());
        expect(resultat).toBeFalsy();
    });

    test('Henter fnr fra ES body når det finnes', () => {
        const resultat = kandidatsøk.hentFnrEllerAktørIdFraESBody(
            queryMock({
                should: [
                    {
                        term: {
                            aktorId: '21909899211',
                        },
                    },
                    {
                        term: {
                            fodselsnummer: '10108000398',
                        },
                    },
                ],
            })
        );
        loggSpesifisertKandidatsøkTilAuditLog('1010', '22');
        logger.info('logger noe her');
        expect(resultat).toBe('10108000398');
    });

    test('Henter aktørid fra ES body når fnr ikke finnes', () => {
        const resultat = kandidatsøk.hentFnrEllerAktørIdFraESBody(
            queryMock({
                should: [
                    {
                        term: {
                            aktorId: '21909899211',
                        },
                    },
                ],
            })
        );
        expect(resultat).toBe('21909899211');
    });
});
