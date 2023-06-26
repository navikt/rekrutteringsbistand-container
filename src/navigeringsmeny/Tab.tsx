import { FunctionComponent } from 'react';
import { BodyShort } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import navigerignsmenyCss from './Navigeringsmeny.module.css';

export type TabConfig = {
    tittel: string;
    path: string;
    queryParam?: string;
};

type Props = {
    config: TabConfig;
    erAktiv: boolean;
    erFremhevet?: boolean;
};

const Tab: FunctionComponent<Props> = ({ config, erAktiv, erFremhevet }) => {
    const { tittel, path, queryParam } = config;

    let className = navigerignsmenyCss.tab;
    if (erAktiv) {
        className += ' ' + navigerignsmenyCss.tabAktiv;
    }

    if (erFremhevet) {
        className += ' ' + navigerignsmenyCss.tabFremhevet;
    }

    return (
        <Link
            className={className}
            state={{
                fraMeny: true,
            }}
            to={{
                pathname: path,
                search: queryParam,
            }}
        >
            <BodyShort>{tittel}</BodyShort>
        </Link>
    );
};

export default Tab;
