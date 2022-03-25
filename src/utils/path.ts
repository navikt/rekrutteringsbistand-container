const uuidRegex = /\/[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}/;
const arenaKandidatnrRegex = /\/[a-zA-Z]{2}[0-9]+/;
const pamKandidatnrRegex = /\/PAM[0-9a-zA-Z]+/;

export const generaliserPath = (path: string) => {
    return path
        .replace(uuidRegex, '/<uuid>')
        .replace(arenaKandidatnrRegex, '/<kandidatnr>')
        .replace(pamKandidatnrRegex, '/<kandidatnr>');
};
