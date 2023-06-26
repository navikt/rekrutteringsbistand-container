import { FunctionComponent } from 'react';
import { Detail, Heading } from '@navikt/ds-react';
import { Nyhet } from './Nyheter';
import css from './Artikkel.module.css';

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
    const klassenavn = css.artikkel + (ulest ? ' ' + css.ulestArtikkel : '');

    return (
        <article className={klassenavn}>
            <Detail size="small">{printDato(nyhet.dato)}</Detail>
            <Heading spacing size="small" className={css.tittel}>
                {nyhet.tittel}
            </Heading>
            <div className={css.innhold}>{nyhet.innhold}</div>
        </article>
    );
};

export default Artikkel;
