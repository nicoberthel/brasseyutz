import { describe, expect, it } from 'vitest';
import { validateBeer } from '@/lib/validate';
import { GET as listBeers, POST as createBeer } from '@/app/api/beers/route';
import { PUT as updateBeer, DELETE as deleteBeer } from '@/app/api/beers/[id]/route';
import { sign, SESSION_COOKIE } from '@/lib/session';

const cookie = () => `${SESSION_COOKIE}=${sign(Date.now() + 60000)}`;
const jreq = (method: string, body?: unknown, auth = true) =>
  new Request('http://test/api/beers', {
    method,
    headers: { 'content-type': 'application/json', ...(auth ? { cookie: cookie() } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const valid = { name: 'Comet Ale', styleName: 'Pale Ale', brew: 35, abv: '5,2' };

describe('validateBeer', () => {
  it('champs requis manquants → message exact', () => {
    const r = validateBeer({ name: 'X' });
    expect(r).toEqual({ ok: false, error: 'Nom, style, n° de brassin et alcool sont obligatoires.' });
  });
  it('complète id, lot, défauts', () => {
    const r = validateBeer({ ...valid, bottledOn: '01/06/2026' });
    if (!r.ok) throw new Error(r.error);
    expect(r.beer.id).toBe('comet-ale');
    expect(r.beer.lot).toBe('L2606-35');
    expect(r.beer.bottle).toBe('75cl');
    expect(r.beer.accent).toBe('var(--cuvee-orange)');
  });
  it('brew non entier → erreur', () => {
    expect(validateBeer({ ...valid, brew: 'abc' }).ok).toBe(false);
  });
});

describe('API beers', () => {
  it('GET liste triée brew desc, public', async () => {
    const res = await listBeers();
    const list = await res.json();
    expect(list).toHaveLength(6);
    expect(list[0].brew).toBe(34);
  });
  it('POST sans session → 401', async () => {
    expect((await createBeer(jreq('POST', valid, false))).status).toBe(401);
  });
  it('POST crée → 201, GET en contient 7', async () => {
    const res = await createBeer(jreq('POST', valid));
    expect(res.status).toBe(201);
    expect((await (await listBeers()).json())).toHaveLength(7);
  });
  it('POST brew en double → 409 message clair', async () => {
    const res = await createBeer(jreq('POST', { ...valid, name: 'Autre Nom', brew: 33 }));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('Le brassin N° 33 existe déjà.');
  });
  it('POST id en double → 409', async () => {
    const res = await createBeer(jreq('POST', { name: 'Hop Overflow', styleName: 'NEIPA', brew: 99, abv: '5' }));
    expect(res.status).toBe(409);
  });
  it('PUT modifie', async () => {
    const res = await updateBeer(jreq('PUT', { ...valid, name: 'Hop Overflow', brew: 33, abv: '5,1' }), ctx('hop-overflow'));
    expect(res.status).toBe(200);
    expect((await res.json()).abv).toBe('5,1');
  });
  it('PUT inconnu → 404 ; DELETE inconnu → 404', async () => {
    expect((await updateBeer(jreq('PUT', valid), ctx('nexiste-pas'))).status).toBe(404);
    expect((await deleteBeer(jreq('DELETE'), ctx('nexiste-pas'))).status).toBe(404);
  });
  it('DELETE supprime', async () => {
    expect((await deleteBeer(jreq('DELETE'), ctx('paul'))).status).toBe(200);
    expect((await (await listBeers()).json()).find((b: { id: string }) => b.id === 'paul')).toBeUndefined();
  });
});

describe('favorite', () => {
  it('validateBeer normalise favorite en 0/1', () => {
    const r1 = validateBeer({ ...valid, favorite: true });
    if (!r1.ok) throw new Error(r1.error);
    expect(r1.beer.favorite).toBe(1);
    const r0 = validateBeer({ ...valid });
    if (!r0.ok) throw new Error(r0.error);
    expect(r0.beer.favorite).toBe(0);
  });
});

describe('artwork', () => {
  it('validateBeer conserve artwork', () => {
    const r = validateBeer({ ...valid, artwork: '/uploads/abc.svg' });
    if (!r.ok) throw new Error(r.error);
    expect(r.beer.artwork).toBe('/uploads/abc.svg');
  });
});
