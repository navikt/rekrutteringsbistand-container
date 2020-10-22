import React from 'react';
import loadjs from 'loadjs';
import NAVSPA from '@navikt/navspa';

enum AssetLoadState {
    LOADING_ASSETS,
    ASSETS_LOADED,
    FAILED_TO_LOAD_ASSETS,
}

interface AssetManifest {
    files: { [k: string]: string };
}

interface AsyncNAVSPAState {
    loadState: AssetLoadState;
}

interface AsyncNAVSPAProps<PROPS> {
    applicationName: string;
    applicationBaseUrl: string;
    spaProps?: PROPS;
}

function joinUrlWithPath(url: string, path: string): string {
    const cleanedUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
    const cleanedPath = path.startsWith('/') ? path.substring(1, path.length) : path;
    return cleanedUrl + '/' + cleanedPath;
}

function createAssetManifestUrl(applicationBaseUrl: string): string {
    return joinUrlWithPath(applicationBaseUrl, 'asset-manifest.json');
}

function fetchAssetManifest(url: string): Promise<AssetManifest> {
    return fetch(url).then((res) => res.json());
}

function extractPathsToLoadFromManifest(manifest: AssetManifest): string[] {
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
}

export class Microfrontend<PROPS = {}> extends React.Component<
    AsyncNAVSPAProps<PROPS>,
    AsyncNAVSPAState
> {
    private AsyncApp: any;

    constructor(props: AsyncNAVSPAProps<PROPS>) {
        super(props);
        this.AsyncApp = NAVSPA.importer(props.applicationName);

        if (!loadjs.isDefined(props.applicationName)) {
            this.state = { loadState: AssetLoadState.LOADING_ASSETS };

            fetchAssetManifest(createAssetManifestUrl(props.applicationBaseUrl))
                .then((manifest) => {
                    const pathsToLoad = extractPathsToLoadFromManifest(manifest);
                    loadjs(pathsToLoad, props.applicationName);
                })
                .catch(() => this.setState({ loadState: AssetLoadState.FAILED_TO_LOAD_ASSETS }));

            loadjs.ready(props.applicationName, {
                success: () => this.setState({ loadState: AssetLoadState.ASSETS_LOADED }),
                error: () => this.setState({ loadState: AssetLoadState.FAILED_TO_LOAD_ASSETS }),
            });
        } else {
            this.state = { loadState: AssetLoadState.ASSETS_LOADED };
        }
    }

    render() {
        if (this.state.loadState === AssetLoadState.LOADING_ASSETS) {
            return <div>{`Laster inn app "${this.props.applicationName}" ...`}</div>;
        } else if (this.state.loadState === AssetLoadState.FAILED_TO_LOAD_ASSETS) {
            return <div>{'Klarte ikke å laste inn ' + this.props.applicationName}</div>;
        }

        const spaProps = this.props.spaProps || {};

        return <this.AsyncApp {...spaProps} />;
    }
}