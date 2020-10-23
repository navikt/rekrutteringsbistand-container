import React from 'react';

const MocketMicrofrontend = ({
    applicationName,
    vis,
}: {
    applicationName: string;
    applicationBaseUrl: string;
    vis: boolean;
}) => {
    return <div hidden={!vis}>{applicationName}</div>;
};

export default MocketMicrofrontend;
