import React, { FunctionComponent, useState } from 'react';
import { Switch, Route } from 'react-router-dom';

import history from './history';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import Modiadekoratør from './modia/Modiadekoratør';
import { Kandidat, Statistikk, Stilling, Stillingssøk } from './microfrontends/microfrontends';
import { setNavKontorForAmplitude } from './amplitude';

const App: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    const handleNavKontorChange = (navKontor: string) => {
        setNavKontor(navKontor);
        setNavKontorForAmplitude(navKontor);
    };

    return (
        <>
            <header>
                <Modiadekoratør navKontor={navKontor} onNavKontorChange={handleNavKontorChange} />
                <Navigeringsmeny />
            </header>
            <main>
                <Switch>
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
