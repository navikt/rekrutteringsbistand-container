import React, { ReactElement, useRef } from 'react';
import importerMicrofrontend from './importerMicrofrontend';
import useAppAssets, { AssetStatus } from './useAppAssets';

export type MicrofrontendProps<AppProps> = {
    appName: string;
    appProps?: AppProps;
    staticPaths: string[];
    placeholder: ReactElement;
};

function OldMicrofrontend<AppProps>(props: MicrofrontendProps<AppProps>): ReactElement | null {
    const { appName, appProps, staticPaths, placeholder } = props;

    const microfrontend = useRef<React.ComponentType>(importerMicrofrontend(appName));
    const status = useAppAssets(appName, staticPaths);

    if (status === AssetStatus.LasterNed) {
        return placeholder;
    } else if (status === AssetStatus.Feil) {
        return null;
    } else if (status === AssetStatus.Klar) {
        const App = microfrontend.current;

        return <App {...(appProps || {})} />;
    } else {
        return null;
    }
}

export default OldMicrofrontend;
