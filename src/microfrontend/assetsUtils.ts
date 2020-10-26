export type AssetManifest = {
    files: Record<string, string>;
};

const joinUrlWithPath = (url: string, path: string): string => {
    const cleanedUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
    const cleanedPath = path.startsWith('/') ? path.substring(1, path.length) : path;
    return cleanedUrl + '/' + cleanedPath;
};

export const createAssetManifestUrl = (appPath: string): string => {
    return joinUrlWithPath(appPath, 'asset-manifest.json');
};

export const fetchAssetManifest = async (url: string): Promise<AssetManifest> => {
    const manifest = await fetch(url);
    return manifest.json();
};

export const extractPathsToLoadFromManifest = (manifest: AssetManifest): string[] => {
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
