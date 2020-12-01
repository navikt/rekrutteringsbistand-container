import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';

export type TabConfig = {
    tittel: string;
    href: string;
};

type Props = {
    config: TabConfig;
    erAktiv: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const Tab: FunctionComponent<Props> = ({ config, erAktiv, onClick }) => {
    const { tittel, href } = config;

    let className = 'navigeringsmeny__tab';

    if (erAktiv) {
        className += ' navigeringsmeny__tab--aktiv';
    }

    return (
        <Link className={className} to={href} onClick={onClick}>
            <Normaltekst>{tittel}</Normaltekst>
        </Link>
    );
};

export default Tab;
