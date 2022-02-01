import React, { FunctionComponent, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import history from './history';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import Modiadekoratør from './modia/Modiadekoratør';
import { Stillingssøk } from './microfrontends/microfrontends';

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
                        <div>Stilling (placeholder)</div>
                        {/*<Stilling navKontor={navKontor} history={history} />*/}
                    </Route>
                    <Route path="/stillingssok">
                        <Stillingssøk navKontor={navKontor} history={history} />
                    </Route>
                    <Route path={['/kandidater', '/kandidatsok']}>
                        <div>Kandidat (placeholder)</div>
                        {/*<Kandidat navKontor={navKontor} history={history} />*/}
                    </Route>
                    <Route exact path="/">
                        <div>Statistikk (placeholder)</div>
                        {/*<Statistikk navKontor={navKontor} history={history} />*/}
                    </Route>
                </Switch>
            </main>
        </>
    );
};

export default App;
