// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { getDefaultNormalizer, render, screen } from '@testing-library/react';
import { eq } from 'drizzle-orm';

const N = '\u00a0';
const outside = (els: HTMLElement[]) => els.filter(e => !e.closest('[data-label-thumb]'));

async function renderId(id: string) {
  const Page = (await import('@/app/biere/[id]/page')).default;
  return render(await Page({ params: Promise.resolve({ id }) }));
}
async function update(id: string, set: Record<string, unknown>) {
  const { getDb } = await import('@/lib/db');
  const { beers } = await import('@/lib/schema');
  getDb().update(beers).set(set).where(eq(beers.id, id)).run();
}
const fig = (label: string) => screen.getByText(label, { selector: '.fig > span' }).parentElement!;
const radarSvg = (c: HTMLElement) => c.querySelector('svg[role="img"][aria-label^="Profil"]');

/* Garde les insécables : le normaliseur par défaut les réduit en espaces. */
const KEEP_NBSP = { normalizer: getDefaultNormalizer({ collapseWhitespace: false }) };

describe('fiche', () => {
  it('/biere/hop-overflow : en-tête, chiffres, recette, dégustation, autres cuvées', async () => {
    const { container } = await renderId('hop-overflow');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Hop Overflow');
    expect(screen.getByText(`NEIPA · brassin n°${N}33`, KEEP_NBSP)).toBeTruthy();
    expect(screen.getByLabelText('Retour').getAttribute('href')).toBe('/cuvees');
    // histoire + mot
    expect(screen.getByText('L’histoire du brassin')).toBeTruthy();
    const quote = screen.getByText('Le mot du brasseur').closest('blockquote')!;
    expect(quote.querySelector('p')!.textContent).toBe(`«${N}Trouble assumée. À boire jeune, avant que les arômes ne débordent de la pile.${N}»`);
    expect(quote.querySelector('cite')!.textContent).toBe('Nicolas');
    expect(quote.querySelector('cite img')!.getAttribute('src')).toBe('/assets/logo-brasse-yutz-noir.svg');
    // chiffres
    expect(fig('Alcool').textContent).toBe(`Alcool5${N}%${N}vol`);
    expect(fig('Densité initiale').textContent).toBe('Densité initiale1,050');
    expect(fig('Densité finale').textContent).toBe('Densité finale1,012');
    expect(fig('Volume').textContent).toBe(`Volume20${N}L`);
    expect(fig('Mise en bouteille').textContent).toBe('Mise en bouteille07/05/2026');
    expect(container.querySelector('.gauges')!.textContent).toContain(`Couleur 11${N}EBC`);
    expect(container.querySelector('.gauges')!.textContent).toContain(`Amertume 40${N}IBU`);
    // recette
    expect(screen.getByRole('heading', { level: 2, name: 'La recette' })).toBeTruthy();
    const malts = screen.getByRole('heading', { level: 3, name: 'Malts & grains' }).closest('.blk')!;
    expect(malts.textContent).toContain(`5,90${N}kg`);
    const houblons = screen.getByRole('heading', { level: 3, name: 'Houblonnage' }).closest('.blk')!;
    expect(houblons.textContent).toContain(`240${N}g`);
    expect(container.querySelector('[data-stage="Hopstand"]')).toBeTruthy();
    expect(screen.getAllByText('Saccharification').length).toBe(1);
    const mash = screen.getByRole('heading', { level: 3, name: 'Empâtage' }).closest('.blk')!;
    expect(mash.textContent).toContain(`70${N}min`);
    const ferm = screen.getByRole('heading', { level: 3, name: 'Fermentation' }).closest('.blk')!;
    expect(ferm.textContent).toContain('Verdant IPA');
    expect(screen.getByText('1 sachet · Verdant IPA')).toBeTruthy();
    // dégustation
    expect(screen.getByRole('heading', { level: 2, name: 'Dégustation' })).toBeTruthy();
    for (const k of ['Aspect', 'Nez', 'Bouche', 'Finale']) expect(screen.getByText(k, { selector: '.note b' })).toBeTruthy();
    expect(screen.getByText(`Servir à 6–8${N}°C, à boire dans les 3 mois`, KEEP_NBSP)).toBeTruthy();
    // autres
    expect(screen.getByRole('heading', { level: 2, name: 'Les autres cuvées' })).toBeTruthy();
    const photos = [...container.querySelectorAll('.photo-grid > a.photo')];
    expect(photos.map(a => a.getAttribute('href'))).toEqual(['/biere/dark-mode', '/biere/xmas-2025', '/biere/paul', '/biere/pils-electrique']);
    expect(container.textContent).not.toContain('NaN');
  });
  it('/brassin/33 rend la même bière', async () => {
    const Page = (await import('@/app/brassin/[brew]/page')).default;
    render(await Page({ params: Promise.resolve({ brew: '33' }) }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Hop Overflow');
    expect(screen.getByText(`NEIPA · brassin n°${N}33`, KEEP_NBSP)).toBeTruthy();
  });
  it('dénomination affichée entre style et n°', async () => {
    await renderId('dark-mode');
    expect(screen.getByText(`Munich Dunkel · Bière brune · brassin n°${N}34`, KEEP_NBSP)).toBeTruthy();
  });
  it('bière nue : pas de recette, dégustation, histoire ni figs vides, pas de crash', async () => {
    const { getDb } = await import('@/lib/db');
    const { beers } = await import('@/lib/schema');
    getDb().insert(beers).values({ id: 'nue', name: 'Nue', styleName: 'Pils', brew: 90, abv: '5' }).run();
    const { container } = await renderId('nue');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Nue');
    expect(screen.queryByText('La recette')).toBeNull();
    expect(screen.queryByText('Dégustation')).toBeNull();
    expect(screen.queryByText('L’histoire du brassin')).toBeNull();
    expect(screen.queryByText('Le mot du brasseur')).toBeNull();
    expect(container.querySelector('.story')).toBeNull();
    expect(container.querySelector('.gauges')).toBeNull();
    expect([...container.querySelectorAll('.fig > span')].map(s => s.textContent)).toEqual(['Alcool']);
    expect(container.textContent).not.toContain('NaN');
    expect(container.textContent).not.toContain('undefined');
  });
  it('radar vide, notes présentes : pas de radar, notes rendues', async () => {
    const { container } = await renderId('hop-overflow');
    expect(radarSvg(container)).toBeNull();
    expect(container.querySelector('svg[role="img"]:not([aria-label="Brasse-Yutz"])')).toBeNull();
    expect(screen.getByText('Nez', { selector: '.note b' })).toBeTruthy();
  });
  it('radar présent : svg role img', async () => {
    await update('hop-overflow', { radar: JSON.stringify([2.5, 3, 3, 1, 1.5, 0.5, 4.5, 3]) });
    const { container } = await renderId('hop-overflow');
    expect(radarSvg(container)).toBeTruthy();
  });
  it('radar seul (notes et service vides) : section dégustation avec le radar seul', async () => {
    await update('hop-overflow', { radar: JSON.stringify([2.5, 3, 3, 1, 1.5, 0.5, 4.5, 3]), look: '', nose: '', mouth: '', finish: '', serving: '' });
    const { container } = await renderId('hop-overflow');
    expect(screen.getByRole('heading', { level: 2, name: 'Dégustation' })).toBeTruthy();
    expect(radarSvg(container)).toBeTruthy();
    expect(container.querySelector('.notes')).toBeNull();
  });
  it('houblon « 1 bâton » affiché, total sans NaN', async () => {
    await update('xmas-2025', { hopSchedule: JSON.stringify([
      { etape: 'Ébullition', nom: 'Mosaïc', qte: '20 g', detail: '10 min' },
      { etape: 'Épices', nom: 'Cannelle', qte: '1 bâton', detail: '5 min' },
    ]) });
    const { container } = await renderId('xmas-2025');
    expect(screen.getByText('1 bâton')).toBeTruthy();
    const houblons = screen.getByRole('heading', { level: 3, name: 'Houblonnage' }).closest('.blk')!;
    expect(houblons.textContent).toContain(`20${N}g`);
    expect(container.textContent).not.toContain('NaN');
  });
  it('description seule → carte « Le mot du brasseur » omise', async () => {
    await update('hop-overflow', { notes: '' });
    await renderId('hop-overflow');
    expect(screen.getByText('L’histoire du brassin')).toBeTruthy();
    expect(screen.queryByText('Le mot du brasseur')).toBeNull();
  });
  it('notes seules → paragraphe « L’histoire du brassin » omis', async () => {
    await renderId('dark-mode');
    expect(screen.queryByText('L’histoire du brassin')).toBeNull();
    expect(screen.getByText('Le mot du brasseur')).toBeTruthy();
  });
  it('libellés des chiffres sur une ligne', async () => {
    await renderId('hop-overflow');
    expect(screen.getByText('Densité initiale').style.whiteSpace).toBe('nowrap');
  });
  it('cœur affiché à côté du titre quand coup de cœur', async () => {
    await update('paul', { favorite: 1 });
    await renderId('paul');
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('Paul Eph 5:18');
    expect(h1.querySelector('i')!.textContent).toBe(' Eph 5:18');
    expect(outside(screen.getAllByTitle('Coup de cœur'))).toHaveLength(1);
  });
  it('id inconnu → notFound() ; brassin non numérique → notFound() (404, jamais 500)', async () => {
    const is404 = { digest: 'NEXT_HTTP_ERROR_FALLBACK;404' };
    const PageId = (await import('@/app/biere/[id]/page')).default;
    await expect(PageId({ params: Promise.resolve({ id: 'nexiste-pas' }) })).rejects.toMatchObject(is404);
    const PageBrew = (await import('@/app/brassin/[brew]/page')).default;
    await expect(PageBrew({ params: Promise.resolve({ brew: 'abc' }) })).rejects.toMatchObject(is404);
    await expect(PageBrew({ params: Promise.resolve({ brew: '9999' }) })).rejects.toMatchObject(is404);
  });
  it('page introuvable : copie conservée, retour → /cuvees', async () => {
    const NotFound = (await import('@/app/biere/[id]/not-found')).default;
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Bière introuvable');
    expect(screen.getByText('Ce brassin n’est pas (ou plus) en ligne.')).toBeTruthy();
    expect(screen.getAllByRole('link').some(a => a.getAttribute('href') === '/cuvees')).toBe(true);
  });
});
