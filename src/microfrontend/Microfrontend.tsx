import React, { useRef } from 'react';
import importerMicrofrontend from './importerMicrofrontend';
import useAppAssets, { AssetStatus } from './useAppAssets';

export type MicrofrontendProps<AppProps> = {
    appName: string;
    appPath?: string;
    appProps?: AppProps;
    staticPaths?: string[];
    brukNavspa?: boolean;
    visSpinner?: boolean;
};

function Microfrontend<AppProps>(props: MicrofrontendProps<AppProps>) {
    const { appName, appPath, appProps = {}, staticPaths, brukNavspa, visSpinner } = props;

    const microfrontend = useRef<React.ComponentType>(importerMicrofrontend(appName, brukNavspa));
    const status = useAppAssets(appName, staticPaths, appPath);

    if (status === AssetStatus.LasterNed && visSpinner) {
        return <div>{`Laster inn app "${appName}" ...`}</div>;
    } else if (status === AssetStatus.Feil) {
        return <div>{'Klarte ikke å laste inn ' + appName}</div>;
    } else if (status === AssetStatus.Klar) {
        const App = microfrontend.current;

        return <App {...appProps} />;
    } else {
        return null;
    }
}

export default Microfrontend;
