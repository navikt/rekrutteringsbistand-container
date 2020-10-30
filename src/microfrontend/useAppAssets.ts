import { useEffect, useState } from 'react';
import loadjs from 'loadjs';
import { AppStatus } from './Microfrontend';

export type AssetManifest = {
    files: Record<string, string>;
};

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
    const [status, setStatus] = useState<AppStatus>(
        loadjs.isDefined(appName) ? AppStatus.KlarTilVisning : AppStatus.LasterNedAssets
    );

    useEffect(() => {
        const loadAppFromManifest = async (pathToManifest: string) => {
            try {
                const manifest = await fetchAssetManifest(createAssetManifestUrl(pathToManifest));
                const pathsToLoad = extractPathsToLoadFromManifest(manifest);

                await loadjs(pathsToLoad, appName, {
                    returnPromise: true,
                });

                setStatus(AppStatus.KlarTilVisning);
            } catch (e) {
                setStatus(AppStatus.FeilUnderNedlasting);
            }
        };

        const loadDefinedAssets = async (staticPaths: string[]) => {
            try {
                await loadjs(staticPaths, appName, {
                    returnPromise: true,
                });

                setStatus(AppStatus.KlarTilVisning);
            } catch (e) {
                setStatus(AppStatus.FeilUnderNedlasting);
            }
        };

        if (!loadjs.isDefined(appName)) {
            pathToManifest ? loadAppFromManifest(pathToManifest) : loadDefinedAssets(staticPaths);
        }
    }, [appName, staticPaths, pathToManifest]);

    return status;
};

export default useAppAssets;
