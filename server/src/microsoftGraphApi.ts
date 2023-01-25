import fetch from 'node-fetch';
import { hentOnBehalfOfToken } from './onBehalfOfToken';
import { logger } from './logger';

const apiScope = 'https://graph.microsoft.com/.default';
const memberOfApiQuery =
    "$count=true&$orderby=displayName&$filter=startswith(displayName, '0000-GA')";
const memberOfApiUrl = 'https://graph.microsoft.com/v1.0/me/memberOf/?' + memberOfApiQuery;

type Membership = {
    id: string;
    displayName: string;
};

type MemberOfResponse = {
    value: Membership[];
};

export const hentBrukerensAdGrupper = async (accessToken: string): Promise<string[]> => {
    try {
        const oboToken = await hentOnBehalfOfToken(accessToken, apiScope);
        const adGrupperResponse = await fetch(memberOfApiUrl, {
            headers: {
                Authorization: `Bearer ${oboToken.access_token}`,
                ConsistencyLevel: 'eventual',
            },
        });

        const adGrupper: MemberOfResponse = await adGrupperResponse.json();
        return adGrupper.value.map((gruppe) => gruppe.id);
    } catch (error) {
        const feilmelding = 'Feil under henting av brukers AD-grupper';

        logger.error(feilmelding + ': ' + error);
        throw new Error(feilmelding);
    }
};
