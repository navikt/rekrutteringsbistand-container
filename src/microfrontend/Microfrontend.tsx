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
    vis: boolean;
};

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

export const Microfrontend: Props = (props) => {
    const { appName, appPath, appProps, vis } = props;

    const appRef = useRef(null);
    const [status, setStatus] = useState<Status>(Status.LasterNedAssets);

    useEffect(() => {
        if (appRef.current && status === Status.KlarTilVisning) {
            const { render, unmount } = (window as any)[appName];

            if (vis) {
                if (render) {
                    render(appRef.current, appProps);
                } else {
                    setStatus(Status.FeilUnderNedlasting);
                    console.error(
                        `Kunne ikke rendre app, fant ingen funksjon på window['${appName}'].render`
                    );
                }
            } else {
                if (unmount) {
                    unmount(appRef.current);
                } else {
                    setStatus(Status.FeilUnderNedlasting);
                    console.error(
                        `Kunne ikke unmounte app, fant ingen funksjon på window['${appName}'].render`
                    );
                }
            }
        }
    }, [vis, appName, appProps, status]);

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
