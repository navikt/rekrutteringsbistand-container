import NAVSPA from '@navikt/navspa';
import React, { FunctionComponent, MutableRefObject, useEffect, useRef, useState } from 'react';
import useAssetsFromManifest from './useAssetsFromManifest';

export enum AppStatus {
    LasterNedAssets,
    FeilUnderNedlasting,
    FeilMedAssets,
    KlarTilVisning,
    Rendered,
}

export type MicrofrontendProps<AppProps> = {
    appName: string;
    appPath: string;
    appProps?: AppProps;
    vis?: boolean;
};

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

const Microfrontend: Props = ({ vis = true, appName, appPath, appProps = {} }) => {
    const [status, setStatus] = useState<AppStatus>(AppStatus.LasterNedAssets);
    let appRef: MutableRefObject<React.ComponentType | undefined> = useRef(undefined);

    useAssetsFromManifest(appName, appPath, vis, setStatus);

    useEffect(() => {
        if (vis && status === AppStatus.KlarTilVisning) {
            const app = NAVSPA.importer(appName);

            appRef.current = app;
            setStatus(AppStatus.Rendered);
        }
    }, [vis, status, appName, appProps]);

    if (vis) {
        if (status === AppStatus.LasterNedAssets) {
            return <div>{`Laster inn app "${appName}" ...`}</div>;
        } else if (status === AppStatus.FeilUnderNedlasting) {
            return <div>{'Klarte ikke å laste inn ' + appName}</div>;
        } else if (status === AppStatus.FeilMedAssets) {
            return <div>{'Klarte ikke å vise ' + appName}</div>;
        }
    }

    const App = appRef.current;

    if (vis && status === AppStatus.Rendered && App) {
        return <App {...appProps} />;
    }

    return null;
};

export default Microfrontend;
