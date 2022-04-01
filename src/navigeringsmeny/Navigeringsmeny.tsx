import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';

import Tab, { TabConfig } from './Tab';
import Forsidelenke from './Forsidelenke';
import './Navigeringsmeny.less';
import Nyheter from '../nyheter/Nyheter';

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
    const { pathname }: any = useLocation();

    return (
        <div className="navigeringsmeny">
            <div className="navigeringsmeny__inner">
                <nav className="navigeringsmeny__tabs">
                    <Forsidelenke href={`${appPrefiks}/`} erAktiv={pathname === `${appPrefiks}/`} />
                    {tabs.map((tab) => (
                        <Tab key={tab.path} config={tab} erAktiv={pathname === tab.path} />
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
