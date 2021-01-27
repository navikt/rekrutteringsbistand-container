import React, { FunctionComponent, useEffect, useState } from 'react';
import Navspa from '@navikt/navspa';
import loadjs from 'loadjs';

import DekoratørProps, { EnhetDisplay } from './DekoratørProps';
import './Modiadekoratør.less';

const appName = 'internarbeidsflatefs';

const urlPrefix =
    process.env.NODE_ENV === 'production'
        ? 'https://internarbeidsflatedecorator.nais.adeo.no'
        : 'https://navikt.github.io';

const erMocket = process.env.REACT_APP_MOCK;

type Props = {
    navKontor: string | null;
    onNavKontorChange: (navKontor: string) => void;
};

export enum Status {
    LasterNed,
    Klar,
    Feil,
}

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
            loadAssets([
                `${urlPrefix}/internarbeidsflatedecorator/v2.1/static/js/head.v2.min.js`,
                `${urlPrefix}/internarbeidsflatedecorator/v2.1/static/css/main.css`,
            ]);
        }
    }, []);

    if (status === Status.LasterNed) {
        return <div className="modiadekoratør__placeholder" />;
    } else if (status === Status.Feil) {
        return null;
    } else if (status === Status.Klar) {
        return (
            <div className={`modiadekoratør${erMocket ? ' modiadekoratør--mocket' : ''}`}>
                <Microfrontend
                    appname="Rekrutteringsbistand"
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
        return null;
    }
};

export default Modiadekoratør;
