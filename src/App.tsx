import React, { FunctionComponent } from 'react';
import MocketStatistikk from './utvikling/MocketStatistikk';
import { StatistikkMicrofrontend } from './StatistikkMicrofrontend';
import './App.less';

const Statistikk =
    window.location.hostname === 'localhost' ? MocketStatistikk : StatistikkMicrofrontend;

const App: FunctionComponent = () => (
    <div className="App">
        <header className="App-header">
            <h1>Rekrutteringsbistand-container</h1>
        </header>
        <main>
            <Statistikk />
        </main>
    </div>
);

export default App;
