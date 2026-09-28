import { describe, expect, it } from 'vitest';
import { num, norm, slug, splitName, rows, lotFor, matches, abvTxt } from '@/lib/domain';

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

describe('rows', () => {
  it('découpe a | b | c', () =>
    expect(rows('Citra | 50 g | dry hop J3')).toEqual([{ a: 'Citra', b: '50 g', c: 'dry hop J3' }]));
  it('colonnes surnuméraires jointes par ·', () =>
    expect(rows('X | 1 | a | b')[0].c).toBe('a · b'));
  it('ignore lignes vides', () => expect(rows('\n\nA | 1\n')).toHaveLength(1));
  it('colonnes manquantes vides', () => expect(rows('Seul')).toEqual([{ a: 'Seul', b: '', c: '' }]));
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
});

describe('abvTxt', () => it('8.2 → 8,2', () => expect(abvTxt('8.2')).toBe('8,2')));
