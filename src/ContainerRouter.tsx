import { FunctionComponent, ReactNode, useLayoutEffect, useState } from 'react';
import { History } from 'history';
import { Router } from 'react-router-dom';

type ContainerRouterProps = {
    history: History;
    children: ReactNode;
};

const ContainerRouter: FunctionComponent<ContainerRouterProps> = ({ history, children }) => {
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });

    useLayoutEffect(() => history.listen(setState), [history]);

    return (
        <Router
            children={children}
            location={state.location}
            navigationType={state.action}
            navigator={history}
        />
    );
};

export default ContainerRouter;
