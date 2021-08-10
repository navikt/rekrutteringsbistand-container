import React, { FunctionComponent } from 'react';

import assetManifestParser from './assetManifestUtils';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AsyncNavspa } from '@navikt/navspa';
import { History } from 'history';
import './microfrontends.less';

type FellesMicrofrontendProps = {
    navKontor: string | null;
    history: History;
};

const LasterInn: FunctionComponent = () => (
    <div className="microfrontends__laster-inn">
        <NavFrontendSpinner />
    </div>
);

const stillingConfig = {
    appName: 'rekrutteringsbistand-stilling',
    appBaseUrl: '/rekrutteringsbistand-stilling',
    assetManifestParser,
    loader: <LasterInn />,
};

const kandidatConfig = {
    appName: 'rekrutteringsbistand-kandidat',
    appBaseUrl: '/rekrutteringsbistand-kandidat',
    assetManifestParser,
    loader: <LasterInn />,
};

const statistikkConfig = {
    appName: 'rekrutteringsbistand-statistikk',
    appBaseUrl: '/rekrutteringsbistand-statistikk',
    assetManifestParser,
    loader: <LasterInn />,
};

const stillingssøkConfig = {
    appName: 'rekrutteringsbistand-stillingssok',
    appBaseUrl: '/rekrutteringsbistand-stillingssok',
    assetManifestParser,
    loader: <LasterInn />,
};

const isProductionEnvironment = window.location.origin.includes('nais.adeo.no')

const jobbtreffOrigin = isProductionEnvironment
    ? 'https://rekrutteringsbistand-jobbtreff.intern.nav.no'
    : 'https://rekrutteringsbistand-jobbtreff.dev.intern.nav.no';

const jobbtreffConfig = {
    appName: 'rekrutteringsbistand-jobbtreff',
    appBaseUrl: `${jobbtreffOrigin}/rekrutteringsbistand-jobbtreff/`,
    assetManifestParser,
    loader: <LasterInn />,
};

export const Stilling = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingConfig);
export const Kandidat = AsyncNavspa.importer<FellesMicrofrontendProps>(kandidatConfig);
export const Statistikk = AsyncNavspa.importer<FellesMicrofrontendProps>(statistikkConfig);
export const Stillingssøk = AsyncNavspa.importer<FellesMicrofrontendProps>(stillingssøkConfig);
export const Jobbtreff = AsyncNavspa.importer(jobbtreffConfig);
