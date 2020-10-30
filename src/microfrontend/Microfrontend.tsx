import React, { useRef } from 'react';
import importerApp from './importerApp';
import useAppAssets from './useAppAssets';

export enum AppStatus {
    LasterNedAssets,
    KlarTilVisning,
    FeilUnderNedlasting,
    FeilMedAssets,
}

export type MicrofrontendProps<AppProps> = {
    appName: string;
    appPath?: string;
    appProps?: AppProps;
    staticPaths?: string[];
    brukNavspa?: boolean;
};

function Microfrontend<AppProps>(props: MicrofrontendProps<AppProps>) {
    const { appName, brukNavspa, appPath, staticPaths, appProps = {} } = props;

    const microfrontend = useRef<React.ComponentType>(importerApp(appName, brukNavspa));
    const status = useAppAssets(appName, staticPaths, appPath);

    if (status === AppStatus.LasterNedAssets) {
        return <div>{`Laster inn app "${appName}" ...`}</div>;
    } else if (status === AppStatus.FeilUnderNedlasting) {
        return <div>{'Klarte ikke å laste inn ' + appName}</div>;
    } else if (status === AppStatus.FeilMedAssets) {
        return <div>{'Klarte ikke å vise ' + appName}</div>;
    } else if (status === AppStatus.KlarTilVisning) {
        const App = microfrontend.current;

        return <App {...appProps} />;
    } else {
        return null;
    }
}

export default Microfrontend;
