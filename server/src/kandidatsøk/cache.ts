const EN_TIME = 1000 * 60 * 60;

type NavIdent = string;
type CachetTilgang = {
    expires: Date;
};

class TilgangCache {
    cache: Partial<Record<NavIdent, CachetTilgang>> = {};

    clear = () => {
        this.cache = {};
    };

    lagreTilgang = (navIdent: string) => {
        const omEnTime = new Date(Date.now() + EN_TIME);

        this.cache[navIdent] = {
            expires: omEnTime,
        };
    };

    hentTilgang = (navIdent: string) => {
        const tilgang = this.cache[navIdent];
        return tilgang && this.erGyldig(tilgang);
    };

    erGyldig = (tilgang: CachetTilgang) => {
        return tilgang.expires >= new Date();
    };
}

export default TilgangCache;
