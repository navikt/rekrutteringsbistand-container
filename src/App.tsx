import React, { FunctionComponent } from 'react';
import Navspa from '@navikt/navspa';
import MocketStatistikk from './utvikling/MocketStatistikk';
import './App.less';

const Statistikk =
    window.location.hostname === 'localhost'
        ? MocketStatistikk
        : Navspa.importer('rekrutteringsbistand-statistikk');

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
