import React, { FunctionComponent } from 'react';
import NyttIRekrutteringsbistand from '@navikt/nytt-i-rekrutteringsbistand';
import { useLocation } from 'react-router-dom';

import Tab, { TabConfig } from './Tab';
import Forsidelenke from './Forsidelenke';

import '../../node_modules/@navikt/nytt-i-rekrutteringsbistand/lib/nytt.css';
import './Navigeringsmeny.less';

const appPrefiks = '/rekrutteringsbistand';

const kandidatsøkTab = {
    tittel: 'Kandidatsøk',
    href: `${appPrefiks}/kandidater`,
    erSammeApp: true,
};

const kandidatlisterTab = {
    tittel: 'Kandidatlister',
    href: `${appPrefiks}/kandidater/lister`,
    erSammeApp: true,
};

const tabs: TabConfig[] = [
    {
        tittel: 'Søk etter stilling',
        href: `${appPrefiks}/stillinger`,
        erSammeApp: false,
    },
    {
        tittel: 'Mine stillinger',
        href: `${appPrefiks}/minestillinger`,
        erSammeApp: false,
    },
    kandidatsøkTab,
    kandidatlisterTab,
];

const aktivTab = (pathname: string): TabConfig => {
    if (pathname.startsWith(`${appPrefiks}/kandidater/lister`)) {
        return kandidatlisterTab;
    } else {
        return kandidatsøkTab;
    }
};

const Navigeringsmeny: FunctionComponent = () => {
    const { pathname }: any = useLocation();

    return (
        <div className="navigeringsmeny">
            <div className="navigeringsmeny__inner">
                <nav className="navigeringsmeny__tabs">
                    <Forsidelenke href={`${appPrefiks}/`} />
                    {tabs.map((tab) => (
                        <Tab key={tab.href} config={tab} erAktiv={tab === aktivTab(pathname)} />
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
