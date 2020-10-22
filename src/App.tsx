import React, { FunctionComponent, useState } from 'react';
import MocketStatistikk from './utvikling/MocketStatistikk';
import StatistikkMicrofrontend from './StatistikkMicrofrontend';
import KandidatMicrofrontend from './KandidatMicrofrontend';

const Statistikk =
    window.location.hostname === 'localhost' ? MocketStatistikk : StatistikkMicrofrontend;

const Kandidatsøk =
    window.location.hostname === 'localhost' ? MocketStatistikk : KandidatMicrofrontend;

const App: FunctionComponent = () => {
    const [visning, setVisning] = useState<number>(2);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Rekrutteringsbistand-container</h1>
            </header>
            <nav>
                <button onClick={() => setVisning(1)}>Statistikk</button>
                <button onClick={() => setVisning(2)}>Kandidat</button>
            </nav>
            <main>
                {visning === 1 && <Statistikk />}
                {visning === 2 && <Kandidatsøk />}
            </main>
        </div>
    );
};

export default App;
