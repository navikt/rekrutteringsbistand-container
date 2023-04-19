export type SearchQuery = {
    query: {
        bool?: {
            must?: Array<{
                bool?: {
                    should?: Array<{
                        term?: {
                            [felt: string]: string;
                        };
                    }>;
                };
            }>;
        };
    };
};
