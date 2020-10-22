import React, { FunctionComponent } from 'react';
import MocketStatistikk from './utvikling/MocketStatistikk';
import { StatistikkMicrofrontend } from './StatistikkMicrofrontend';
import './App.less';
import { KandidatMicrofrontend } from './KandidatMicrofrontend';

const Statistikk =
    window.location.hostname === 'localhost' ? MocketStatistikk : StatistikkMicrofrontend;

const Kandidatsøk =
    window.location.hostname === 'localhost' ? MocketStatistikk : KandidatMicrofrontend;

const App: FunctionComponent = () => (
    <div className="App">
        <header className="App-header">
            <h1>Rekrutteringsbistand-container</h1>
        </header>
        <main>
            <Statistikk />
            <Kandidatsøk />
        </main>
    </div>
);

export default App;
