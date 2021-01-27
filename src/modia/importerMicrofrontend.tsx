import React, { FunctionComponent, useEffect, useRef } from 'react';

function importerMicrofrontend<Props>(name: string): FunctionComponent<Props> {
    const RenderedMicrofrontend: FunctionComponent<Props> = (props) => {
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            let render = (global as any).NAVSPA[name];

            if (render) {
                render(ref.current, props);
            } else {
                console.error('App ikke funnet:', name);
            }
        }, [props]);

        return <div ref={ref} />;
    };

    return RenderedMicrofrontend;
}

export default importerMicrofrontend;
