import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserHistory } from 'history';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import App from './App';
import './index.less';
import '@navikt/ds-css';

const history = createBrowserHistory();

if (process.env.REACT_APP_MOCK) {
    require('./mock/mock-api');
}

const containerElement = document.getElementById('rekrutteringsbistand-container')!;
const container = createRoot(containerElement);

container.render(
    <React.StrictMode>
        <Router history={history}>
            <App history={history} />
        </Router>
    </React.StrictMode>
);
