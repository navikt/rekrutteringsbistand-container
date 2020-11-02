import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (process.env.REACT_APP_MOCK) {
    require('./mock/mock-api');
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('rekrutteringsbistand-container')
);
