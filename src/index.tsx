import React from 'react';
import { createBrowserHistory } from 'history';
import { createRoot } from 'react-dom/client';
import ContainerRouter from './ContainerRouter';
import App from './App';
import './index.css';

const container = document.getElementById('rekrutteringsbistand-container');
const root = createRoot(container!);

const history = createBrowserHistory();

const setupMock = async () => {
    await import('./mock/mock-api');
};

if (import.meta.env.VITE_MOCK) {
    setupMock();
}

root.render(
    <React.StrictMode>
        <ContainerRouter history={history}>
            <App history={history} />
        </ContainerRouter>
    </React.StrictMode>
);
