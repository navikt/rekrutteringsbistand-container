import { expect, test } from '@jest/globals';
import { generaliserPath } from './path';

test('generaliserPath erstatter kandidatnumre med en placeholder', () => {
    expect(generaliserPath('/kandidater/kandidat/AB123456')).toBe(
        '/kandidater/kandidat/<kandidatnr>'
    );

    expect(generaliserPath('/kandidater/kandidat/AB123456/cv')).toBe(
        '/kandidater/kandidat/<kandidatnr>/cv'
    );

    expect(generaliserPath('/kandidater/kandidat/PAMabcdefghi')).toBe(
        '/kandidater/kandidat/<kandidatnr>'
    );

    expect(generaliserPath('/kandidater/kandidat/PAM23/cv')).toBe(
        '/kandidater/kandidat/<kandidatnr>/cv'
    );
});

test('generaliserPath erstatter uuid-er med en placeholder', () => {
    expect(
        generaliserPath('/kandidater/lister/detaljer/3e30787a-869e-42f0-8386-b9caee3ee4e8')
    ).toBe('/kandidater/lister/detaljer/<uuid>');

    expect(generaliserPath('/stillinger/stilling/11d8040f-1396-49a1-a958-efa099688530')).toBe(
        '/stillinger/stilling/<uuid>'
    );
});
