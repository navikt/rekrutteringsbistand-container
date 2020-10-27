import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import loadjs from 'loadjs';
import {
    createAssetManifestUrl,
    extractPathsToLoadFromManifest,
    fetchAssetManifest,
} from './assetsUtils';

enum Status {
    LasterNedAssets,
    KlarTilVisning,
    FeilUnderNedlasting,
}

export type MicrofrontendProps<AppProps> = {
    appName: string;
    appPath: string;
    appProps?: AppProps;
    vis?: boolean;
};

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

export const Microfrontend: Props = ({ vis = true, appName, appPath, appProps = {} }) => {
    const appRef = useRef<HTMLDivElement | null>(null);
    const [status, setStatus] = useState<Status>(Status.LasterNedAssets);

    useEffect(() => {
        const hentScope = () => (window as any)[appName];

        const renderApp = (element: HTMLElement) => {
            const render: (element: HTMLElement, props: Object) => void = hentScope().render;

            if (render) {
                render(element, appProps);
            } else {
                setStatus(Status.FeilUnderNedlasting);
                console.error(
                    `Kunne ikke rendre app, fant ingen funksjon på window['${appName}'].render`
                );
            }
        };

        const unmountApp = (element: HTMLElement) => {
            const unmount: (element: HTMLElement) => void = hentScope().unmount;

            if (unmount) {
                unmount(element);
            } else {
                setStatus(Status.FeilUnderNedlasting);
                console.error(
                    `Kunne ikke unmounte app, fant ingen funksjon på window['${appName}'].render`
                );
            }
        };

        if (appRef.current && status === Status.KlarTilVisning) {
            if (vis) {
                renderApp(appRef.current);
            } else {
                unmountApp(appRef.current);
            }
        }
    }, [vis, status, appName, appProps]);

    useEffect(() => {
        if (vis) {
            const loadAssets = async (appName: string, appPath: string) => {
                if (!loadjs.isDefined(appName)) {
                    try {
                        const manifest = await fetchAssetManifest(createAssetManifestUrl(appPath));
                        const pathsToLoad = extractPathsToLoadFromManifest(manifest);

                        loadjs(pathsToLoad, appName);
                    } catch (e) {
                        setStatus(Status.FeilUnderNedlasting);
                    }

                    loadjs.ready(appName, {
                        success: () => setStatus(Status.KlarTilVisning),
                        error: () => setStatus(Status.FeilUnderNedlasting),
                    });
                } else {
                    setStatus(Status.KlarTilVisning);
                }
            };

            loadAssets(appName, appPath);
        }
    }, [appName, appPath, vis]);

    if (vis) {
        if (status === Status.LasterNedAssets) {
            return <div>{`Laster inn app "${appName}" ...`}</div>;
        } else if (status === Status.FeilUnderNedlasting) {
            return <div>{'Klarte ikke å laste inn ' + appName}</div>;
        }
    }

    if (status === Status.KlarTilVisning) {
        return <div id={appName} ref={appRef} />;
    }

    return null;
};
