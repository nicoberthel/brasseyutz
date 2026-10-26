// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, getDefaultNormalizer, render, screen } from '@testing-library/react';
import { Home } from '@/app/home';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

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
    expect(screen.getByText('Petits brassins, essais, ratés et belles réussites : chaque cuvée a sa fiche technique complète.')).toBeTruthy();
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
  it('carte « Dernier brassin · n° 34 » → /biere/dark-mode avec la mise en bouteille', () => {
    render(<Home beers={beers} />);
    const card = screen.getByText('Dernier brassin · n°\u00a034', KEEP_NBSP).closest('a')!;
    expect(card.getAttribute('href')).toBe('/biere/dark-mode');
    expect(card.classList.contains('news')).toBe(true);
    expect(card.textContent).toContain('Mise en bouteille le 27/09/2026');
    expect(card.textContent).toContain('— Munich Dunkel');
  });
  it('dernier brassin sans date de mise en bouteille : ligne omise ; aucune bière : carte omise', () => {
    const nodate = beers.map(b => b.id === 'dark-mode' ? { ...b, bottledOn: '' } : b);
    const { unmount } = render(<Home beers={nodate} />);
    expect(screen.getByText('Dernier brassin · n°\u00a034', KEEP_NBSP)).toBeTruthy();
    expect(screen.queryByText(/Mise en bouteille le/)).toBeNull();
    unmount();
    render(<Home beers={[]} />);
    expect(screen.queryByText(/Dernier brassin/)).toBeNull();
  });
  it('cœur conservé sur la tuile coup de cœur', () => {
    const flagged = beers.map(b => b.id === 'paul' ? { ...b, favorite: 1 } : b);
    render(<Home beers={flagged} />);
    expect(screen.getByTitle('Coup de cœur').closest('a')!.getAttribute('href')).toBe('/biere/paul');
  });
});
