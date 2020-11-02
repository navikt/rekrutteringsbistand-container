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
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const Tab: FunctionComponent<Props> = ({ config, erAktiv, onClick }) => {
    const { tittel, href, erSammeApp } = config;

    let className = 'navigeringsmeny__tab';

    if (erAktiv) {
        className += ' navigeringsmeny__tab--aktiv';
    }

    return erSammeApp ? (
        <Link className={className} to={href} onClick={onClick}>
            <Normaltekst>{tittel}</Normaltekst>
        </Link>
    ) : (
        <a className={className} href={href} onClick={onClick}>
            <Normaltekst>{tittel}</Normaltekst>
        </a>
    );
};

export default Tab;
