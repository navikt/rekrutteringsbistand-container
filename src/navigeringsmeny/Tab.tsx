import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';

export type TabConfig = {
    tittel: string;
    path: string;
    queryParam?: string;
};

type Props = {
    config: TabConfig;
    erAktiv: boolean;
};

const Tab: FunctionComponent<Props> = ({ config, erAktiv }) => {
    const { tittel, path, queryParam } = config;

    let className = 'navigeringsmeny__tab';
    if (erAktiv) {
        className += ' navigeringsmeny__tab--aktiv';
    }

    const href = queryParam ? path + queryParam : path;

    return (
        <Link className={className} to={href}>
            <Normaltekst>{tittel}</Normaltekst>
        </Link>
    );
};

export default Tab;
