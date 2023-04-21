import amplitudeJs, { AmplitudeClient } from 'amplitude-js';
import { Miljø, getMiljø } from './miljø';

export enum AmplitudeEvent {
    Sidevisning = 'sidevisning',
    Navigere = 'navigere',
    ÅpneRekrutteringsbistand = '#rekrutteringsbistand-app-åpne',
}

const getApiKey = () => {
    return getMiljø() === Miljø.ProdGcp
        ? 'a8243d37808422b4c768d31c88a22ef4'
        : '6ed1f00aabc6ced4fd6fcb7fcdc01b30';
};

export const setNavKontorForAmplitude = (navKontor: string) => {
    client.setUserProperties({
        navKontor,
    });
};

export const sendEvent = (event: AmplitudeEvent, properties: Record<string, any>) => {
    client.logEvent(event, properties);
};

export const sendGenerellEvent = (
    event: AmplitudeEvent,
    properties: Record<string, any>
): Promise<void> => {
    const eventProperties = {
        app: 'rekrutteringsbistand',
        ...properties,
    };

    return new Promise((resolve, reject) => {
        client.logEvent(
            event,
            eventProperties,
            () => resolve(),
            () => reject()
        );
    });
};

const client: AmplitudeClient = amplitudeJs.getInstance();

if (import.meta.env.PROD) {
    client.init(getApiKey(), '', {
        apiEndpoint: 'amplitude.nav.no/collect',
        saveEvents: false,
        includeUtm: true,
        batchEvents: false,
        includeReferrer: false,
    });
}
