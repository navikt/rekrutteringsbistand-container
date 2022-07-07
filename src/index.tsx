import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@navikt/ds-css';
import './index.css';

if (process.env.REACT_APP_MOCK) {
    require('./mock/mock-api');
}

const container = document.getElementById('rekrutteringsbistand-container');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
