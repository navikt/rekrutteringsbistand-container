import React from 'react';
import { Microfrontend } from './Microfrontend';

const MockChildApp = ({
    applicationName,
    vis,
}: {
    applicationName: string;
    applicationBaseUrl: string;
    vis: boolean;
}) => {
    if (!vis) {
        return null;
    }

    return <div>{applicationName}</div>;
};

const ChildApp = window.location.hostname === 'localhost' ? MockChildApp : Microfrontend;

class App extends React.Component {
    state: {
        visning: number;
    };

    constructor(props: any) {
        super(props);

        this.state = {
            visning: 1,
        };
    }

    setVisning = (visning: number) => {
        this.setState({
            visning,
        });
    };

    render = () => (
        <div className="App">
            <header className="App-header">
                <h1>Rekrutteringsbistand-container</h1>
            </header>
            <nav>
                <button onClick={() => this.setVisning(1)}>Statistikk</button>
                <button onClick={() => this.setVisning(2)}>Kandidat</button>
            </nav>
            <main>
                <ChildApp
                    applicationName="rekrutteringsbistand-statistikk"
                    applicationBaseUrl="/statistikk"
                    vis={this.state.visning === 1}
                />
                <ChildApp
                    applicationName="rekrutteringsbistand-kandidat"
                    applicationBaseUrl="/kandidater"
                    vis={this.state.visning === 2}
                />
            </main>
        </div>
    );
}

export default App;
