import { describe, it, expect } from 'vitest';
import {
  parseGrains, parseHops, parseMash, parseRadar, hopsTotalG, grainsTotalKg,
  familleOf, nbsp, isLegacyText, parseFerment, toCol, mashMinutes, fr, FAMILLES, RADAR_AXES,
} from '../src/lib/recipe.ts';

describe('recipe', () => {
  it('parseGrains accepte tableau, chaîne JSON, vide', () => {
    expect(parseGrains('')).toBeNull();
    expect(parseGrains('[{"nom":"Pale Ale","kg":3}]')).toEqual([{ nom: 'Pale Ale', kg: 3 }]);
    expect(parseGrains([{ nom: 'X' }])).toEqual([{ nom: 'X', kg: null }]);
    expect(parseGrains([{ nom: 'X', kg: '0,3' }])).toEqual([{ nom: 'X', kg: 0.3 }]);
    expect(parseGrains([])).toBeNull();
    expect(parseGrains('pas du json')).toBeNull();
  });
  it('parseHops normalise etape inconnue → Ébullition, champs manquants → ""', () => {
    expect(parseHops([{ etape: 'Zzz', nom: 'Saaz' }])).toEqual([{ etape: 'Ébullition', nom: 'Saaz', qte: '', detail: '' }]);
    expect(parseHops([{ etape: 'Dry hop', nom: 'A', qte: '40 g', detail: '3 j' }])![0].etape).toBe('Dry hop');
    expect(parseHops('')).toBeNull();
  });
  it('parseMash : null si tout vide ; paliers typés', () => {
    expect(parseMash({ paliers: [] })).toBeNull();
    expect(parseMash('')).toBeNull();
    const m = parseMash({ paliers: [{ temp: '66', min: '60' }] })!;
    expect(m.paliers).toEqual([{ temp: 66, min: 60, label: '' }]);
    expect(m.eau).toBe('');
    expect(m.ebullitionMin).toBeNull();
    expect(mashMinutes(m)).toBe(60);
    expect(parseMash({ ebullitionMin: 60 })!.ebullitionMin).toBe(60);
  });
  it('parseFerment', () => {
    expect(parseFerment({})).toBeNull();
    expect(parseFerment({ paliers: [{ temp: '18', duree: '10 j' }] })!.paliers).toEqual([{ temp: 18, duree: '10 j', label: '' }]);
    expect(parseFerment({ ensemencement: 'x' })!.ensemencement).toBe('x');
  });
  it('parseRadar : 8 nombres 0–5 sinon null', () => {
    expect(parseRadar([1, 2, 3, 4, 5, 0, 2.5, 3])).toEqual([1, 2, 3, 4, 5, 0, 2.5, 3]);
    expect(parseRadar('[1,2,3,4,5,0,2.5,3]')).not.toBeNull();
    expect(parseRadar([1, 2, 3, 4, 5, 0, 2.5])).toBeNull();
    expect(parseRadar([6, 2, 3, 4, 5, 0, 2.5, 3])).toBeNull();
    expect(parseRadar('')).toBeNull();
    expect(RADAR_AXES).toHaveLength(8);
  });
  it('hopsTotalG : 40 g + 1,5 kg + « 1 bâton » (Épices) = 1540', () => {
    const h = parseHops([
      { etape: 'Ébullition', nom: 'A', qte: '40 g' },
      { etape: 'Dry hop', nom: 'B', qte: '1,5 kg' },
      { etape: 'Épices', nom: 'C', qte: '1 bâton' },
    ])!;
    expect(hopsTotalG(h)).toBe(1540);
  });
  it('hopsTotalG ignore « 5 » sans unité', () => {
    expect(hopsTotalG(parseHops([{ nom: 'A', qte: '5' }, { nom: 'B', qte: '10 g' }])!)).toBe(10);
  });
  it('grainsTotalKg null si aucun kg', () => {
    expect(grainsTotalKg([{ nom: 'a', kg: null }])).toBeNull();
    expect(grainsTotalKg([{ nom: 'a', kg: 3 }, { nom: 'b', kg: 0.5 }])).toBe(3.5);
  });
  it('familleOf', () => {
    expect(familleOf('IPA')).toBe('houblonnee');
    expect(familleOf('Munich Dunkel')).toBe('brune');
    expect(familleOf('Bière de Noël')).toBe('brune');
    expect(familleOf('Blanche aux fruits')).toBe('blanche');
    expect(familleOf('Triple Belge')).toBe('belge');
    expect(familleOf('Pils')).toBe('blonde');
    expect(familleOf('Micro IPA')).toBe('houblonnee');
    expect(familleOf('Pale Ale')).toBe('houblonnee');
    expect(familleOf('Blond Ale')).toBe('blonde');
    expect(familleOf('Inconnu')).toBe('');
    expect(FAMILLES.map(f => f.key)).toEqual(['houblonnee', 'blonde', 'belge', 'blanche', 'brune']);
  });
  it('nbsp insère l’insécable', () => {
    expect(nbsp('n° 34')).toBe('n° 34');
    expect(nbsp('5,5 % vol')).toBe('5,5 % vol');
    expect(nbsp('60 min')).toBe('60 min');
    expect(nbsp('20 L')).toBe('20 L');
    expect(nbsp('67 °C')).toBe('67 °C');
  });
  it('isLegacyText', () => {
    expect(isLegacyText('a | b')).toBe(true);
    expect(isLegacyText('[]')).toBe(false);
    expect(isLegacyText('')).toBe(false);
  });
  it('toCol et fr', () => {
    expect(toCol(null)).toBe('');
    expect(toCol([1])).toBe('[1]');
    expect(fr(5.5)).toBe('5,5');
  });
});
