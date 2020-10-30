import React, { FunctionComponent, useState } from 'react';
import DekoratørProps, { EnhetDisplay } from './DekoratørProps';
import Microfrontend from '../microfrontend/Microfrontend';

const urlPrefix =
    process.env.NODE_ENV === 'production'
        ? 'https://internarbeidsflatedecorator.nais.adeo.no'
        : 'https://navikt.github.io';

const Modiadekoratør: FunctionComponent = () => {
    const [valgtNavKontor, setValgtNavKontor] = useState<string | null>(null);

    return (
        <Microfrontend<DekoratørProps>
            brukNavspa
            appName="internarbeidsflatefs"
            extraPaths={[
                `${urlPrefix}/internarbeidsflatedecorator/v2.1/static/js/head.v2.min.js`,
                `${urlPrefix}/internarbeidsflatedecorator/v2.1/static/css/main.css`,
            ]}
            appProps={{
                appname: 'Rekrutteringsbistand',
                enhet: {
                    initialValue: valgtNavKontor,
                    display: EnhetDisplay.ENHET_VALG,
                    onChange: setValgtNavKontor,
                },
                toggles: {
                    visVeileder: true,
                },
            }}
        />
    );
};

export default Modiadekoratør;
