import React, { FunctionComponent } from 'react';
import DekoratørProps, { EnhetDisplay } from './DekoratørProps';
import Microfrontend from '../microfrontend/Microfrontend';
import './Modiadekoratør.less';

const urlPrefix =
    process.env.NODE_ENV === 'production'
        ? 'https://internarbeidsflatedecorator.nais.adeo.no'
        : 'https://navikt.github.io';

const erMocket = process.env.REACT_APP_MOCK;

type Props = {
    navKontor: string | null;
    onNavKontorChange: (navKontor: string) => void;
};

const Placeholder = () => <div className="modiadekoratør__placeholder" />;

const Modiadekoratør: FunctionComponent<Props> = ({ navKontor, onNavKontorChange }) => (
    <div className={`modiadekoratør${erMocket ? ' modiadekoratør--mocket' : ''}`}>
        <Microfrontend<DekoratørProps>
            brukNavspa
            appName="internarbeidsflatefs"
            placeholder={<Placeholder />}
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
    </div>
);

export default Modiadekoratør;
