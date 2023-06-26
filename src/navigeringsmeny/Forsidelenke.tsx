import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import navigeringsmenyCss from './Navigeringsmeny.module.css';

type Props = {
    href: string;
    erAktiv: boolean;
};

const Forsidelenke: FunctionComponent<Props> = ({ href, erAktiv }) => {
    let className = navigeringsmenyCss.forsidelenke;

    if (erAktiv) {
        className += ' ' + navigeringsmenyCss.forsidelenkeAktiv;
    }

    return (
        <Link className={className} to={href}>
            <svg viewBox="0 0 24 23" xmlns="http://www.w3.org/2000/svg">
                <title>Hus</title>
                <path
                    d="M12 3.3l8.3 8.3V22h-6.5v-6.5h-3.6v6.5H3.7V11.6L12 3.3zM11.7 1c.1-.2.4-.2.6 0L23 11.6c.2.2.2.5 0 .6-.1.2-.4.2-.6 0L12 2 1.7 12.2c-.2.2-.4.2-.7 0a.5.5 0 010-.6zm8.1.8c.3 0 .5.2.5.4v4.2a.5.5 0 01-.8.3l-4.1-4.1a.5.5 0 01.3-.8z"
                    fill="#3E3832"
                    fillRule="evenodd"
                />
            </svg>
        </Link>
    );
};

export default Forsidelenke;
