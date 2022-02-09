import React, { FunctionComponent } from 'react';

import assetManifestParser from './assetManifestUtils';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AsyncNavspa } from '@navikt/navspa';
import { History } from 'history';
import './microfrontends.less';
import { erIkkeProd } from '../miljø';

type FellesMicrofrontendProps = {
    navKontor: string | null;
    history: History;
};

const LasterInn: FunctionComponent = () => (
    <div className="microfrontends__laster-inn">
        <NavFrontendSpinner />
    </div>
);

const gcpBaseUrl = erIkkeProd()
    ? 'https://rekrutteringsbistand.dev.intern.nav.no'
    : 'https://rekrutteringsbistand.intern.nav.no';

const stillingConfig = {
    appName: 'rekrutteringsbistand-stilling',
    appBaseUrl: '/rekrutteringsbistand-stilling',
    assetManifestParser: assetManifestParser(),
    loader: <LasterInn />,
};

const kandidatConfig = {
    appName: 'rekrutteringsbistand-kandidat',
    appBaseUrl: '/rekrutteringsbistand-kandidat',
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
    appBaseUrl: `${gcpBaseUrl}/rekrutteringsbistand-stillingssok`,
    assetManifestParser: assetManifestParser(gcpBaseUrl),
    loader: <LasterInn />,
};

export const Stilling = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingConfig);
export const Kandidat = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatConfig);
export const Statistikk = AsyncNavspa.importer<FellesMicrofrontendProps>(statistikkConfig);
export const Stillingssøk = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingssøkConfig);
