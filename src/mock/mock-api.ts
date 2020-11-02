import fetchMock, { MockRequest, MockResponse, MockResponseFunction } from 'fetch-mock';

fetchMock.config.fallbackToNetwork = true;

const minIdent = 'A123456';

const url = {
    modiaWebsocket: `wss://veilederflatehendelser-q0.adeo.no/modiaeventdistribution/ws/${minIdent}`,
    modiaContext: `/modiacontextholder/api/context`,
    modiaAktivEnhet: `/modiacontextholder/api/context/aktivenhet`,
    modiaDecorator: `/modiacontextholder/api/decorator`,
};

const aktivEnhetOgBruker = { aktivBruker: null, aktivEnhet: '0239' };
const decorator = {
    ident: minIdent,
    navn: 'Ola Nordmann',
    fornavn: 'Ola',
    etternavn: 'Nordmann',
    enheter: [
        { enhetId: '0239', navn: 'NAV Hurdal' },
        { enhetId: '0425', navn: 'NAV Åsnes' },
        { enhetId: '0604', navn: 'NAV Kongsberg' },
    ],
};

const log = (response: MockResponse | MockResponseFunction) => {
    return (url: string, options: MockRequest) => {
        console.log(
            '%cMOCK %s %s',
            'color: lightgray;',
            options.method || 'GET',
            url,
            typeof response === 'function' ? response(url, options) : response
        );
        return response;
    };
};

fetchMock
    .get(url.modiaAktivEnhet, log(aktivEnhetOgBruker))
    .get(url.modiaDecorator, log(decorator))
    .post(url.modiaContext, log(201));
