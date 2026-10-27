import { describe, it, expect } from 'vitest';
import {
  legacyGrains, legacyHops, legacyMash, legacyFerment, normalizeServing, legacyToRecipe,
} from '../src/lib/recipe-legacy.ts';

describe('recipe-legacy', () => {
  it('empâtage : « ° » sans chiffre → note, pas de palier', () => {
    const m = legacyMash('Empâtage | ° | 60 min', null);
    expect(m?.paliers ?? []).toEqual([]);
    expect(m?.note).toContain('60 min');
    expect(legacyMash('Rinçage | ° | 10 L', null)?.rincage ?? '').not.toContain('null');
  });
  it('grains : quantités kg, K, virgule, absente', () => {
    expect(legacyGrains("Pale Ale | 3,5 Kg \nMunich | 0,150 Kg\nFlocons d'Orge | 0,3 K \nPale Ale |"))
      .toEqual([
        { nom: 'Pale Ale', kg: 3.5 }, { nom: 'Munich', kg: 0.15 },
        { nom: "Flocons d'Orge", kg: 0.3 }, { nom: 'Pale Ale', kg: null },
      ]);
    expect(legacyGrains('')).toBeNull();
  });

  it('grains : « Seconde Filtration de la Triple Olympique » → kg null', () => {
    expect(legacyGrains('Seconde Filtration de la Triple Olympique'))
      .toEqual([{ nom: 'Seconde Filtration de la Triple Olympique', kg: null }]);
  });

  it('hops Xmas 2025 : épices et quantité brute', () => {
    const h = legacyHops([
      'Centennial | 15 g | 60 min | Ébullition',
      'Centennial | 20 g | 20 min | Hopstand',
      'Gingembre | 15 g | 10 min | Hopstand',
      'Clous de girofle | 5 | 5 min | Hopstand',
      'Cannelle | 1 bâton | 5 min | Hopstand',
      "Écorce d'orange | 15 g | 5 min | Hopstand",
      'Orange amère | 20 g | 10 min | Hopstand',
    ].join('\n'))!;
    expect(h[0]).toEqual({ etape: 'Ébullition', nom: 'Centennial', qte: '15 g', detail: '60 min' });
    expect(h[1].etape).toBe('Hopstand');
    expect(h[2]).toEqual({ etape: 'Épices', nom: 'Gingembre', qte: '15 g', detail: '10 min' });
    expect(h[3]).toEqual({ etape: 'Épices', nom: 'Clous de girofle', qte: '5', detail: '5 min' });
    expect(h[4].etape).toBe('Épices');
    expect(h[5].etape).toBe('Épices');
    expect(h[6].etape).toBe('Épices');
  });

  it('hops : Whirlpool, Dry hop, Fermentation, Ébulition', () => {
    const h = legacyHops([
      'Centennial | 53 g | 20 min | Whirlpool',
      'Amarillo | 50 g | 3 jours | Dry hop',
      'Chinook | 60 g | J5 | Dry Hop',
      'Framboises surgelées | 1,5 kg | J5 | Fermentation',
      'Cascade | 5 g | 60 min | Ébulition',
      'Cascade |  | 10 min | Hopstand',
    ].join('\n'))!;
    expect(h.map(l => l.etape)).toEqual(['Hopstand', 'Dry hop', 'Dry hop', 'Épices', 'Ébullition', 'Hopstand']);
    expect(h[3]).toEqual({ etape: 'Épices', nom: 'Framboises surgelées', qte: '1,5 kg', detail: 'en fermentation · J5' });
    expect(h[5].qte).toBe('');
  });

  it('hops seed sans étape : stage déduit du détail', () => {
    const h = legacyHops('Citra | 40 g | whirlpool 80 °C\nCitra | 60 g | dry hop J4\nMagnum | 10 g | 60 min')!;
    expect(h.map(l => l.etape)).toEqual(['Hopstand', 'Dry hop', 'Ébullition']);
    expect(h[0].detail).toBe('whirlpool 80 °C');
  });

  it('mash Xmas 2025 : eau, paliers, rinçage', () => {
    const hops = legacyHops('Magnum | 10 g | 60 min | Ébullition');
    const m = legacyMash('Empâtage | 65 °C | 60 min | 25,5 L\nMash-out | 78 °C | 10 min\nRinçage | 80 °C | 11 L', hops)!;
    expect(m.eau).toBe('25,5 L');
    expect(m.rincage).toBe('11 L à 80 °C');
    expect(m.paliers).toEqual([
      { temp: 65, min: 60, label: 'Saccharification' },
      { temp: 78, min: 10, label: 'Mash-out' },
    ]);
    expect(m.ebullitionMin).toBe(60);
  });

  it('mash Pils #2 : protéines, ébullition 60, rinçage', () => {
    const hops = legacyHops('Styrian Goldings | 30 g | 60 min | Ébullition\nMosaic | 10 g | 10 min | Hopstand');
    const m = legacyMash('Protéines | 50 °C | 10 min\nEmpâtage | 62 °C | 45 min\nMash-out | 73 °C | 10 min\nRinçage | 80 °C | 13 L', hops)!;
    expect(m.paliers.map(p => p.label)).toEqual(['Palier protéique', 'Saccharification', 'Mash-out']);
    expect(m.ebullitionMin).toBe(60);
    expect(m.rincage).toBe('13 L à 80 °C');
  });

  it('mash : ligne sans durée, rinçage température seule, libellé vide ou libre', () => {
    const m = legacyMash('Empâtage | 65 °C\nRinçage | 80 °C\n | 52 °C | 5 min\nPalier bêta | 70 °C | 20 min', null)!;
    expect(m.paliers).toEqual([
      { temp: 65, min: null, label: 'Saccharification' },
      { temp: 52, min: 5, label: 'Palier protéique' },
      { temp: 70, min: 20, label: 'Palier bêta' },
    ]);
    expect(m.rincage).toBe('80 °C');
  });

  it('mash Micro IPA : ligne sans température → note', () => {
    const m = legacyMash('Seconde Filtration de la Triple Olympique', null)!;
    expect(m.note).toBe('Seconde Filtration de la Triple Olympique');
    expect(m.paliers).toEqual([]);
  });

  it('mash vide + houblons 60 min → null', () => {
    const hops = legacyHops('Magnum | 10 g | 60 min | Ébullition');
    expect(legacyMash('', hops)).toBeNull();
  });

  it('mash : ébullition max des durées, 60 par défaut', () => {
    const hops = legacyHops('A | 1 g | 90 min | Ébullition\nB | 1 g | 60 min | Ébullition');
    expect(legacyMash('Empâtage | 65 °C | 60 min', hops)!.ebullitionMin).toBe(90);
    expect(legacyMash('Empâtage | 65 °C | 60 min', null)!.ebullitionMin).toBe(60);
  });

  it('ferment : durées, labels, cold crash', () => {
    const f = legacyFerment('20 °C | 14 jours\n22 °C | 5 jours\n4 °C | 3 jours | Cold Crush', 'US-05', 'Eau, sucre')!;
    expect(f.paliers).toEqual([
      { temp: 20, duree: '14 j', label: 'Fermentation principale' },
      { temp: 22, duree: '5 j', label: 'Fin de fermentation' },
      { temp: 4, duree: '3 j', label: 'Cold crash' },
    ]);
    const g = legacyFerment('11 °C | 14 jours\n2 °C | 5 semaines\n18 °C | 2 sem.\n20°C | 10 j', '', '')!;
    expect(g.paliers.map(p => [p.duree, p.label])).toEqual([
      ['14 j', 'Fermentation principale'], ['5 sem.', 'Garde à froid'],
      ['2 sem.', 'Fin de fermentation'], ['10 j', 'Fin de fermentation'],
    ]);
    expect(g.paliers[3].temp).toBe(20);
  });

  it('ferment : étiquette collée à la durée, décimale, plage', () => {
    const f = legacyFerment('20 °C | 14 jours\n4 °C | 2 jours Cold Crash\n19.5 °C | 5 jours\n20 → 24 °C | 3 jours', '', '')!;
    expect(f.paliers[1]).toEqual({ temp: 4, duree: '2 j', label: 'Cold crash' });
    expect(f.paliers[2].temp).toBe(19.5);
    expect(f.paliers[3].temp).toBe(20);
  });

  it('ferment : ensemencement et refermentation', () => {
    const a = legacyFerment('20 °C | 14 jours', 'US-05', 'Eau, sucre')!;
    expect(a.ensemencement).toBe('1 sachet · US-05');
    expect(a.refermentation).toBe('Sucre · 2 sem. à 20 °C');
    const b = legacyFerment('20 °C | 14 jours', '', 'Eau')!;
    expect(b.ensemencement).toBe('');
    expect(b.refermentation).toBe('');
    expect(legacyFerment('', '', '')).toBeNull();
  });

  it('ferment seed : levure ignorée', () => {
    const f = legacyFerment('Verdant IPA | 19 °C | 10 jours\nCold crash | 2 °C | 2 jours\nGarde | 4 °C | 3 semaines', '', '')!;
    expect(f.paliers).toEqual([
      { temp: 19, duree: '10 j', label: 'Fermentation principale' },
      { temp: 2, duree: '2 j', label: 'Cold crash' },
      { temp: 4, duree: '3 sem.', label: 'Garde' },
    ]);
  });

  it('ferment seed : ligne Épices non perdue, reversée au houblonnage', () => {
    const skipped: string[][] = [];
    legacyFerment('S-33 | 19 °C | 14 jours\nÉpices | zeste | 5 min', '', '', c => skipped.push(c));
    expect(skipped).toEqual([['Épices', 'zeste', '5 min']]);
    const r = legacyToRecipe({ ferment: 'S-33 | 19 °C | 14 jours\nÉpices | zeste, girofle, gingembre, cannelle | 5 min' });
    expect(r.ferment!.paliers).toHaveLength(1);
    expect(r.ferment!.paliers[0].temp).toBe(19);
    expect(r.hopSchedule).toEqual([
      { etape: 'Épices', nom: 'Épices', qte: '', detail: 'zeste, girofle, gingembre, cannelle · 5 min' },
    ]);
  });

  it('normalizeServing', () => {
    expect(normalizeServing('6°C.')).toBe('6 °C');
    expect(normalizeServing(' 8°C. ')).toBe('8 °C');
    expect(normalizeServing('8–10 °C')).toBe('8–10 °C');
    expect(normalizeServing('4  °C')).toBe('4 °C');
    expect(normalizeServing('')).toBe('');
  });

  it('legacyToRecipe : Hoppy Birthday (recette vide, style Triple)', () => {
    expect(legacyToRecipe({ grains: '', hopSchedule: '', mash: '', ferment: '', yeast: 'BE-256 Abbey', other: 'Eau, sucre', styleName: 'Triple', serving: '' }))
      .toEqual({ grains: null, hopSchedule: null, mash: null, ferment: null, famille: 'belge', serving: '' });
  });

  it('legacyToRecipe : Xmas 2025 complet', () => {
    const r = legacyToRecipe({
      grains: 'Pale Ale | 3,5 kg', hopSchedule: 'Centennial | 15 g | 60 min | Ébullition',
      mash: 'Empâtage | 65 °C | 60 min | 25,5 L', ferment: '20 °C | 14 jours', yeast: 'S-33',
      other: 'Eau, sucre, orange', styleName: 'Bière de Noël', serving: '8°C.',
    });
    expect(r.famille).toBe('brune');
    expect(r.serving).toBe('8 °C');
    expect(r.mash!.ebullitionMin).toBe(60);
    expect(r.ferment!.ensemencement).toBe('1 sachet · S-33');
  });
});
