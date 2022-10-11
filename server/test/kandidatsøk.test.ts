import { expect, test, jest, describe, beforeEach } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import * as kandidatsøk from '../src/kandidatsøk/kandidatsøk';
import * as microsoftGraphApi from '../src/microsoftGraphApi';
import * as middlewares from '../src/middlewares';
import * as azureAd from '../src/azureAd';

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
            microsoftGraphApi.AdGruppe.ModiaGenerellTilgang,
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
            microsoftGraphApi.AdGruppe.ModiaOppfølging,
        ]);

        await kandidatsøk.harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalled();
    });

    test('En bruker med ModiaOppfølging i uppercase skal få tilgang til kandidatsøket', async () => {
        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue([
            microsoftGraphApi.AdGruppe.ModiaOppfølging.toUpperCase() as microsoftGraphApi.AdGruppe,
        ]);

        await kandidatsøk.harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalled();
    });

    test('En bruker med ModiaOppfølging i lowercase skal få tilgang til kandidatsøket', async () => {
        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue([
            microsoftGraphApi.AdGruppe.ModiaOppfølging.toUpperCase() as microsoftGraphApi.AdGruppe,
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
            microsoftGraphApi.AdGruppe.ModiaOppfølging,
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
        const andreTilganger = ['en-annen-tilgang' as microsoftGraphApi.AdGruppe];

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
