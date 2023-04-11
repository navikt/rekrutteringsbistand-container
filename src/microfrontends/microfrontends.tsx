import React, { FunctionComponent } from 'react';
import { Loader } from '@navikt/ds-react';
import { AsyncNavspa } from '@navikt/navspa';

import { craAssetManifestParser, viteAssetManifestParser } from './assetManifestUtils';
import css from './microfrontends.module.css';
import { History } from 'history';
import { erDev } from '../miljø';

type FellesMicrofrontendProps = {
    navKontor: string | null;
    history: History;
};

const LasterInn: FunctionComponent = () => (
    <div className={css.lasterInn}>
        <Loader size="xlarge" />
    </div>
);

const kandidatConfig = {
    appName: 'rekrutteringsbistand-kandidat',
    appBaseUrl: '/rekrutteringsbistand-kandidat',
    assetManifestParser: craAssetManifestParser,
    loader: <LasterInn />,
};

const kandidatsøkConfig = {
    appName: 'rekrutteringsbistand-kandidatsok',
    appBaseUrl: '/rekrutteringsbistand-kandidatsok',
    assetManifestParser: viteAssetManifestParser('rekrutteringsbistand-kandidatsok'),
    loader: <LasterInn />,
};

const statistikkConfig = {
    appName: 'rekrutteringsbistand-statistikk',
    appBaseUrl: '/rekrutteringsbistand-statistikk',
    assetManifestParser: craAssetManifestParser,
    loader: <LasterInn />,
};

const stillingssøkConfig = {
    appName: erDev()
        ? 'https://rekrutteringsbistand.intern.dev.nav.no/rekrutteringsbistand-stillingssok'
        : 'rekrutteringsbistand-stillingssok', // fjern ternary når også container er på intern.dev.nav.no
    appBaseUrl: `/rekrutteringsbistand-stillingssok`,
    assetManifestParser: craAssetManifestParser,
    loader: <LasterInn />,
};

const stillingConfig = {
    appName: 'rekrutteringsbistand-stilling',
    appBaseUrl: '/rekrutteringsbistand-stilling',
    assetManifestParser: craAssetManifestParser,
    loader: <LasterInn />,
};

export const Statistikk = AsyncNavspa.importer<FellesMicrofrontendProps>(statistikkConfig);
export const Stillingssøk = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingssøkConfig);
export const Stilling = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingConfig);
export const Kandidat = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatConfig);
export const Kandidatsøk = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatsøkConfig);
