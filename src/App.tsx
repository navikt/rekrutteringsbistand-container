import React, { FunctionComponent, useState } from 'react';
import Navigeringsmeny from './meny/Navigeringsmeny';
import ImportertMicrofrontend from './microfrontend/Microfrontend';
import MocketMicrofrontend from './microfrontend/mock/MocketMicrofrontend';
import Modiadekoratør from './modia/Modiadekoratør';

const importerMicrofrontends =
    process.env.REACT_APP_IMPORT || process.env.NODE_ENV === 'production';

const Microfrontend = importerMicrofrontends ? ImportertMicrofrontend : MocketMicrofrontend;

type StatistikkProps = {
    navKontor: string | null;
};

const App: FunctionComponent = () => {
    const [navKontor, setNavKontor] = useState<string | null>(null);

    const [visning, setVisning] = useState<number>(1);

    return (
        <>
            <header>
                <Modiadekoratør navKontor={navKontor} onNavKontorChange={setNavKontor} />
                <Navigeringsmeny />
            </header>
            <nav>
                <button onClick={() => setVisning(1)}>Statistikk</button>
                <button onClick={() => setVisning(2)}>Kandidat</button>
            </nav>
            <main>
                {visning === 1 && (
                    <Microfrontend<StatistikkProps>
                        appName="rekrutteringsbistand-statistikk"
                        appPath="/statistikk"
                        appProps={{
                            navKontor,
                        }}
                    />
                )}
                {visning === 2 && (
                    <Microfrontend
                        appName="rekrutteringsbistand-kandidat"
                        appPath="/kandidater"
                        appProps={{
                            hilsen: `Hei fra rekrutteringsbistand-kandidat!`,
                        }}
                    />
                )}
            </main>
        </>
    );
};

export default App;
