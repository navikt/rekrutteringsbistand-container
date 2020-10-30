import React, { FunctionComponent } from 'react';
import DekoratørProps, { EnhetDisplay } from './DekoratørProps';
import Microfrontend from '../microfrontend/Microfrontend';

const urlPrefix =
    process.env.NODE_ENV === 'production'
        ? 'https://internarbeidsflatedecorator.nais.adeo.no'
        : 'https://navikt.github.io';

type Props = {
    navKontor: string | null;
    onNavKontorChange: (navKontor: string) => void;
};

const Modiadekoratør: FunctionComponent<Props> = ({ navKontor, onNavKontorChange }) => (
    <Microfrontend<DekoratørProps>
        brukNavspa
        appName="internarbeidsflatefs"
        staticPaths={[
            `${urlPrefix}/internarbeidsflatedecorator/v2.1/static/js/head.v2.min.js`,
            `${urlPrefix}/internarbeidsflatedecorator/v2.1/static/css/main.css`,
        ]}
        appProps={{
            appname: 'Rekrutteringsbistand',
            enhet: {
                initialValue: navKontor,
                display: EnhetDisplay.ENHET_VALG,
                onChange: onNavKontorChange,
                ignoreWsEvents: true,
            },
            toggles: {
                visVeileder: true,
            },
        }}
    />
);

export default Modiadekoratør;
