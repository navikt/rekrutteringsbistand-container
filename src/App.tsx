import React, { FunctionComponent, useEffect, useState } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';

import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import Modiadekoratør from './modia/Modiadekoratør';
import { Kandidat, Statistikk, Stilling, Stillingssøk } from './microfrontends/microfrontends';
import { AmplitudeEvent, sendEvent, setNavKontorForAmplitude } from './amplitude';

const App: FunctionComponent = () => {
    const history = useHistory();
    const location = useLocation();
    const [navKontor, setNavKontor] = useState<string | null>(null);

    useEffect(() => {
        if (navKontor) {
            setNavKontorForAmplitude(navKontor);
            sendEvent(AmplitudeEvent.Sidevisning, {
                path: location.pathname,
            });
        }
    }, [location.pathname, navKontor]);

    return (
        <>
            <header>
                <Modiadekoratør navKontor={navKontor} onNavKontorChange={setNavKontor} />
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
