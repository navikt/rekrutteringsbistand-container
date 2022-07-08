import React from 'react';
import { createBrowserHistory } from 'history';
import { createRoot } from 'react-dom/client';
import ContainerRouter from './ContainerRouter';
import App from './App';
import './index.css';
import '@navikt/ds-css';

if (process.env.REACT_APP_MOCK) {
    require('./mock/mock-api');
}

const container = document.getElementById('rekrutteringsbistand-container');
const root = createRoot(container!);

const history = createBrowserHistory();

root.render(
    <React.StrictMode>
        <ContainerRouter history={history}>
            <App history={history} />
        </ContainerRouter>
    </React.StrictMode>
);
