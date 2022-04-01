import React, { FunctionComponent, ReactNode, useState, useEffect, useRef } from 'react';
import { Heading, Popover } from '@navikt/ds-react';

import Artikkel from './Artikkel';
import Ikon from './Ikon';
import useAntallUlesteNyheter from './useAntallUlesteNyheter';
import nyhetssaker from './nyhetssaker';
import './Nyheter.less';

export type Nyhet = {
    dato: Date;
    tittel: string;
    innhold: ReactNode;
};

const Nyheter: FunctionComponent = () => {
    const [åpen, setÅpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const onFørsteBesøk = () => {
        setÅpen(true);
    };

    const [antallUlesteNyheter, antallUlesteVedSidelast, markerSomLest] = useAntallUlesteNyheter(
        nyhetssaker,
        onFørsteBesøk
    );

    useEffect(() => {
        if (åpen) {
            markerSomLest();
        }
    }, [åpen, markerSomLest]);

    return (
        <div className="nyheter">
            <button ref={buttonRef} onClick={() => setÅpen(!åpen)} className="nyheter__knapp">
                <Ikon />
                {antallUlesteNyheter > 0 && <div className="nyheter__notifikasjon" />}
            </button>
            <Popover
                open={åpen}
                anchorEl={buttonRef.current}
                onClose={() => setÅpen(false)}
                placement="bottom-start"
            >
                <div className="nyheter__popover">
                    <Heading size="xsmall" level="2" className="nyheter__tittel">
                        Nytt i Rekrutteringsbistand
                    </Heading>
                    <section className="nyheter__nyheter">
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

export default Nyheter;
