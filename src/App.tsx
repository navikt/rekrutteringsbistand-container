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

type FellesMicrofrontendProps = {
    navKontor: string | null;
    history: History;
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
                        <Microfrontend<FellesMicrofrontendProps>
                            key="rekrutteringsbistand-stilling"
                            appName="rekrutteringsbistand-stilling"
                            appPath="/rekrutteringsbistand-stilling"
                            appProps={{
                                navKontor,
                                history,
                            }}
                        />
                    </Route>
                    <Route path="/stillingssok">
                        <Microfrontend<FellesMicrofrontendProps>
                            key="rekrutteringsbistand-stillingssok"
                            appName="rekrutteringsbistand-stillingssok"
                            appPath="/rekrutteringsbistand-stillingssok"
                            appProps={{
                                navKontor,
                                history,
                            }}
                        />
                    </Route>
                    <Route path="/kandidater">
                        <Microfrontend<FellesMicrofrontendProps>
                            key="rekrutteringsbistand-kandidat"
                            appName="rekrutteringsbistand-kandidat"
                            appPath="/rekrutteringsbistand-kandidat"
                            appProps={{
                                navKontor,
                                history,
                            }}
                        />
                    </Route>
                    <Route exact path="/">
                        <Microfrontend<FellesMicrofrontendProps>
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
