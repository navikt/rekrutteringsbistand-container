import fetch from 'node-fetch';

type OboToken = {
    access_token: string;
    expires_in: number;
    ext_expires_in: number;
    token_type: string;
};

type CachetOboToken = {
    token: OboToken;
    expires: number;
};

type Scope = string;
type AccessToken = string;

const tokenCache: Record<Scope, Record<AccessToken, CachetOboToken>> = {};

export async function hentOnBehalfOfToken(accessToken: string, scope: string) {
    console.log(`Kaller hentOnBehalfOfToken med accessToken ${accessToken} og scope ${scope}`);

    const cacheForScope = hentCacheForScope(scope);
    const cachetOboToken = cacheForScope[accessToken];

    console.log(
        `Sjekker hentOnBehalfOfToken med cachetOboToken ${cachetOboToken} og gyldighet ${tokenErFremdelesGyldig(
            cachetOboToken
        )}`
    );

    if (cachetOboToken && tokenErFremdelesGyldig(cachetOboToken)) {
        console.log(`Bruker cachet OBO-token for scope ${scope}`);
        return cachetOboToken.token;
    } else {
        console.log(`Henter nytt OBO-token for scope ${scope}`);
        const nyttOboToken = await hentNyttOnBehalfOfToken(accessToken, scope);
        const expires = Date.now() + nyttOboToken.expires_in * 1000;

        tokenCache[scope][accessToken] = {
            token: nyttOboToken,
            expires,
        };

        console.log(
            `Cache har nå ${Object.keys(tokenCache).length} scopes, scope "${scope}" har ${
                Object.keys(tokenCache[scope]).length
            } entries:`,
            Object.keys(tokenCache[scope]).map((accessToken) => accessToken.substring(0, 5))
        );

        return nyttOboToken;
    }
}

function hentCacheForScope(scope: string): Record<AccessToken, CachetOboToken> {
    if (tokenCache[scope] === undefined) {
        tokenCache[scope] = {};
    }

    return tokenCache[scope];
}

async function hentNyttOnBehalfOfToken(accessToken: string, scope: string): Promise<OboToken> {
    const formData = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        scope,
        client_id: process.env.AZURE_APP_CLIENT_ID,
        client_secret: process.env.AZURE_APP_CLIENT_SECRET,
        assertion: accessToken,
        requested_token_use: 'on_behalf_of',
    };

    const url = process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT;

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(formData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const body = await response.json();

        if (response.ok) {
            return body as OboToken;
        } else {
            const error = body['error'];
            const errorDescription = body['error_description'];

            console.log(
                `Klarte ikke å hente on behalf of token for scope "${scope}", årsak:`,
                error,
                errorDescription
            );

            throw new Error(response.statusText);
        }
    } catch (e) {
        throw e;
    }
}

function tokenErFremdelesGyldig(token: CachetOboToken) {
    const frist = Date.now() - 5000;
    const erGyldig = token.expires >= frist;

    console.log(
        erGyldig
            ? 'Token er fremdeles gyldig'
            : `Token er utgått med dato ${new Date(
                  token.expires
              ).toISOString()}, frist var (${new Date(frist).toISOString()}`
    );

    return token.expires >= Date.now() - 5000;
}
