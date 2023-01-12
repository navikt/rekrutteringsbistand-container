import fetch from 'node-fetch';
import { hentOnBehalfOfToken } from './onBehalfOfToken';
import { logger } from './logger';

const apiScope = "https://graph.microsoft.com/.default";
const memberOfApiUrl = "https://graph.microsoft.com/v1.0/me/memberOf/microsoft.graph.group?$filter=startswith(displayName, '0000-GA')";

export enum AdGruppe {
    ModiaGenerellTilgang = '0000-GA-BD06_ModiaGenerellTilgang',
    ModiaOppfølging = '0000-GA-Modia-Oppfolging',
}

type Membership = {
    displayName: AdGruppe;
};

type MemberOfResponse = {
    value: Membership[];
};

export const hentBrukerensAdGrupper = async (accessToken: string): Promise<AdGruppe[]> => {
    try {
        const oboToken = await hentOnBehalfOfToken(accessToken, apiScope);
        const adGrupperResponse = await fetch(memberOfApiUrl, {
            headers: {
                Authorization: `Bearer ${oboToken.access_token}`,
            },
        });

        const adGrupper: MemberOfResponse = await adGrupperResponse.json();
        return adGrupper.value.map((gruppe) => gruppe.displayName);
    } catch (error) {
        const feilmelding = 'Feil under henting av brukers AD-grupper';

        logger.error(feilmelding + ': ' + error);
        throw new Error(feilmelding);
    }
};
