import { FunctionComponent } from 'react';
import { Loader } from '@navikt/ds-react';
import { AsyncNavspa } from '@navikt/navspa';

import { viteAssetManifestParser } from './assetManifestUtils';
import { History } from 'history';
import css from './microfrontends.module.css';

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
    assetManifestParser: viteAssetManifestParser('rekrutteringsbistand-kandidat'),
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
    assetManifestParser: viteAssetManifestParser('rekrutteringsbistand-statistikk'),
    loader: <LasterInn />,
};

const stillingssøkConfig = {
    appName: 'rekrutteringsbistand-stillingssok',
    appBaseUrl: `/rekrutteringsbistand-stillingssok`,
    assetManifestParser: viteAssetManifestParser('rekrutteringsbistand-stillingssok'),
    loader: <LasterInn />,
};

const stillingConfig = {
    appName: 'rekrutteringsbistand-stilling',
    appBaseUrl: '/rekrutteringsbistand-stilling',
    assetManifestParser: viteAssetManifestParser('rekrutteringsbistand-stilling'),
    loader: <LasterInn />,
};

export const Statistikk = AsyncNavspa.importer<FellesMicrofrontendProps>(statistikkConfig);
export const Stillingssøk = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingssøkConfig);
export const Stilling = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingConfig);
export const Kandidat = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatConfig);
export const Kandidatsøk = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatsøkConfig);
