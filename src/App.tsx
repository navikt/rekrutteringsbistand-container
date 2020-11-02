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

    return (
        <>
            <header>
                <Modiadekoratør navKontor={navKontor} onNavKontorChange={setNavKontor} />
                <Navigeringsmeny />
            </header>
            <main>
                <Microfrontend<StatistikkProps>
                    appName="rekrutteringsbistand-statistikk"
                    appPath="/statistikk"
                    appProps={{
                        navKontor,
                    }}
                />
            </main>
        </>
    );
};

export default App;
