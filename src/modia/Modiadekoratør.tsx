import React, { FunctionComponent } from 'react';
import { AsyncNavspa } from '@navikt/navspa';

import DekoratørProps, { EnhetDisplay } from './DekoratørProps';
import assetManifestParser from '../microfrontends/assetManifestUtils';
import './Modiadekoratør.less';

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? 'https://internarbeidsflatedecorator.nais.adeo.no'
        : 'https://navikt.github.io';

type Props = {
    navKontor: string | null;
    onNavKontorChange: (navKontor: string) => void;
};

const Modiadekoratør: FunctionComponent<Props> = ({ navKontor, onNavKontorChange }) => (
    <div className={`modiadekoratør${process.env.REACT_APP_MOCK ? ' modiadekoratør--mocket' : ''}`}>
        <AsyncModiadekoratør
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

const AsyncModiadekoratør = AsyncNavspa.importer<DekoratørProps>({
    appName: 'internarbeidsflatefs',
    appBaseUrl: `${baseUrl}/internarbeidsflatedecorator/v2.1`,
    assetManifestParser: assetManifestParser(baseUrl),
    loader: <div className="modiadekoratør__placeholder" />,
});

export default Modiadekoratør;
