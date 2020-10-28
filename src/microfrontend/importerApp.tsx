import React, { FunctionComponent, useEffect, useRef } from 'react';

function importerApp<Props>(name: string): FunctionComponent<Props> {
    const App: FunctionComponent<Props> = (props) => {
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            const render = (window as any)[name].render;
            const unmount = (window as any)[name].unmount;

            if (render) {
                render(ref.current, props);
            }

            const unmountedRef = ref.current;

            return () => {
                unmount(unmountedRef);
            };
        }, [props]);

        return <div ref={ref} />;
    };

    return App;
}

export default importerApp;
