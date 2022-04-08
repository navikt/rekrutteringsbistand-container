import React, { FunctionComponent, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Header from './Header';
import { Kandidat, Statistikk, Stilling, Stillingssøk } from './microfrontends/microfrontends';
import {
    AmplitudeEvent,
    sendEvent,
    sendGenerellEvent,
    setNavKontorForAmplitude,
} from './amplitude';
import { generaliserPath } from './utils/path';
import { BrowserHistory } from 'history';

const App: FunctionComponent<{ history: BrowserHistory }> = ({ history }) => {
    const location = useLocation();
    const [navKontor, setNavKontor] = useState<string | null>(null);
    const [harSendtÅpneAppEvent, setHarSendtÅpneAppEvent] = useState<boolean>(false);

    useEffect(() => {
        const konfigurerAmplitudeOgSendEvents = async (navKontor: string) => {
            setNavKontorForAmplitude(navKontor);

            await sendGenerellEvent(AmplitudeEvent.Sidevisning, {
                path: generaliserPath(location.pathname),
            });

            if (!harSendtÅpneAppEvent) {
                sendEvent(AmplitudeEvent.ÅpneRekrutteringsbistand, {
                    skjermbredde: window.screen.width,
                });

                setHarSendtÅpneAppEvent(true);
            }
        };

        if (navKontor) {
            konfigurerAmplitudeOgSendEvents(navKontor);
        }
    }, [location.pathname, navKontor, harSendtÅpneAppEvent]);

    return (
        <Routes>
            <Route path="/" element={<Header navKontor={navKontor} setNavKontor={setNavKontor} />}>
                <Route
                    index
                    element={<Statistikk navKontor={navKontor} history={history} />}
                ></Route>
                <Route
                    path="/stillinger/*"
                    element={<Stilling navKontor={navKontor} history={history} />}
                />
                <Route
                    path="/stillingssok"
                    element={<Stillingssøk navKontor={navKontor} history={history} />}
                />
                <Route
                    path="/kandidater/*"
                    element={<Kandidat navKontor={navKontor} history={history} />}
                />
                <Route
                    path="/kandidatsok"
                    element={<Kandidat navKontor={navKontor} history={history} />}
                />
            </Route>
        </Routes>
    );
};

export default App;
