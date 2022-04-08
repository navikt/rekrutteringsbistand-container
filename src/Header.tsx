import { FunctionComponent } from 'react';
import Modiadekoratør from './modia/Modiadekoratør';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';

type Props = {
    navKontor: string | null;
    setNavKontor: (navKontor: string | null) => void;
};

const Header: FunctionComponent<Props> = ({ navKontor, setNavKontor }) => (
    <header>
        <Modiadekoratør navKontor={navKontor} onNavKontorChange={setNavKontor} />
        <Navigeringsmeny />
    </header>
);

export default Header;
