import { initializeFaro } from '@grafana/faro-web-sdk';
import nais from './nais';

const setupObservability = () => {
    initializeFaro({
        url: nais.telemetryCollectorURL,
        app: nais.app,
    });
};

export default setupObservability;
