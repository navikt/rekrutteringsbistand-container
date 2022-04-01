import React, { FunctionComponent } from 'react';
import { Detail, Heading } from '@navikt/ds-react';
import { Nyhet } from './Nyheter';

const printDato = (dato: Date) =>
    dato.toLocaleDateString
        ? dato.toLocaleDateString('no-NB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : dato.toISOString();

interface Props {
    nyhet: Nyhet;
    ulest: boolean;
}

const Artikkel: FunctionComponent<Props> = ({ nyhet, ulest }) => {
    const klassenavn = 'nyheter__artikkel' + (ulest ? ' nyheter__artikkel--ulest' : '');

    return (
        <article className={klassenavn}>
            <Detail size="small" className="nyheter__artikkeldato">
                {printDato(nyhet.dato)}
            </Detail>
            <Heading size="small" className="nyheter__artikkeltittel">
                {nyhet.tittel}
            </Heading>
            <div className="nyheter__artikkelinnhold">{nyhet.innhold}</div>
        </article>
    );
};

export default Artikkel;
