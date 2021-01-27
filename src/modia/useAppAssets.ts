import { useEffect, useState } from 'react';
import loadjs from 'loadjs';

export enum AssetStatus {
    LasterNed,
    Klar,
    Feil,
}

const useAppAssets = (appName: string, staticPaths: string[]) => {
    const [status, setStatus] = useState<AssetStatus>(
        loadjs.isDefined(appName) ? AssetStatus.Klar : AssetStatus.LasterNed
    );

    useEffect(() => {
        const loadAssets = async (staticPaths: string[]) => {
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
            loadAssets(staticPaths);
        }
    }, [appName, staticPaths]);

    return status;
};

export default useAppAssets;
