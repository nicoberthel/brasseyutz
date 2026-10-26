import { describe, expect, it } from 'vitest';
import { GET as exportBeers } from '@/app/api/export/route';
import { POST as importBeers } from '@/app/api/import/route';
import { GET as listBeers } from '@/app/api/beers/route';
import { sign, SESSION_COOKIE } from '@/lib/session';

const cookie = () => `${SESSION_COOKIE}=${sign(Date.now() + 60000)}`;
const req = (body?: unknown) => new Request('http://test', {
  method: body === undefined ? 'GET' : 'POST',
  headers: { 'content-type': 'application/json', cookie: cookie() },
  body: body === undefined ? undefined : JSON.stringify(body),
});

describe('export/import', () => {
  it('export → 6 bières + en-tête téléchargement', async () => {
    const res = await exportBeers(req());
    expect(res.status).toBe(200);
    expect(res.headers.get('content-disposition')).toContain('brasseyutz-export.json');
    expect((await res.json()).beers).toHaveLength(6);
  });
  it('cycle export → import identique', async () => {
    const dump = await (await exportBeers(req())).json();
    const res = await importBeers(req({ beers: dump.beers }));
    expect(res.status).toBe(200);
    expect((await res.json()).count).toBe(6);
    expect(await (await listBeers()).json()).toHaveLength(6);
    const strip = (l: Record<string, unknown>[]) => l.map(({ createdAt, updatedAt, ...b }) => b);
    const again = await (await exportBeers(req())).json();
    expect(strip(again.beers)).toEqual(strip(dump.beers));
  });
  it('export : grains est un tableau, radar vide → null', async () => {
    const dump = await (await exportBeers(req())).json();
    const hop = dump.beers.find((b: { id: string }) => b.id === 'hop-overflow');
    expect(Array.isArray(hop.grains)).toBe(true);
    expect(hop.grains[0]).toEqual({ nom: 'Pale Ale', kg: 4 });
    expect(Array.isArray(hop.hopSchedule)).toBe(true);
    expect(hop.mash.paliers).toHaveLength(2);
    expect(hop.ferment.ensemencement).toBe('1 sachet · Verdant IPA');
    expect(hop.radar).toBeNull();
    expect(hop.famille).toBe('houblonnee');
    expect(typeof hop.look).toBe('string');
  });
  it('import de l’ancien format (chaînes |) → même JSON que legacyToRecipe', async () => {
    const { legacyToRecipe } = await import('@/lib/recipe-legacy');
    const old = {
      id: 'xmas-2025', name: 'Xmas', edition: '2025', styleName: 'Bière de Noël', brew: 32, abv: '5,5',
      yeast: 'S-33', other: 'Eau, sucre, orange', serving: '8°C.',
      grains: 'Pale Ale | 3,5 kg\nMunich | 2 kg',
      hopSchedule: 'Centennial | 15 g | 60 min | Ébullition\nCannelle | 1 bâton | 5 min | Hopstand',
      mash: 'Empâtage | 65 °C | 60 min | 25,5 L\nMash-out | 78 °C | 10 min\nRinçage | 80 °C | 11 L',
      ferment: '20 °C | 14 jours\nÉpices | zeste | 5 min\n4 °C | 3 jours | Cold Crush',
    };
    // la-blanche de l’export réel : recette vide, pas de clé famille
    const vide = { id: 'la-blanche', name: 'La Blanche', styleName: 'Blanche', brew: 7, abv: '5',
      grains: '', hopSchedule: '', mash: '', ferment: '' };
    const res = await importBeers(req({ beers: [old, vide] }));
    expect(res.status).toBe(200);
    const [b, blanche] = await (await listBeers()).json();
    expect(blanche.famille).toBe('blanche');
    expect(blanche.grains).toBe('');
    const e = legacyToRecipe(old);
    expect(JSON.parse(b.grains)).toEqual(e.grains);
    expect(JSON.parse(b.hopSchedule)).toEqual(e.hopSchedule);
    expect(JSON.parse(b.mash)).toEqual(e.mash);
    expect(JSON.parse(b.ferment)).toEqual(e.ferment);
    expect(b.famille).toBe('brune'); // ancien format sans famille → déduite du style, comme la migration
    expect(b.serving).toBe('8 °C');
    expect(b.radar).toBe('');
  });
  it('import remplace tout', async () => {
    const one = { name: 'Seule Bière', styleName: 'Pils', brew: 1, abv: '5' };
    await importBeers(req({ beers: [one] }));
    expect(await (await listBeers()).json()).toHaveLength(1);
  });
  it('JSON invalide → 400, base inchangée', async () => {
    expect((await importBeers(req({ pas: 'bon' }))).status).toBe(400);
    const bad = [{ name: 'Ok', styleName: 'Pils', brew: 1, abv: '5' }, { name: 'Sans style', brew: 2 }];
    expect((await importBeers(req({ beers: bad }))).status).toBe(400);
    expect(await (await listBeers()).json()).toHaveLength(6);
  });
  it('doublon de brassin dans l’import → 400', async () => {
    const dup = [
      { name: 'A', styleName: 'Pils', brew: 1, abv: '5' },
      { name: 'B', styleName: 'Pils', brew: 1, abv: '5' },
    ];
    expect((await importBeers(req({ beers: dup }))).status).toBe(400);
  });
  it('sans session → 401', async () => {
    expect((await exportBeers(new Request('http://test'))).status).toBe(401);
    expect((await importBeers(new Request('http://test', { method: 'POST', body: '{}' }))).status).toBe(401);
  });
});
