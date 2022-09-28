import { expect, test, jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import { harTilgangTilKandidatsøk } from './kandidatsøk';
import * as microsoftGraphApi from './microsoftGraphApi';
import * as middlewares from './middlewares';
import * as azureAd from './azureAd';

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
    });

    test('En bruker med ModiaGenerellTilgang skal få tilgang til kandidatsøket', async () => {
        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue([
            microsoftGraphApi.AdGruppe.ModiaGenerellTilgang,
        ]);

        await harTilgangTilKandidatsøk(
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

        await harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalled();
    });

    test('En bruker med andre tilganger skal ikke få tilgang til kandidatsøket', async () => {
        const andreTilganger = ['en-annen-tilgang' as microsoftGraphApi.AdGruppe];

        jest.spyOn(azureAd, 'hentNavIdent').mockReturnValue('A123456');
        jest.spyOn(microsoftGraphApi, 'hentBrukerensAdGrupper').mockResolvedValue(andreTilganger);

        await harTilgangTilKandidatsøk(
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

        await harTilgangTilKandidatsøk(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toBeCalledTimes(0);
        expect(mockResponse.status).toBeCalledWith(403);
    });
});
