import React, { FunctionComponent, useEffect, useState } from 'react';

import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import Modiadekoratør from './modia/Modiadekoratør';
import {
    Kandidat,
    Kandidatsøk,
    Statistikk,
    Stilling,
    Stillingssøk,
} from './microfrontends/microfrontends';
import {
    AmplitudeEvent,
    sendEvent,
    sendGenerellEvent,
    setNavKontorForAmplitude,
} from './amplitude';
import { generaliserPath } from './utils/path';
import { erIkkeProd } from './miljø';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';

const App: FunctionComponent = () => {
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
            <Route
                path="/"
                element={
                    <>
                        <header>
                            <Modiadekoratør
                                navKontor={navKontor}
                                onNavKontorChange={setNavKontor}
                            />
                            <Navigeringsmeny />
                        </header>
                        <Outlet />
                    </>
                }
            >
                <Route index element={<Statistikk navKontor={navKontor} />} />

                <Route path="stillinger/*" element={<Stilling navKontor={navKontor} />} />
                <Route path="stillingssok" element={<Stillingssøk navKontor={navKontor} />} />
                <Route path="kandidater/*" element={<Kandidat navKontor={navKontor} />} />
                <Route path="prototype" element={<Kandidat navKontor={navKontor} />} />

                {erIkkeProd() && (
                    <Route path="kandidatsok" element={<Kandidatsøk navKontor={navKontor} />} />
                )}
            </Route>
        </Routes>
    );
};

export default App;
