import React, { FunctionComponent } from 'react';
import { BodyShort } from '@navikt/ds-react';
import { Link, useMatch } from 'react-router-dom';

export type TabConfig = {
    tittel: string;
    path: string;
    queryParam?: string;
};

type Props = {
    config: TabConfig;
};

const Tab: FunctionComponent<Props> = ({ config }) => {
    const erAktiv = useMatch(config.path);

    const { tittel, path, queryParam } = config;

    let className = 'navigeringsmeny__tab';
    if (erAktiv) {
        className += ' navigeringsmeny__tab--aktiv';
    }

    return (
        <Link
            className={className}
            to={{
                pathname: path,
                search: queryParam,
            }}
            state={{
                fraMeny: true,
            }}
        >
            <BodyShort>{tittel}</BodyShort>
        </Link>
    );
};

export default Tab;
