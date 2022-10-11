type NavIdent = string;
type TilgangCache = Record<
    NavIdent,
    {
        utløper: Date;
    }
>;

export let navIdenterMedTilgang: TilgangCache = {};

export const lagreTilgangICache = (navIdent: string) => {
    navIdenterMedTilgang[navIdent] = {
        utløper: new Date(Date.now() + 1000 * 60 * 60),
    };
};

export const hentTilgangICache = (navIdent: string) => {
    const tilgang = navIdenterMedTilgang[navIdent];
    return tilgang && tilgangErFremdelesGyldig(tilgang.utløper);
};

export const tilgangErFremdelesGyldig = (utløper: Date) => {
    return utløper >= new Date();
};

export const slettCache = () => {
    navIdenterMedTilgang = {};
};
