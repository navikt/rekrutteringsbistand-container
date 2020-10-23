import React, { FunctionComponent, useState } from 'react';
import { Microfrontend } from './Microfrontend';
import MocketMicrofrontend from './utvikling/MocketMicrofrontend';

const ChildApp = window.location.hostname === 'localhost' ? MocketMicrofrontend : Microfrontend;

const App: FunctionComponent = () => {
    const [visning, setVisning] = useState<number>(1);

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
                <main>
                    {visning === 1 && (
                        <ChildApp
                            applicationName="rekrutteringsbistand-statistikk"
                            applicationBaseUrl="/statistikk"
                        />
                    )}
                    {visning === 2 && (
                        <ChildApp
                            applicationName="rekrutteringsbistand-kandidat"
                            applicationBaseUrl="/kandidater"
                        />
                    )}
                </main>
            </main>
        </div>
    );
};

export default App;
