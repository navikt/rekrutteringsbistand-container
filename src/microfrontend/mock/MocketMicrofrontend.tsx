import React, { FunctionComponent } from 'react';
import { MicrofrontendProps } from '../Microfrontend';

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

const MocketMicrofrontend: Props = ({ appName }) => {
    return <div>Placeholder for {appName}</div>;
};

export default MocketMicrofrontend;
