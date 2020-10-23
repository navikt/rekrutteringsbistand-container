import React from 'react';

const MocketMicrofrontend = ({
    applicationName,
    vis,
}: {
    applicationName: string;
    applicationBaseUrl: string;
    vis: boolean;
}) => {
    return <div style={vis ? {} : { display: 'none' }}>{applicationName}</div>;
};

export default MocketMicrofrontend;
