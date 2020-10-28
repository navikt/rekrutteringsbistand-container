import React, { FunctionComponent, useEffect, useRef } from 'react';

function importerApp<Props>(name: string): FunctionComponent<Props> {
    const App: FunctionComponent<Props> = (props) => {
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            const render = (global as any).NAVSPA[name];

            if (render) {
                render(ref.current, props);
            }
        }, [props]);

        return <div ref={ref} />;
    };

    return App;
}

export default importerApp;
