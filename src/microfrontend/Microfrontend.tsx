import React, { FunctionComponent, useRef, useState } from 'react';
import useAssetsFromManifest from './useAssetsFromManifest';
import importerApp from './importerApp';

export enum AppStatus {
    LasterNedAssets,
    KlarTilVisning,
    FeilUnderNedlasting,
    FeilMedAssets,
}

export type MicrofrontendProps<AppProps> = {
    appName: string;
    appPath: string;
    extraPaths: string[];
    appProps?: AppProps;
};

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

const Microfrontend: Props = ({ appName, appPath, extraPaths, appProps = {} }) => {
    const [status, setStatus] = useState<AppStatus>(AppStatus.LasterNedAssets);
    const microfrontend = useRef<React.ComponentType>(importerApp(appName));

    useAssetsFromManifest(appName, appPath, extraPaths, setStatus);

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
};

export default Microfrontend;
