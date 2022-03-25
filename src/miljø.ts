export enum Miljø {
    DevGcp = 'dev-gcp',
    ProdGcp = 'prod-gcp',
    Lokalt = 'local',
}

export const getMiljø = (): string => {
    const { hostname } = window.location;

    if (hostname.includes('dev.intern.nav.no')) {
        return Miljø.DevGcp;
    } else if (hostname.includes('intern.nav.no')) {
        return Miljø.ProdGcp;
    } else {
        return Miljø.Lokalt;
    }
};

export const erIkkeProd = (): boolean => {
    const pathname = window.location.hostname;
    return pathname.includes('dev.intern.nav.no');
};
