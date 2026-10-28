// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, getDefaultNormalizer, render, screen } from '@testing-library/react';
import { Home } from '@/app/home';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';
import { brewStats } from '@/lib/domain';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn(), push, replace: vi.fn() }), useSearchParams: () => new URLSearchParams() }));
const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', artwork: '', favorite: 0, famille: '', radar: '', description: '', ...b })) as Beer[];
const tiles = (c: HTMLElement) => c.querySelectorAll('a.tile');

/* Garde les insécables : le normaliseur par défaut les réduit en espaces. */
const KEEP_NBSP = { normalizer: getDefaultNormalizer({ collapseWhitespace: false }) };

describe('Accueil', () => {
  it('hero : titre, bouton « Voir les cuvées » → /cuvees, logo', () => {
    render(<Home beers={beers} />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe('Des bières houblonnées, brassées à la maison.');
    expect(h1.querySelector('i')!.textContent).toBe('à la maison.');
    expect(screen.getByText('Brasserie maison · Yutz')).toBeTruthy();
    expect(screen.getByText('Petits brassins, essais, ratés et belles réussites. Chaque cuvée a sa fiche technique complète.')).toBeTruthy();
    expect(screen.getByText('Voir les cuvées').closest('a')!.getAttribute('href')).toBe('/cuvees');
    expect(screen.getByAltText('Brasse-Yutz — Saint Nicolas').getAttribute('src')).toBe('/assets/logo-brasse-yutz.svg');
  });
  it('section « Les cuvées » avec lien « Tout voir » → /cuvees', () => {
    render(<Home beers={beers} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Les cuvées' })).toBeTruthy();
    expect(screen.getByText('Tout voir').closest('a')!.getAttribute('href')).toBe('/cuvees');
  });
  it('rail : 6 tuiles, onglet « Brunes & fêtes » → Dark Mode et Xmas', () => {
    const { container } = render(<Home beers={beers} />);
    expect(tiles(container)).toHaveLength(6);
    fireEvent.click(screen.getByRole('tab', { name: 'Brunes & fêtes' }));
    const hrefs = [...tiles(container)].map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/biere/dark-mode', '/biere/xmas-2025']);
  });
  it('recherche « electrique » filtre le rail à 1 ; aucune → 404', () => {
    const { container } = render(<Home beers={beers} />);
    const input = screen.getByRole('textbox', { name: 'Rechercher une cuvée' });
    fireEvent.change(input, { target: { value: 'electrique' } });
    expect(tiles(container)).toHaveLength(1);
    fireEvent.change(input, { target: { value: 'xyz' } });
    expect(tiles(container)).toHaveLength(0);
    expect(screen.getByText('404 — bière introuvable')).toBeTruthy();
  });
  it('Entrée dans la recherche → /cuvees?q=…', () => {
    render(<Home beers={beers} />);
    const input = screen.getByRole('textbox', { name: 'Rechercher une cuvée' });
    fireEvent.change(input, { target: { value: 'Citra é' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(push).toHaveBeenCalledWith('/cuvees?q=' + encodeURIComponent('Citra é'));
  });
  it('bandeau « Le brassoir en chiffres » : brassins, litres, houblon fétiche, kg de céréales', () => {
    render(<Home beers={beers} />);
    const sec = screen.getByRole('heading', { level: 2, name: 'Le brassoir en chiffres' }).closest('section')!;
    const figs = [...sec.querySelectorAll('.stat')].map(f => f.textContent);
    expect(figs[0]).toBe(`${beers.length}brassins depuis ${brewStats(beers).since}`);
    expect(figs.some(t => t!.includes('brassés à la maison'))).toBe(true);
    expect(figs).toContain(`${String(brewStats(beers).grainsKg).replace('.', ',')}\u00a0kgde céréales concassées`);
    expect(sec.textContent).not.toContain('d’alcool');
  });
  it('houblon fétiche omis s’il n’apparaît qu’une fois ; aucune bière : bandeau omis', () => {
    const one = beers.slice(0, 1).map(b => ({ ...b, hops: 'Citra' }));
    const { unmount } = render(<Home beers={one} />);
    expect(screen.queryByText(/houblon fétiche/)).toBeNull();
    unmount();
    render(<Home beers={[]} />);
    expect(screen.queryByText('Le brassoir en chiffres')).toBeNull();
  });
  it('section « Coups de cœur » sous les chiffres : toutes les cochées, la plus récente d’abord ; aucune cochée : section omise', () => {
    const flagged = beers.map(b => b.id === 'paul' || b.id === 'xmas-2025' ? { ...b, favorite: 1, description: 'Ma préférée.' } : b);
    const { unmount } = render(<Home beers={flagged} />);
    const h = screen.getByRole('heading', { level: 2, name: 'Coups de cœur' });
    const stats = screen.getByRole('heading', { level: 2, name: 'Le brassoir en chiffres' });
    expect(stats.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const cards = [...h.closest('section')!.querySelectorAll('a.news')];
    expect(cards.map(a => a.getAttribute('href'))).toEqual(['/biere/xmas-2025', '/biere/paul']);
    expect(cards[0].textContent).toContain('Ma préférée.');
    unmount();
    render(<Home beers={beers} />);
    expect(screen.queryByRole('heading', { level: 2, name: 'Coups de cœur' })).toBeNull();
  });
  it('cœur conservé sur la tuile coup de cœur', () => {
    const flagged = beers.map(b => b.id === 'paul' ? { ...b, favorite: 1 } : b);
    render(<Home beers={flagged} />);
    expect(screen.getByTitle('Coup de cœur').closest('a')!.getAttribute('href')).toBe('/biere/paul');
  });
});
