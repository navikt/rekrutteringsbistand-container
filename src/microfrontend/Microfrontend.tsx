import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { ReactElement, useRef } from 'react';
import importerMicrofrontend from './importerMicrofrontend';
import useAppAssets, { AssetStatus } from './useAppAssets';
import './Microfrontend.less';

export type MicrofrontendProps<AppProps> = {
    appName: string;
    appPath?: string;
    appProps?: AppProps;
    staticPaths?: string[];
    brukNavspa?: boolean;
    placeholder?: ReactElement;
    visSpinner?: boolean;
};

function Microfrontend<AppProps>(props: MicrofrontendProps<AppProps>): ReactElement | null {
    const {
        appName,
        appPath,
        appProps,
        staticPaths,
        brukNavspa,
        placeholder,
        visSpinner = true,
    } = props;

    const microfrontend = useRef<React.ComponentType>(importerMicrofrontend(appName, brukNavspa));
    const status = useAppAssets(appName, staticPaths, appPath);

    if (status === AssetStatus.LasterNed) {
        if (placeholder) {
            return placeholder;
        } else if (visSpinner) {
            return (
                <div className="microfrontend__spinner">
                    <NavFrontendSpinner />
                </div>
            );
        } else {
            return null;
        }
    } else if (status === AssetStatus.Feil) {
        return <div>{'Klarte ikke å laste inn ' + appName}</div>;
    } else if (status === AssetStatus.Klar) {
        const App = microfrontend.current;

        return <App {...(appProps || {})} />;
    } else {
        return null;
    }
}

export default Microfrontend;
