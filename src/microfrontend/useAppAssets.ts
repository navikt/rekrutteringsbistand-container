import { useEffect, useState } from 'react';
import loadjs from 'loadjs';

export type AssetManifest = {
    files: Record<string, string>;
};

export enum AssetStatus {
    LasterNed,
    Klar,
    Feil,
}

const joinUrlWithPath = (url: string, path: string): string => {
    const cleanedUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
    const cleanedPath = path.startsWith('/') ? path.substring(1, path.length) : path;
    return cleanedUrl + '/' + cleanedPath;
};

const createAssetManifestUrl = (appPath: string): string => {
    return joinUrlWithPath(appPath, 'asset-manifest.json');
};

const fetchAssetManifest = async (url: string): Promise<AssetManifest> => {
    const manifest = await fetch(url);
    return manifest.json();
};

const extractPathsToLoadFromManifest = (manifest: AssetManifest): string[] => {
    const pathsToLoad: string[] = [];
    const unnecessaryFiles = ['runtime-main', 'service-worker', 'precache-manifest'];

    Object.entries(manifest.files).forEach(([_, path]) => {
        const isCssOrJs = path.endsWith('.js') || path.endsWith('.css');
        const isUnnecessary = unnecessaryFiles.find((filePath) => path.includes(filePath));

        if (isCssOrJs && !isUnnecessary) {
            pathsToLoad.push(path);
        }
    });

    return pathsToLoad;
};

const useAppAssets = (appName: string, staticPaths: string[] = [], pathToManifest?: string) => {
    const [status, setStatus] = useState<AssetStatus>(
        loadjs.isDefined(appName) ? AssetStatus.Klar : AssetStatus.LasterNed
    );

    useEffect(() => {
        const loadAppFromManifest = async (pathToManifest: string) => {
            try {
                const manifest = await fetchAssetManifest(createAssetManifestUrl(pathToManifest));
                const pathsToLoad = extractPathsToLoadFromManifest(manifest);

                await loadjs(pathsToLoad, appName, {
                    returnPromise: true,
                });

                setStatus(AssetStatus.Klar);
            } catch (e) {
                setStatus(AssetStatus.Feil);
            }
        };

        const loadDefinedAssets = async (staticPaths: string[]) => {
            try {
                await loadjs(staticPaths, appName, {
                    returnPromise: true,
                });

                setStatus(AssetStatus.Klar);
            } catch (e) {
                setStatus(AssetStatus.Feil);
            }
        };

        if (!loadjs.isDefined(appName)) {
            pathToManifest ? loadAppFromManifest(pathToManifest) : loadDefinedAssets(staticPaths);
        }
    }, [appName, staticPaths, pathToManifest]);

    return status;
};

export default useAppAssets;
