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
    vis?: boolean;
};

type RenderApp = (element: HTMLElement, props: Object) => void;
type UnmountApp = (element: HTMLElement) => void;

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

const Microfrontend: Props = ({ vis = true, appName, appPath, appProps = {} }) => {
    const appRef = useRef<HTMLDivElement | null>(null);
    const [status, setStatus] = useState<AppStatus>(AppStatus.LasterNedAssets);

    useAssetsFromManifest(appName, appPath, vis, setStatus);

    useEffect(() => {
        const hentScope = () => (window as any)[appName];

        const renderApp = (element: HTMLElement) => {
            const render: RenderApp = hentScope().render;

            if (render) {
                render(element, appProps);
            } else {
                setStatus(AppStatus.FeilMedAssets);
                loggFeilmeldingKunneIkkeRendre(appName);
            }
        };

        const unmountApp = (element: HTMLElement) => {
            const unmount: UnmountApp = hentScope().unmount;

            if (unmount) {
                unmount(element);
            } else {
                setStatus(AppStatus.FeilMedAssets);
                loggFeilmeldingKunneIkkeUnmounte(appName);
            }
        };

        if (appRef.current && status === AppStatus.KlarTilVisning) {
            if (vis) {
                renderApp(appRef.current);
            } else {
                unmountApp(appRef.current);
            }
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

    if (status === AppStatus.KlarTilVisning) {
        return <div id={appName} ref={appRef} />;
    }

    return null;
};

const loggFeilmeldingKunneIkkeRendre = (appName: string) => {
    console.error(`Kunne ikke rendre app, fant ingen funksjon på window['${appName}'].render`);
};

const loggFeilmeldingKunneIkkeUnmounte = (appName: string) => {
    console.error(`Kunne ikke unmounte app, fant ingen funksjon på window['${appName}'].unmount`);
};

export default Microfrontend;
