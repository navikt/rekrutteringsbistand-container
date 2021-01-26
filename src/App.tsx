import React, { FunctionComponent, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { History } from 'history';

import history from './history';
import ImportertMicrofrontend from './microfrontend/Microfrontend';
import MocketMicrofrontend from './microfrontend/mock/MocketMicrofrontend';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import { AsyncNavspa } from '@navikt/navspa';
import NavFrontendSpinner from 'nav-frontend-spinner';
import {
    AssetManifest,
    extractPathsToLoadFromExternalManifest,
    extractPathsToLoadFromManifest,
} from './microfrontend/useAppAssets';
import { ManifestObject } from '@navikt/navspa/dist/async/async-navspa';
import DekoratørProps, { EnhetDisplay } from './modia/DekoratørProps';

const nodeEnvProduction = process.env.NODE_ENV === 'production';

const importerMicrofrontends = process.env.REACT_APP_IMPORT || nodeEnvProduction;

const Microfrontend = importerMicrofrontends ? ImportertMicrofrontend : MocketMicrofrontend;

type FellesMicrofrontendProps = {
    navKontor: string | null;
    history: History;
};

const App: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    const AsyncStillingssok = AsyncNavspa.importer<FellesMicrofrontendProps>({
        appName: 'rekrutteringsbistand-stillingssok',
        appBaseUrl: '/rekrutteringsbistand-stillingssok',
        assetManifestParser: (m) => extractPathsToLoadFromManifest(m as AssetManifest),
        loader: <NavFrontendSpinner />,
    });

    const AsyncModiadekoratør = AsyncNavspa.importer<DekoratørProps>({
        appName: 'internarbeidsflatefs',
        appBaseUrl:
            process.env.NODE_ENV === 'production'
                ? 'https://internarbeidsflatedecorator.nais.adeo.no/v2.1'
                : 'https://navikt.github.io/internarbeidsflatedecorator/v2.1',
        assetManifestParser: (m) =>
            extractPathsToLoadFromExternalManifest(
                m as AssetManifest,
                process.env.NODE_ENV === 'production'
                    ? 'https://internarbeidsflatedecorator.nais.adeo.no'
                    : 'https://navikt.github.io'
            ),
    });

    return (
        <>
            <header>
                <AsyncModiadekoratør
                    appname="Rekrutteringsbistand"
                    enhet={{
                        initialValue: navKontor,
                        display: EnhetDisplay.ENHET_VALG,
                        onChange: setNavKontor,
                        ignoreWsEvents: true,
                    }}
                    toggles={{
                        visVeileder: true,
                    }}
                />
                <Navigeringsmeny />
            </header>
            <main>
                <Switch>
                    <Route path="/stillingssok">
                        <AsyncStillingssok navKontor={navKontor} history={history} />
                    </Route>
                </Switch>
            </main>
        </>
    );
};

export default App;
