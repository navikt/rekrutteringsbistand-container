import { useEffect } from 'react';
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

const useAssetsFromManifest = (
    appName: string,
    extraPaths: string[],
    setStatus: (status: AppStatus) => void,
    appPath?: string
) => {
    useEffect(() => {
        const loadAssets = async () => {
            if (appName && !loadjs.isDefined(appName)) {
                try {
                    let pathsToLoad: string[] = [];
                    if (appPath) {
                        const manifest = await fetchAssetManifest(createAssetManifestUrl(appPath));
                        pathsToLoad = extractPathsToLoadFromManifest(manifest);
                    }
                    pathsToLoad = [...pathsToLoad, ...extraPaths];
                    console.log('hhhh', appName, pathsToLoad);

                    loadjs(pathsToLoad, appName);
                } catch (e) {
                    setStatus(AppStatus.FeilUnderNedlasting);
                }

                loadjs.ready(appName, {
                    success: () => setStatus(AppStatus.KlarTilVisning),
                    error: () => setStatus(AppStatus.FeilUnderNedlasting),
                });
            } else {
                setStatus(AppStatus.KlarTilVisning);
            }
        };

        loadAssets();
    }, [appName, appPath, extraPaths, setStatus]);
};

export default useAssetsFromManifest;
