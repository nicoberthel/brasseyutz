// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('fiche', () => {
  it('/biere/hop-overflow rend stats, recette, dégustation, autres bières', async () => {
    const Page = (await import('@/app/biere/[id]/page')).default;
    render(await Page({ params: Promise.resolve({ id: 'hop-overflow' }) }));
    expect(screen.getAllByText('Overflow').length).toBeGreaterThan(0);
    expect(screen.getByText('Alcool')).toBeTruthy();
    expect(screen.getAllByText('Amertume').length).toBeGreaterThan(0);
    expect(screen.getByText('Densité initiale')).toBeTruthy();
    expect(screen.getByText(/L’histoire du brassin/i)).toBeTruthy();
    expect(screen.getByText('Malts & grains')).toBeTruthy();
    expect(screen.getByText(/Fermentation · Verdant IPA/)).toBeTruthy();
    expect(screen.getByText('Pour 20 litres')).toBeTruthy();
    expect(screen.getByText('Le mot du brasseur')).toBeTruthy();
    expect(screen.getByText('Nez')).toBeTruthy();
    expect(screen.getByText('Autres bières')).toBeTruthy();
  });
  it('/brassin/33 rend la même bière', async () => {
    const Page = (await import('@/app/brassin/[brew]/page')).default;
    render(await Page({ params: Promise.resolve({ brew: '33' }) }));
    expect(screen.getAllByText('Overflow').length).toBeGreaterThan(0);
  });
  it('bière sans dégustation ni histoire : sections omises', async () => {
    const { getDb } = await import('@/lib/db');
    const { beers } = await import('@/lib/schema');
    getDb().insert(beers).values({ id: 'nue', name: 'Nue', styleName: 'Pils', brew: 90, abv: '5' }).run();
    const Page = (await import('@/app/biere/[id]/page')).default;
    render(await Page({ params: Promise.resolve({ id: 'nue' }) }));
    expect(screen.getByText('recette', { selector: 'i' })).toBeTruthy(); // « La recette » toujours là
    expect(screen.queryByText('Le mot du brasseur')).toBeNull();
    expect(screen.queryByText(/L’histoire du brassin/)).toBeNull();
  });
  it('libellés des stats sur une ligne (Densité initiale ne casse pas l’alignement)', async () => {
    const Page = (await import('@/app/biere/[id]/page')).default;
    render(await Page({ params: Promise.resolve({ id: 'hop-overflow' }) }));
    const lbl = screen.getByText('Densité initiale');
    expect(lbl.style.whiteSpace).toBe('nowrap');
  });
  it('badge affiché sur la fiche quand renseigné', async () => {
    const { getDb } = await import('@/lib/db');
    const { beers: table } = await import('@/lib/schema');
    const { eq } = await import('drizzle-orm');
    getDb().update(table).set({ badge: 'Coup de cœur' }).where(eq(table.id, 'paul')).run();
    const Page = (await import('@/app/biere/[id]/page')).default;
    render(await Page({ params: Promise.resolve({ id: 'paul' }) }));
    expect(screen.getByText('Coup de cœur')).toBeTruthy();
  });
  it('id inconnu → notFound() ; brassin non numérique → notFound() (404, jamais 500)', async () => {
    const is404 = { digest: 'NEXT_HTTP_ERROR_FALLBACK;404' };
    const PageId = (await import('@/app/biere/[id]/page')).default;
    await expect(PageId({ params: Promise.resolve({ id: 'nexiste-pas' }) })).rejects.toMatchObject(is404);
    const PageBrew = (await import('@/app/brassin/[brew]/page')).default;
    await expect(PageBrew({ params: Promise.resolve({ brew: 'abc' }) })).rejects.toMatchObject(is404);
    await expect(PageBrew({ params: Promise.resolve({ brew: '9999' }) })).rejects.toMatchObject(is404);
  });
});
