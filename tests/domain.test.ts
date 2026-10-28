import { describe, expect, it } from 'vitest';
import { num, norm, slug, splitName, lotFor, matches, abvTxt, filterBeers, brewStats } from '@/lib/domain';

describe('num', () => {
  it('parse la virgule décimale', () => expect(num('5,5')).toBe(5.5));
  it('parse le point', () => expect(num('8.2')).toBe(8.2));
  it('undefined si vide ou invalide', () => {
    expect(num('')).toBeUndefined();
    expect(num('abc')).toBeUndefined();
    expect(num(undefined)).toBeUndefined();
  });
});

describe('norm / slug', () => {
  it('retire les accents', () => expect(norm('Pils Électrique')).toBe('pils electrique'));
  it('slug', () => expect(slug('Pils Électrique')).toBe('pils-electrique'));
  it('slug avec édition', () => expect(slug('Paul Eph 5:18')).toBe('paul-eph-5-18'));
  it('slug vide → biere', () => expect(slug('  ')).toBe('biere'));
});

describe('splitName', () => {
  it('édition prioritaire', () =>
    expect(splitName({ name: 'Xmas', edition: '2025' })).toEqual(['Xmas', '2025']));
  it('coupe au milieu', () =>
    expect(splitName({ name: 'Hop Overflow' })).toEqual(['Hop', 'Overflow']));
  it('un seul mot → seconde partie vide', () =>
    expect(splitName({ name: 'Paul' })).toEqual(['Paul', '']));
});

describe('lotFor', () => {
  it('L + AA + MM + brassin', () =>
    expect(lotFor({ bottledOn: '07/05/2026', brew: 33 })).toBe('L2605-33'));
  it('date invalide → L—', () => expect(lotFor({ bottledOn: 'bientôt', brew: 33 })).toBe('L—'));
});

describe('matches', () => {
  const b = { name: 'Pils Électrique', edition: '', styleName: 'Pils', denomination: 'Bière lager', malts: 'Pilsner', hops: 'Mosaïc', yeast: 'Diamond', other: 'Eau', brew: 30, lot: 'L2504-30' };
  it('sans accents', () => expect(matches(b, 'electrique')).toBe(true));
  it('multi-termes ET', () => {
    expect(matches(b, 'pils mosaic')).toBe(true);
    expect(matches(b, 'pils citra')).toBe(false);
  });
  it('par numéro', () => expect(matches(b, 'n° 30')).toBe(true));
  it('vide → tout passe', () => expect(matches(b, '  ')).toBe(true));
  it('matches trouve « nelson » via hopSchedule JSON', () => {
    const j = { ...b, hops: '', hopSchedule: JSON.stringify([{ etape: 'Dry hop', nom: 'Nelson Sauvin', qte: '50 g', detail: 'J3' }]) };
    expect(matches(j, 'nelson')).toBe(true);
    expect(matches(j, 'dry')).toBe(false); // seuls les noms entrent dans la recherche
  });
  it('matches trouve un grain via grains JSON', () => {
    const j = { ...b, malts: '', grains: JSON.stringify([{ nom: 'Flocons d’avoine', kg: 0.5 }]) };
    expect(matches(j, 'avoine')).toBe(true);
  });
});

describe('abvTxt', () => it('8.2 → 8,2', () => expect(abvTxt('8.2')).toBe('8,2')));

describe('filterBeers', () => {
  const list = [
    { id: 'a', name: 'Hop Overflow', hops: 'Citra', famille: 'blonde' },
    { id: 'b', name: 'Xmas', hops: 'Saaz', famille: 'brune' },
  ];
  it('toutes + vide → tout', () => expect(filterBeers(list, 'toutes', '')).toHaveLength(2));
  it('filtre par famille', () => expect(filterBeers(list, 'brune', '').map(b => b.id)).toEqual(['b']));
  it('combine famille et recherche', () => {
    expect(filterBeers(list, 'toutes', 'citra').map(b => b.id)).toEqual(['a']);
    expect(filterBeers(list, 'brune', 'citra')).toEqual([]);
  });
});

describe('brewStats', () => {
  const list = [
    { volume: '20', grains: JSON.stringify([{ nom: 'Pale Ale', kg: 4.2 }, { nom: 'Crystal', kg: '0,3' }]), hops: 'Citra, Mosaïc', bottledOn: '15/11/2025' },
    { volume: '19,5', grains: 'Pilsner 5 kg', hops: 'citra; Fuggle', bottledOn: '11/07/2022' },
    { volume: '', grains: JSON.stringify([{ nom: 'Munich', kg: 3 }, { nom: 'Avoine', kg: '' }]), hops: 'Mosaic', bottledOn: '' },
    { volume: '20', grains: '', hops: 'MOSAIC', bottledOn: '01/02/2024' },
  ];
  it('compte, volume, première mise en bouteille, kg de céréales (JSON seulement)', () => {
    const s = brewStats(list);
    expect(s.count).toBe(4);
    expect(s.liters).toBe(59.5);
    expect(s.since).toBe('juillet 2022');
    expect(s.grainsKg).toBe(7.5);
  });
  it('houblon fétiche : compté une fois par recette, sans accents ni casse, libellé de la 1re occurrence', () => {
    expect(brewStats(list).topHop).toEqual({ name: 'Mosaïc', count: 3 });
  });
  it('égalité : ordre alphabétique', () => {
    expect(brewStats([{ hops: 'Fuggle' }, { hops: 'Citra' }]).topHop).toEqual({ name: 'Citra', count: 1 });
  });
  it('liste vide : rien d’inventé', () => {
    expect(brewStats([])).toEqual({ count: 0, liters: 0, since: undefined, topHop: undefined, grainsKg: 0 });
  });
});
