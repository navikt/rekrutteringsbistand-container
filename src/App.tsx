import React, { FunctionComponent, useState } from 'react';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import Modiadekoratør from './modia/Modiadekoratør';
import { Switch, Route } from 'react-router-dom';
import ImportertMicrofrontend from './microfrontend/Microfrontend';
import MocketMicrofrontend from './microfrontend/mock/MocketMicrofrontend';

const nodeEnvProduction = process.env.NODE_ENV === 'production';

const importerMicrofrontends = process.env.REACT_APP_IMPORT || nodeEnvProduction;

const Microfrontend = importerMicrofrontends ? ImportertMicrofrontend : MocketMicrofrontend;

type StatistikkProps = {
    navKontor: string | null;
};

type StillingerProps = {
    navKontor: string | null;
};

const App: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    return (
        <>
            <header>
                <Modiadekoratør navKontor={navKontor} onNavKontorChange={setNavKontor} />
                <Navigeringsmeny />
            </header>
            <main>
                <Switch>
                    <Route
                        path="/stillinger"
                        render={() => (
                            <Microfrontend<StillingerProps>
                                key="rekrutteringsbistand-stilling"
                                appName="rekrutteringsbistand-stilling"
                                appPath="/rekrutteringsbistand-stilling"
                                staticPaths={
                                    nodeEnvProduction
                                        ? ['/microfrontend-ressurser/stilling/static/js/env.js']
                                        : undefined
                                }
                                appProps={{
                                    navKontor,
                                }}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Microfrontend<StatistikkProps>
                                key="rekrutteringsbistand-statistikk"
                                appName="rekrutteringsbistand-statistikk"
                                appPath="/rekrutteringsbistand-statistikk"
                                appProps={{
                                    navKontor,
                                }}
                            />
                        )}
                    />
                </Switch>
            </main>
        </>
    );
};

export default App;
