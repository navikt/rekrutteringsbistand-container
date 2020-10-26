import React, { FunctionComponent, MutableRefObject, useEffect, useRef, useState } from 'react';
import loadjs from 'loadjs';
import {
    createAssetManifestUrl,
    extractPathsToLoadFromManifest,
    fetchAssetManifest,
} from './assetsUtils';
import NAVSPA from '@navikt/navspa';

enum Steg {
    LasterNed,
    Nedlastet,
    Importert,
    Feil,
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
    const [innlasting, setInnlasting] = useState<Steg>(Steg.LasterNed);

    let appRef: MutableRefObject<React.ComponentType | undefined> = useRef(undefined);

    useEffect(() => {
        if (innlasting === Steg.Nedlastet) {
            NAVSPA.eksporter(appName, (window as any)[appName]);
            appRef.current = NAVSPA.importer(appName);

            setInnlasting(Steg.Importert);
        }
    }, [appName, innlasting]);

    useEffect(() => {
        if (vis) {
            const loadAssets = async (appName: string, appPath: string) => {
                if (!loadjs.isDefined(appName)) {
                    try {
                        const manifest = await fetchAssetManifest(createAssetManifestUrl(appPath));
                        const pathsToLoad = extractPathsToLoadFromManifest(manifest);

                        loadjs(pathsToLoad, appName);
                    } catch (e) {
                        setInnlasting(Steg.Feil);
                    }

                    loadjs.ready(appName, {
                        success: () => setInnlasting(Steg.Nedlastet),
                        error: () => setInnlasting(Steg.Feil),
                    });
                } else {
                    setInnlasting(Steg.Nedlastet);
                }
            };

            loadAssets(appName, appPath);
        }
    }, [appName, appPath, vis]);

    if (!vis) {
        return null;
    }

    const App = appRef.current;

    if (innlasting === Steg.LasterNed) {
        return <div>{`Laster inn app "${appName}" ...`}</div>;
    } else if (innlasting === Steg.Feil) {
        return <div>{'Klarte ikke å laste inn ' + appName}</div>;
    } else if (innlasting === Steg.Importert && App) {
        return <App {...appProps} />;
    } else {
        return null;
    }
};
