import { initializeFaro } from '@grafana/faro-web-sdk';
import { Miljø, getMiljø } from './miljø';

const setupObservability = () => {
    const miljø = getMiljø();

    initializeFaro({
        url:
            miljø === Miljø.ProdGcp
                ? 'https://telemetry.nav.no/collect'
                : 'https://telemetry.ekstern.dev.nav.no/collect',
        app: {
            name: 'rekrutteringsbistand-container',
            version: miljø,
        },
    });
};

export default setupObservability;
