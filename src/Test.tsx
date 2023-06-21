import React, { ReactNode } from 'react';
import { BannerProps } from './Banner';

type Props = {
    navKontor: string | null;
    history: any;
    komponenter: {
        Banner: (props: BannerProps) => JSX.Element;
    };
};

const Test = ({ komponenter }: Props) => {
    const { Banner } = komponenter;

    return (
        <div>
            <h1>hei</h1>
            <Banner tekst="hei" />
        </div>
    );
};

export default Test;
