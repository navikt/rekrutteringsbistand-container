import React from 'react';
import { History } from 'history';
import { AsyncNavspa } from '@navikt/navspa';

import LasterInn from './LasterInn';
import assetManifestParser from './assetManifestUtils';

type FellesMicrofrontendProps = {
    navKontor: string | null;
    history: History;
};

export const Stilling = AsyncNavspa.importer<FellesMicrofrontendProps>({
    appName: 'rekrutteringsbistand-stilling',
    appBaseUrl: '/rekrutteringsbistand-stilling',
    assetManifestParser: assetManifestParser,
    loader: <LasterInn />,
});

export const Kandidat = AsyncNavspa.importer<FellesMicrofrontendProps>({
    appName: 'rekrutteringsbistand-kandidat',
    appBaseUrl: '/rekrutteringsbistand-kandidat',
    assetManifestParser: assetManifestParser,
    loader: <LasterInn />,
});

export const Statistikk = AsyncNavspa.importer<FellesMicrofrontendProps>({
    appName: 'rekrutteringsbistand-statistikk',
    appBaseUrl: '/rekrutteringsbistand-statistikk',
    assetManifestParser: assetManifestParser,
    loader: <LasterInn />,
});

export const Stillingssøk = AsyncNavspa.importer<FellesMicrofrontendProps>({
    appName: 'rekrutteringsbistand-stillingssok',
    appBaseUrl: '/rekrutteringsbistand-stillingssok',
    assetManifestParser: assetManifestParser,
    loader: <LasterInn />,
});
