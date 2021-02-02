import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { hotjar } from 'react-hotjar';

import App from './App';
import history from './history';
import './index.less';

const hjid = 118350;
const hjsv = 6;
hotjar.initialize(hjid, hjsv);

if (process.env.REACT_APP_MOCK) {
    require('./mock/mock-api');
}

ReactDOM.render(
    <React.StrictMode>
        <Router history={history}>
            <App />
        </Router>
    </React.StrictMode>,
    document.getElementById('rekrutteringsbistand-container')
);
