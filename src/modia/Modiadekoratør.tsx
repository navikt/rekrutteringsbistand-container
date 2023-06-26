import { FunctionComponent, useEffect, useState } from 'react';
import Navspa from '@navikt/navspa';
import loadjs from 'loadjs';
import DekoratørProps, { EnhetDisplay } from './DekoratørProps';
import css from './Modiadekoratør.module.css';

const appName = 'internarbeidsflatefs';

const hentHostname = () => {
    if (window.location.hostname.includes('intern.dev.nav.no')) {
        return 'https://internarbeidsflatedecorator-q0.dev.intern.nav.no';
    } else if (window.location.hostname.includes('intern.nav.no')) {
        return 'https://internarbeidsflatedecorator.intern.nav.no';
    } else {
        return 'https://navikt.github.io';
    }
};

const hentAssets = () => {
    let urlPrefix = hentHostname();

    return [
        `${urlPrefix}/internarbeidsflatedecorator/v2.1/static/js/head.v2.min.js`,
        `${urlPrefix}/internarbeidsflatedecorator/v2.1/static/css/main.css`,
    ];
};

enum Status {
    LasterNed,
    Klar,
    Feil,
}

type Props = {
    navKontor: string | null;
    onNavKontorChange: (navKontor: string) => void;
};

const Modiadekoratør: FunctionComponent<Props> = ({ navKontor, onNavKontorChange }) => {
    const Microfrontend = Navspa.importer<DekoratørProps>(appName);

    const [status, setStatus] = useState<Status>(
        loadjs.isDefined(appName) ? Status.Klar : Status.LasterNed
    );

    useEffect(() => {
        const loadAssets = async (staticPaths: string[]) => {
            try {
                await loadjs(staticPaths, appName, {
                    returnPromise: true,
                });

                setStatus(Status.Klar);
            } catch (e) {
                setStatus(Status.Feil);
            }
        };

        if (!loadjs.isDefined(appName)) {
            loadAssets(hentAssets());
        }
    }, []);

    const className = import.meta.env.VITE_MOCK ? css.mocket : undefined;

    if (status === Status.LasterNed) {
        return <div className={css.placeholder} />;
    } else if (status === Status.Klar) {
        return (
            <div className={className}>
                <Microfrontend
                    appname="Rekrutteringsbistand"
                    useProxy={true}
                    enhet={{
                        initialValue: navKontor,
                        display: EnhetDisplay.ENHET_VALG,
                        onChange: onNavKontorChange,
                        ignoreWsEvents: true,
                    }}
                    toggles={{
                        visVeileder: true,
                    }}
                />
            </div>
        );
    } else {
        return <span>Klarte ikke å laste inn Modia-dekoratør</span>;
    }
};

export default Modiadekoratør;
