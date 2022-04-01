import React, { FunctionComponent } from 'react';
import { PopoverProps } from 'nav-frontend-popover';
import Nytt from './Nytt';
import nyhetssaker from './nyhetssaker';

type Props = Partial<PopoverProps> & {
    onÅpneNyheter?: (antallUlesteNyheter: number) => void;
};

const Nyheter: FunctionComponent<Props> = ({ onÅpneNyheter, ...popoverProps }: Props) => (
    <Nytt
        åpneVedFørsteBesøk
        onÅpneNyheter={onÅpneNyheter}
        navn="Rekrutteringsbistand"
        nyhetssaker={nyhetssaker}
        {...popoverProps}
    />
);

export default Nyheter;
