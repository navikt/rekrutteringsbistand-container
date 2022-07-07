import React, { FunctionComponent } from 'react';
import { Loader } from '@navikt/ds-react';
import { AsyncNavspa } from '@navikt/navspa';

import assetManifestParser from './assetManifestUtils';
import css from './microfrontends.module.css';

type FellesMicrofrontendProps = {
    navKontor: string | null;
};

const LasterInn: FunctionComponent = () => (
    <div className={css.lasterInn}>
        <Loader size="xlarge" />
    </div>
);

const kandidatConfig = {
    appName: 'rekrutteringsbistand-kandidat',
    appBaseUrl: '/rekrutteringsbistand-kandidat',
    assetManifestParser: assetManifestParser(),
    loader: <LasterInn />,
};

const kandidatsøkConfig = {
    appName: 'rekrutteringsbistand-kandidatsok',
    appBaseUrl: '/rekrutteringsbistand-kandidatsok',
    assetManifestParser: assetManifestParser(),
    loader: <LasterInn />,
};

const statistikkConfig = {
    appName: 'rekrutteringsbistand-statistikk',
    appBaseUrl: '/rekrutteringsbistand-statistikk',
    assetManifestParser: assetManifestParser(),
    loader: <LasterInn />,
};

const stillingssøkConfig = {
    appName: 'rekrutteringsbistand-stillingssok',
    appBaseUrl: `/rekrutteringsbistand-stillingssok`,
    assetManifestParser: assetManifestParser(),
    loader: <LasterInn />,
};

const stillingConfig = {
    appName: 'rekrutteringsbistand-stilling',
    appBaseUrl: '/rekrutteringsbistand-stilling',
    assetManifestParser: assetManifestParser(),
    loader: <LasterInn />,
};

export const Statistikk = AsyncNavspa.importer<FellesMicrofrontendProps>(statistikkConfig);
export const Stillingssøk = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingssøkConfig);
export const Stilling = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingConfig);
export const Kandidat = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatConfig);
export const Kandidatsøk = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatsøkConfig);
