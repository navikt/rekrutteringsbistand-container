export type SearchQuery = {
    size?: number;
    from?: number;
    track_total_hits?: boolean;
    query: {
        term?: Record<string, string>;
        match?: Record<string, MatchQuery>;
        bool?: object;
        match_all?: object;
        multi_match?: {
            query: string;
            fields: string[];
        };
        filter?: any;
    };
    sort?: {
        [felt: string]: {
            order: Sorteringsrekkefølge;
        };
    };
    _source?: string[] | false;
    aggs?: Aggregeringer;
};

export type Aggregeringer = {
    [aggregering: string]: {
        terms: {
            field: string;
            size?: number;
        };
    };
};

export type Sorteringsrekkefølge = 'asc' | 'desc';

type MatchQuery = {
    query: string;
};
