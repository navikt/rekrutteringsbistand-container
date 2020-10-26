import React, { FunctionComponent, MutableRefObject, useEffect, useRef, useState } from 'react';
import loadjs from 'loadjs';
import NAVSPA from '@navikt/navspa';
import {
    createAssetManifestUrl,
    extractPathsToLoadFromManifest,
    fetchAssetManifest,
} from './assetsUtils';

enum AssetLoadState {
    LOADING_ASSETS = 'Loading',
    ASSETS_LOADED = 'Success',
    ASSETS_RENDERED = 'Rendered',
    FAILED_TO_LOAD_ASSETS = 'Failure',
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

    let appRef: MutableRefObject<React.ComponentType | undefined> = useRef(undefined);

    const [loadingState, setLoadingState] = useState<AssetLoadState>(AssetLoadState.LOADING_ASSETS);

    useEffect(() => {
        if (loadingState === AssetLoadState.ASSETS_LOADED) {
            const importertApp = NAVSPA.importer(appName);
            appRef.current = importertApp;

            setLoadingState(AssetLoadState.ASSETS_RENDERED);
        }
    }, [appName, loadingState]);

    useEffect(() => {
        const loadAssets = async (appName: string, appPath: string) => {
            loadjs.reset();

            const appErInnlastet = loadjs.isDefined(appName);

            if (!appErInnlastet) {
                try {
                    const manifest = await fetchAssetManifest(createAssetManifestUrl(appPath));
                    console.log(`Manifest for ${appName}:`, manifest.files);

                    const pathsToLoad = extractPathsToLoadFromManifest(manifest);

                    console.log(`Paths to load for ${appName}:`, pathsToLoad);

                    loadjs(pathsToLoad, appName);
                } catch (e) {
                    setLoadingState(AssetLoadState.FAILED_TO_LOAD_ASSETS);
                }

                loadjs.ready(appName, {
                    success: () => setLoadingState(AssetLoadState.ASSETS_LOADED),
                    error: () => setLoadingState(AssetLoadState.FAILED_TO_LOAD_ASSETS),
                });
            } else {
                setLoadingState(AssetLoadState.ASSETS_LOADED);
            }
        };

        if (vis) {
            loadAssets(appName, appPath);
        }
    }, [appName, appPath, vis]);

    if (!vis) {
        return null;
    }

    const App = appRef.current;

    if (loadingState === AssetLoadState.LOADING_ASSETS) {
        return <div>{`Laster inn app "${appName}" ...`}</div>;
    } else if (loadingState === AssetLoadState.FAILED_TO_LOAD_ASSETS) {
        return <div>{'Klarte ikke å laste inn ' + appName}</div>;
    } else if (loadingState === AssetLoadState.ASSETS_RENDERED && App) {
        return <App {...appProps} />;
    } else {
        return null;
    }
};
