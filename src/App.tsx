import React, { FunctionComponent, useState } from 'react';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import { Microfrontend2 } from './microfrontend/Microfrontend';
import Modiadekoratør from './modia/Modiadekoratør';
import { Switch, Route } from 'react-router-dom';
import Microfrontend from './microfrontend/Microfrontend';
import MocketMicrofrontend from './microfrontend/mock/MocketMicrofrontend';

const importerMicrofrontends =
    process.env.REACT_APP_IMPORT || process.env.NODE_ENV === 'production';

// const Microfrontend = importerMicrofrontends ? Microfrontend : MocketMicrofrontend;

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
                                appName="rekrutteringsbistand-stilling"
                                appPath="/microfrontend-ressurser/stilling"
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
                            <Microfrontend2<StatistikkProps>
                                appName="rekrutteringsbistand-statistikk"
                                appPath="/microfrontend-ressurser/statistikk"
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
