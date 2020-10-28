import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import useAssetsFromManifest from './useAssetsFromManifest';

export enum AppStatus {
    LasterNedAssets,
    KlarTilVisning,
    FeilUnderNedlasting,
    FeilMedAssets,
}

export type MicrofrontendProps<AppProps> = {
    appName: string;
    appPath: string;
    appProps?: AppProps;
};

type RenderApp = (element: HTMLElement, props: Object) => void;

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

const Microfrontend: Props = ({ appName, appPath, appProps = {} }) => {
    const appRef = useRef<HTMLDivElement | null>(null);
    const [status, setStatus] = useState<AppStatus>(AppStatus.LasterNedAssets);

    useAssetsFromManifest(appName, appPath, setStatus);

    useEffect(() => {
        if (appRef.current && status === AppStatus.KlarTilVisning) {
            const render: RenderApp = (global as any).NAVSPA[appName];

            if (render) {
                render(appRef.current, appProps);
            } else {
                setStatus(AppStatus.FeilMedAssets);
                loggFeilmeldingKunneIkkeRendre(appName);
            }
        }
    }, [status, appName, appProps]);

    if (status === AppStatus.LasterNedAssets) {
        return <div>{`Laster inn app "${appName}" ...`}</div>;
    } else if (status === AppStatus.FeilUnderNedlasting) {
        return <div>{'Klarte ikke å laste inn ' + appName}</div>;
    } else if (status === AppStatus.FeilMedAssets) {
        return <div>{'Klarte ikke å vise ' + appName}</div>;
    } else if (status === AppStatus.KlarTilVisning) {
        return <div id={appName} ref={appRef} />;
    } else {
        return null;
    }
};

const loggFeilmeldingKunneIkkeRendre = (appName: string) => {
    console.error(`Kunne ikke rendre app, fant ingen funksjon på window['${appName}'].render`);
};

export default Microfrontend;
