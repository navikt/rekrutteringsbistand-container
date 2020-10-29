import React, { FunctionComponent, useEffect, useRef } from 'react';

function importerApp<Props>(name: string): FunctionComponent<Props> {
    const App: FunctionComponent<Props> = (props) => {
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            const app = (window as any)[name];
            const render = app ? app.render : undefined;
            const unmount = app ? app.unmount : undefined;

            if (render) {
                render(ref.current, props);
            } else {
                console.log('app ikke funnet', name);
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
