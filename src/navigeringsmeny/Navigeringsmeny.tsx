import { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';

import Tab, { TabConfig } from './Tab';
import Forsidelenke from './Forsidelenke';
import Nyheter from '../nyheter/Nyheter';
import css from './Navigeringsmeny.module.css';

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
        path: '/kandidatsok',
    },

    {
        tittel: 'Kandidatlister',
        path: '/kandidater/lister',
    },
];

const Navigeringsmeny: FunctionComponent = () => {
    const { pathname }: any = useLocation();

    return (
        <div className={css.navigeringsmeny}>
            <div className={css.inner}>
                <nav className={css.tabs}>
                    <Forsidelenke href={`${appPrefiks}/`} erAktiv={pathname === `${appPrefiks}/`} />
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.path}
                            config={tab}
                            erAktiv={pathname === tab.path}
                            erFremhevet={tab.path === '/kandidater'}
                        />
                    ))}
                </nav>
                <div className={css.nyheter}>
                    <Nyheter />
                </div>
            </div>
        </div>
    );
};

export default Navigeringsmeny;
