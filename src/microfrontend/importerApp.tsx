import React, { FunctionComponent, useEffect, useRef } from 'react';

function importerApp<Props>(name: string, brukNavspa?: boolean): FunctionComponent<Props> {
    const App: FunctionComponent<Props> = (props) => {
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            let render, unmount: any;

            if (brukNavspa) {
                render = (global as any).NAVSPA[name];
            } else {
                const app = (window as any)[name];
                render = app ? app.render : undefined;
                unmount = app ? app.unmount : undefined;
            }

            if (render) {
                render(ref.current, props);
            } else {
                console.error('App ikke funnet:', name);
            }

            const unmountedRef = ref.current;

            return () => {
                if (unmount) {
                    unmount(unmountedRef);
                }
            };
        }, [props]);

        return <div ref={ref} />;
    };

    return App;
}

export default importerApp;
