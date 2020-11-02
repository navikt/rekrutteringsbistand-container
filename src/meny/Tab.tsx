import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';

export type TabConfig = {
    tittel: string;
    href: string;
    erSammeApp: boolean;
};

type Props = {
    config: TabConfig;
    erAktiv: boolean;
};

const Tab: FunctionComponent<Props> = ({ config, erAktiv }) => {
    const { tittel, href, erSammeApp } = config;

    let className = 'navigeringsmeny__tab';

    if (erAktiv) {
        className += ' navigeringsmeny__tab--aktiv';
    }

    return erSammeApp ? (
        <Link className={className} to={href}>
            <Normaltekst>{tittel}</Normaltekst>
        </Link>
    ) : (
        <a className={className} href={href}>
            <Normaltekst>{tittel}</Normaltekst>
        </a>
    );
};

export default Tab;
