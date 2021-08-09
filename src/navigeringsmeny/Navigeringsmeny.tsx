import React, { FunctionComponent } from 'react';
import NyttIRekrutteringsbistand from '@navikt/nytt-i-rekrutteringsbistand';
import { useLocation } from 'react-router-dom';

import Tab, { TabConfig } from './Tab';
import Forsidelenke from './Forsidelenke';

import '../../node_modules/@navikt/nytt-i-rekrutteringsbistand/lib/nytt.css';
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
    {
        tittel: 'Jobbtreff',
        path: '/jobbtreff',
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
                    <NyttIRekrutteringsbistand orientering={'under-hoyre' as any} />
                </div>
            </div>
        </div>
    );
};

export default Navigeringsmeny;
