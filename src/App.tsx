import React, { FunctionComponent, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import history from './history';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import Modiadekoratør from './modia/Modiadekoratør';
import { Stilling, Kandidat, Statistikk, Stillingssøk, Bedriftspresentasjoner } from './microfrontends/microfrontends';

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
                    <Route path="/bedriftspresentasjoner">
                        <Bedriftspresentasjoner />
                    </Route>
                    <Route path="/stillinger">
                        <Stilling navKontor={navKontor} history={history} />
                    </Route>
                    <Route path="/stillingssok">
                        <Stillingssøk navKontor={navKontor} history={history} />
                    </Route>
                    <Route path={['/kandidater', '/kandidatsok']}>
                        <Kandidat navKontor={navKontor} history={history} />
                    </Route>
                    <Route exact path="/">
                        <Statistikk navKontor={navKontor} history={history} />
                    </Route>
                </Switch>
            </main>
        </>
    );
};

export default App;
