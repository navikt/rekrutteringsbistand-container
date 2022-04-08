import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';

import Tab, { TabConfig } from './Tab';
import Forsidelenke from './Forsidelenke';
import Nyheter from '../nyheter/Nyheter';
import './Navigeringsmeny.less';

const appPrefiks = '';

const tabs: TabConfig[] = [
    {
        tittel: 'Søk etter stilling',
        path: '/stillingssok',
        queryParam: '?standardsok',
    },
    {
        tittel: 'Mine stillinger',
        path: '/stillinger/minestillinger',
    },
    {
        tittel: 'Kandidatsøk',
        path: '/kandidater',
    },
    {
        tittel: 'Kandidatlister',
        path: '/kandidater/lister',
    },
];

const Navigeringsmeny: FunctionComponent = () => {
    const location = useLocation();

    return (
        <div className="navigeringsmeny">
            <div className="navigeringsmeny__inner">
                <nav className="navigeringsmeny__tabs">
                    <Forsidelenke
                        href={`${appPrefiks}/`}
                        erAktiv={location.pathname === `${appPrefiks}/`}
                    />
                    {tabs.map((tab) => (
                        <Tab key={tab.path} config={tab} />
                    ))}
                </nav>
                <div className="navigeringsmeny__nyheter">
                    <Nyheter />
                </div>
            </div>
        </div>
    );
};

export default Navigeringsmeny;
