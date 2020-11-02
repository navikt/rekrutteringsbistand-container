import React, { FunctionComponent } from 'react';
import { MicrofrontendProps } from '../Microfrontend';

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

const MocketMicrofrontend: Props = ({ appName, appProps }) => {
    return (
        <div>
            <p>Placeholder for {appName}</p>
            <p>Fikk props:</p>
            <code>{JSON.stringify(appProps, undefined, 4)}</code>
        </div>
    );
};

export default MocketMicrofrontend;
