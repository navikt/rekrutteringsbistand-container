import React from 'react';
import ReactDOM from 'react-dom';
import { Microfrontend } from './Microfrontend';

const MockChildApp = ({
    applicationName,
    vis,
}: {
    applicationName: string;
    applicationBaseUrl: string;
    vis: boolean;
}) => {
    return <div hidden={!vis}>{applicationName}</div>;
};

//const ChildApp = window.location.hostname === 'localhost' ? MockChildApp : Microfrontend;

class App extends React.Component {
    state: {
        visning: number;
    };

    constructor(props: any) {
        super(props);

        this.state = {
            visning: 2,
        };
    }

    setVisning = (visning: number) => {
        this.setState({
            visning,
        });
    };

    componentDidUpdate() {
        if (this.state.visning === 1) {
            ReactDOM.render(
                <div>Rekrutteringsbistand-statistikk2</div>,
                document.getElementById('main')
            );
        } else {
            ReactDOM.render(
                <div>Rekrutteringsbistand-kandidat2</div>,
                document.getElementById('main')
            );
        }
    }

    render = () => {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Rekrutteringsbistand-container</h1>
                </header>
                <nav>
                    <button onClick={() => this.setVisning(1)}>Statistikk</button>
                    <button onClick={() => this.setVisning(2)}>Kandidat</button>
                </nav>
                <main id="main"></main>
            </div>
        );
    };
}

export default App;
