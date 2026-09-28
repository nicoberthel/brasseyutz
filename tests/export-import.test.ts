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
