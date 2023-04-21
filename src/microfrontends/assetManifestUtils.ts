import { Asset, ManifestObject } from '@navikt/navspa/dist/async/async-navspa';

export type CraAssetManifest = {
    files: Record<string, string>;
    entrypoints: string[];
};

export type ViteAssetManifest = Record<
    string,
    {
        file: string;
        css: string[];
        assets?: string[];
    }
>;

export const craAssetManifestParser = (manifestObject: ManifestObject): Asset[] => {
    const pathsToLoad: string[] = [];

    const { files, entrypoints } = manifestObject as CraAssetManifest;

    if (files == null || typeof files !== 'object' || !Array.isArray(entrypoints)) {
        throw new Error('Invalid manifest: ' + JSON.stringify(manifestObject));
    }

    const fileList = Object.entries(files).map(([name, path]) => ({
        name,
        path,
    }));

    entrypoints.forEach((entrypoint) => {
        const matchingFile = fileList.find((file) => file.path.endsWith(entrypoint));

        if (matchingFile) {
            pathsToLoad.push(matchingFile.path);
        } else {
            console.warn('Fant ikke fil i asset-manifest for entrypoint ' + entrypoint);
        }
    });

    const environmentFile = fileList.find((file) => file.name === 'env.js');
    if (environmentFile) {
        pathsToLoad.push(environmentFile.path);
    }

    return pathsToLoad.map((path) => ({ path }));
};

/* Parser for default-manifestet generert av Vite */
export const viteAssetManifestParser =
    (appBaseUrl: string = '') =>
    (manifestObject: ViteAssetManifest): Asset[] => {
        const { file, css, assets } = manifestObject['index.html'];

        const script = { type: 'module', path: `/${appBaseUrl}/${file}` };
        const styles = css.map((path) => ({ path: `/${appBaseUrl}/${path}` }));
        const otherAssets = (assets ?? []).map((path) => ({ path: `/${appBaseUrl}/${path}` }));

        return [script, ...styles, ...otherAssets];
    };
