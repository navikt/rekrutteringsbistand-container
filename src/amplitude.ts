import amplitudeJs, { AmplitudeClient } from 'amplitude-js';
import { Miljø, getMiljø } from './miljø';

export enum AmplitudeEvent {
    Sidevisning = 'sidevisning',
    Navigere = 'navigere',
    PanelEkspander = 'panel-ekspander',
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

export const sendEvent = (event: AmplitudeEvent, properties: Record<string, any>): void => {
    client.logEvent(event, {
        app: 'rekrutteringsbistand',
        ...properties,
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
