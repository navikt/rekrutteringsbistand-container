import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import React, { FunctionComponent } from 'react';
import './KunneIkkeLaste.less';

type Props = {
    appName: string;
};

const KunneIkkeLaste: FunctionComponent<Props> = ({ appName }) => (
    <div className="kunne-ikke-laste">
        <div className="kunne-ikke-laste">
            <AlertStripeFeil>Klarte ikke å laste inn {appName}</AlertStripeFeil>
        </div>
    </div>
);

export default KunneIkkeLaste;
