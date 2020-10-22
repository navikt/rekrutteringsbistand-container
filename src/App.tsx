import React, { FunctionComponent, useState } from 'react';
import { Microfrontend } from './Microfrontend';

const MockChildApp = ({
    applicationName,
    vis,
}: {
    applicationName: string;
    applicationBaseUrl: string;
    vis: boolean;
}) => {
    if (!vis) {
        return null;
    }

    return <div>{applicationName}</div>;
};

const ChildApp = window.location.hostname === 'localhost' ? MockChildApp : Microfrontend;

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
                <ChildApp
                    applicationName="rekrutteringsbistand-statistikk"
                    applicationBaseUrl="/statistikk"
                    vis={visning === 1}
                />
                <ChildApp
                    applicationName="rekrutteringsbistand-kandidat"
                    applicationBaseUrl="/kandidater"
                    vis={visning === 2}
                />
            </main>
        </div>
    );
};

export default App;
