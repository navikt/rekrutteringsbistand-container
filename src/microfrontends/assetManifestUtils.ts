import { ManifestObject } from '@navikt/navspa/dist/async/async-navspa';

export type AssetManifest = {
    files: Record<string, string>;
};

const assetManifestParser = (optionalBaseUrl?: string) => (manifest: ManifestObject): string[] => {
    const pathsToLoad: string[] = [];
    const unnecessaryFiles = ['runtime-main', 'service-worker', 'precache-manifest'];

    Object.entries(manifest.files as Record<string, string>).forEach(([_, path]) => {
        const isCssOrJs = path.endsWith('.js') || path.endsWith('.css');
        const isUnnecessary = unnecessaryFiles.find((filePath) => path.includes(filePath));

        if (isCssOrJs && !isUnnecessary) {
            const fullPath: string = optionalBaseUrl ? optionalBaseUrl + path : path;

            pathsToLoad.push(fullPath);
        }
    });

    return pathsToLoad;
};

export default assetManifestParser;
