import React, { FunctionComponent } from 'react';
import { MicrofrontendProps } from '../Microfrontend';

type Props<AppProps = {}> = FunctionComponent<MicrofrontendProps<AppProps>>;

const MocketMicrofrontend: Props = ({ appName, vis }) => {
    return vis ? <div>Placeholder for {appName}</div> : null;
};

export default MocketMicrofrontend;
