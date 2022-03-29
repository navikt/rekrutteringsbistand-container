import amplitudeJs, { AmplitudeClient } from 'amplitude-js';
import { Miljø, getMiljø } from './miljø';

export enum AmplitudeEvent {
    Sidevisning = 'sidevisning',
    Navigere = 'navigere',
    ÅpneRekrutteringsbistand = '#rekrutteringsbistand-app-åpne',
}

const getApiKey = () => {
    return getMiljø() === Miljø.ProdGcp
        ? '3a6fe32c3457e77ce81c356bb14ca886'
        : '55477baea93c5227d8c0f6b813653615';
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

client.init(getApiKey(), '', {
    apiEndpoint: 'amplitude.nav.no/collect',
    saveEvents: false,
    includeUtm: true,
    batchEvents: false,
    includeReferrer: false,
});
