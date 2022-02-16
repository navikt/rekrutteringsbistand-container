import { createRemoteJWKSet, jwtVerify } from 'jose';
import { FlattenedJWSInput, GetKeyFunction, JWSHeaderParameters } from 'jose/dist/types/types';
import { Issuer, Client } from 'openid-client';

const discoveryUrl = process.env.AZURE_APP_WELL_KNOWN_URL;
const clientId = process.env.AZURE_APP_CLIENT_ID;

let azureAdIssuer: Issuer<Client>;
let remoteJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

export const initializeAzureAd = async () => {
    await discoverAzureAdIssuer();
    opprettRemoteJWKSet();
};

export const discoverAzureAdIssuer = async () => {
    if (discoveryUrl) {
        azureAdIssuer = await Issuer.discover(discoveryUrl);
    } else {
        throw new Error(`Miljøvariabelen "AZURE_APP_WELL_KNOWN_URL" må være definert`);
    }
};

export const opprettRemoteJWKSet = () => {
    const jwksUrl = new URL(process.env.AZURE_OPENID_CONFIG_JWKS_URI);
    remoteJWKSet = createRemoteJWKSet(jwksUrl);
};

export const tokenIsValid = async (token: string) => {
    console.log('Validerer token');

    try {
        const verification = await jwtVerify(token, remoteJWKSet, {
            issuer: azureAdIssuer.metadata.issuer,
        });

        const payload = verification.payload;
        console.log('Fikk verifisert token:', verification);

        // TODO: Mer verifisering av payload?
        return payload.aud === clientId;
    } catch (e) {
        console.error('Noe galt skjedde under validering av token', e);
        return false;
    }
};
