import React, { FunctionComponent, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { History } from 'history';

import history from './history';
import ImportertMicrofrontend from './microfrontend/Microfrontend';
import MocketMicrofrontend from './microfrontend/mock/MocketMicrofrontend';
import Modiadekoratør from './modia/Modiadekoratør';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';

const nodeEnvProduction = process.env.NODE_ENV === 'production';

const importerMicrofrontends = process.env.REACT_APP_IMPORT || nodeEnvProduction;

const Microfrontend = importerMicrofrontends ? ImportertMicrofrontend : MocketMicrofrontend;

type StatistikkProps = {
    navKontor: string | null;
    history: History;
};

type StillingerProps = {
    navKontor: string | null;
    history: History;
};

type KandidaterProps = {
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
                    <Route path="/stillinger">
                        <Microfrontend<StillingerProps>
                            key="rekrutteringsbistand-stilling"
                            appName="rekrutteringsbistand-stilling"
                            appPath="/rekrutteringsbistand-stilling"
                            staticPaths={
                                nodeEnvProduction
                                    ? ['/rekrutteringsbistand-stilling/static/js/env.js']
                                    : undefined
                            }
                            appProps={{
                                navKontor,
                                history,
                            }}
                        />
                    </Route>
                    <Route
                        path="/kandidater"
                        render={() => (
                            <Microfrontend<KandidaterProps>
                                key="rekrutteringsbistand-kandidat"
                                appName="rekrutteringsbistand-kandidat"
                                appPath="/rekrutteringsbistand-kandidat"
                                staticPaths={
                                    nodeEnvProduction
                                        ? ['/rekrutteringsbistand-kandidat/static/js/env.js']
                                        : undefined
                                }
                                appProps={{
                                    navKontor,
                                }}
                            />
                        )}
                    />
                    <Route exact path="/">
                        <Microfrontend<StatistikkProps>
                            key="rekrutteringsbistand-statistikk"
                            appName="rekrutteringsbistand-statistikk"
                            appPath="/rekrutteringsbistand-statistikk"
                            appProps={{
                                navKontor,
                                history,
                            }}
                        />
                    </Route>
                </Switch>
            </main>
        </>
    );
};

export default App;
