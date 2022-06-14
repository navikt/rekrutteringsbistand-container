import { createBrowserHistory } from 'history';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'react-router-dom';
import App from './App';
import './index.css';
import '@navikt/ds-css';

const history = createBrowserHistory();

if (process.env.REACT_APP_MOCK) {
    require('./mock/mock-api');
}

const container = document.getElementById('rekrutteringsbistand-container');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Router history={history}>
            <App />
        </Router>
    </React.StrictMode>
);
