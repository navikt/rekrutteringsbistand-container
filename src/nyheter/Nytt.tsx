import React, { FunctionComponent, ReactNode, useState, useEffect, useRef } from 'react';
import { Element } from 'nav-frontend-typografi';
import Popover, { PopoverOrientering, PopoverProps } from 'nav-frontend-popover';

import Artikkel from './Artikkel';
import Ikon from './Ikon';
import useAntallUlesteNyheter from './useAntallUlesteNyheter';
import './Nytt.less';

export type Nyhet = {
    dato: Date;
    tittel: string;
    innhold: ReactNode;
};

interface Props extends Partial<PopoverProps> {
    navn: string;
    nyhetssaker: Nyhet[];
    åpneVedFørsteBesøk?: boolean;
    onÅpneNyheter?: (antallUlesteNyheter: number) => void;
}

const Nytt: FunctionComponent<Props> = (props) => {
    const { navn, nyhetssaker, åpneVedFørsteBesøk = false, onÅpneNyheter, ...popoverProps } = props;

    const [popoverAnker, setPopoverAnker] = useState<HTMLElement | undefined>();
    const [erÅpnet, setErÅpnet] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const onFørsteBesøk = () => {
        if (åpneVedFørsteBesøk) {
            toggleNyheter();
        }
    };

    const [antallUlesteNyheter, antallUlesteVedSidelast, markerSomLest] = useAntallUlesteNyheter(
        nyhetssaker,
        onFørsteBesøk
    );

    const toggleNyheter = () => {
        if (popoverAnker) {
            setPopoverAnker(undefined);
        } else if (buttonRef.current) {
            setPopoverAnker(buttonRef.current);

            if (onÅpneNyheter) {
                onÅpneNyheter(antallUlesteNyheter);
            }

            if (!erÅpnet) {
                setErÅpnet(true);
            }
        }
    };

    useEffect(() => {
        if (erÅpnet) {
            markerSomLest();
        }
    }, [erÅpnet, markerSomLest]);

    return (
        <div className="nytt">
            <button ref={buttonRef} onClick={toggleNyheter} className="nytt__knapp">
                <Ikon navn={navn} />
                {antallUlesteNyheter > 0 && <div className="nytt__notifikasjon" />}
            </button>
            <Popover
                ankerEl={popoverAnker}
                avstandTilAnker={16}
                onRequestClose={() => setPopoverAnker(undefined)}
                orientering={PopoverOrientering.Under}
                {...popoverProps}
            >
                <div className="nytt__popover">
                    <Element tag="h2" className="nytt__tittel">
                        Nytt i {navn}
                    </Element>
                    <section className="nytt__nyheter">
                        {nyhetssaker.map((nyhet, index) => (
                            <Artikkel
                                key={`${nyhet.dato}-${nyhet.tittel}`}
                                ulest={index < antallUlesteVedSidelast}
                                nyhet={nyhet}
                            />
                        ))}
                    </section>
                </div>
            </Popover>
        </div>
    );
};

export default Nytt;
