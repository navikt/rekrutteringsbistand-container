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
        href: '/stillinger',
    },
    {
        tittel: 'Mine stillinger',
        href: '/stillinger/minestillinger',
    },
    {
        tittel: 'Kandidatsøk',
        href: '/kandidater',
    },
    {
        tittel: 'Kandidatlister',
        href: '/kandidater/lister',
    },
];

const Navigeringsmeny: FunctionComponent = () => {
    const { pathname }: any = useLocation();

    const onTabClick = (href: string) => (event: React.MouseEvent<HTMLElement>) => {};

    return (
        <div className="navigeringsmeny">
            <div className="navigeringsmeny__inner">
                <nav className="navigeringsmeny__tabs">
                    <Forsidelenke
                        href={`${appPrefiks}/`}
                        erAktiv={pathname === `${appPrefiks}/`}
                        onClick={onTabClick('/')}
                    />
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.href}
                            config={tab}
                            erAktiv={pathname === tab.href}
                            onClick={onTabClick(tab.href)}
                        />
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
