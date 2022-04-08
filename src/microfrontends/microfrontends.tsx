import React, { FunctionComponent } from 'react';
import { Loader } from '@navikt/ds-react';
import { AsyncNavspa } from '@navikt/navspa';
import { BrowserHistory } from 'history';

import assetManifestParser from './assetManifestUtils';
import './microfrontends.less';

type FellesMicrofrontendProps = {
    navKontor: string | null;
    history: BrowserHistory;
};

const LasterInn: FunctionComponent = () => (
    <div className="microfrontends__laster-inn">
        <Loader size="xlarge" />
    </div>
);

const kandidatConfig = {
    appName: 'rekrutteringsbistand-kandidat',
    appBaseUrl: '/rekrutteringsbistand-kandidat',
    assetManifestParser: assetManifestParser('/rekrutteringsbistand-kandidat'),
    loader: <LasterInn />,
};

const statistikkConfig = {
    appName: 'rekrutteringsbistand-statistikk',
    appBaseUrl: '/rekrutteringsbistand-statistikk',
    assetManifestParser: assetManifestParser('/rekrutteringsbistand-kandidat'),
    loader: <LasterInn />,
};

const stillingssøkConfig = {
    appName: 'rekrutteringsbistand-stillingssok',
    appBaseUrl: `/rekrutteringsbistand-stillingssok`,
    assetManifestParser: assetManifestParser('/rekrutteringsbistand-kandidat'),
    loader: <LasterInn />,
};

const stillingConfig = {
    appName: 'rekrutteringsbistand-stilling',
    appBaseUrl: '/rekrutteringsbistand-stilling',
    assetManifestParser: assetManifestParser('/rekrutteringsbistand-kandidat'),
    loader: <LasterInn />,
};

export const Statistikk = AsyncNavspa.importer<FellesMicrofrontendProps>(statistikkConfig);
export const Stillingssøk = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingssøkConfig);
export const Stilling = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingConfig);
export const Kandidat = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatConfig);
