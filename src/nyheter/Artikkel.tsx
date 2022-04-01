import React, { FunctionComponent } from 'react';
import { Undertittel, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Nyhet } from './Nytt';

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
    const klassenavn = 'nytt__artikkel' + (ulest ? ' nytt__artikkel--ulest' : '');

    return (
        <article className={klassenavn}>
            <Undertekst className="nytt__artikkeldato">{printDato(nyhet.dato)}</Undertekst>
            <Undertittel className="nytt__artikkeltittel">{nyhet.tittel}</Undertittel>
            <Normaltekst className="nytt__artikkelinnhold" tag="section">
                {nyhet.innhold}
            </Normaltekst>
        </article>
    );
};

export default Artikkel;
