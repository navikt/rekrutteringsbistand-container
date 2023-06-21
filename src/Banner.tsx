import React from 'react';

export type BannerProps = {
    tekst: string;
};

const Banner = ({ tekst }: BannerProps): JSX.Element => {
    return <div>Banner med tekst {tekst}</div>;
};

export default Banner;
