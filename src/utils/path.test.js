import { generaliserPath } from './path';

test('generaliserPath erstatter kandidatnumre med en placeholder', () => {
    const pathMedKandidatnummerFraArena = '/kandidater/kandidat/AB123456';
    const pathMedKandidatnummerFraPam = '/kandidater/kandidat/PAMabcdefghi';

    const generalisertPath = '/kandidater/kandidat/<kandidatnr>';

    expect(generaliserPath(pathMedKandidatnummerFraArena)).toBe(generalisertPath);
    expect(generaliserPath(pathMedKandidatnummerFraPam)).toBe(generalisertPath);
});

test('generaliserPath erstatter uuid-er med en placeholder', () => {
    expect(
        generaliserPath('/kandidater/lister/detaljer/3e30787a-869e-42f0-8386-b9caee3ee4e8')
    ).toBe('/kandidater/lister/detaljer/<uuid>');

    expect(generaliserPath('/stillinger/stilling/11d8040f-1396-49a1-a958-efa099688530')).toBe(
        '/stillinger/stilling/<uuid>'
    );
});
