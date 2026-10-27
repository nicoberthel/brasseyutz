// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Cuvees } from '@/app/cuvees/cuvees';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }), useSearchParams: () => new URLSearchParams() }));
const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', artwork: '', favorite: 0, famille: '', radar: '', description: '', ...b })) as Beer[];
const cards = (c: HTMLElement) => c.querySelectorAll('.cards > article.card');

describe('Cuvées', () => {
  it('requête initiale « xyz » : champ prérempli et « 404 — bière introuvable »', () => {
    const { container } = render(<Cuvees beers={beers} initialQuery="xyz" />);
    expect((screen.getByRole('textbox', { name: 'Rechercher une cuvée' }) as HTMLInputElement).value).toBe('xyz');
    expect(screen.getByText('404 — bière introuvable')).toBeTruthy();
    expect(cards(container)).toHaveLength(0);
  });
  it('6 cartes avec bouton « Fiche de brassin » vers /biere/<id>', () => {
    const { container } = render(<Cuvees beers={beers} initialQuery="" />);
    expect(cards(container)).toHaveLength(6);
    const btns = screen.getAllByText('Fiche de brassin');
    expect(btns).toHaveLength(6);
    expect(btns.map(b => b.closest('a')!.getAttribute('href'))).toEqual(beers.map(b => `/biere/${b.id}`));
  });
  it('ligne de titre : retour → /, titre « Cuvées »', () => {
    render(<Cuvees beers={beers} initialQuery="" />);
    expect(screen.getByLabelText('Retour').getAttribute('href')).toBe('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Cuvées' })).toBeTruthy();
  });
  it('onglets et recherche filtrent la grille', () => {
    const { container } = render(<Cuvees beers={beers} initialQuery="" />);
    fireEvent.click(screen.getByRole('tab', { name: 'Houblonnées' }));
    expect(cards(container)).toHaveLength(2);
    fireEvent.change(screen.getByRole('textbox', { name: 'Rechercher une cuvée' }), { target: { value: 'mosaic' } });
    expect(cards(container)).toHaveLength(1);
  });
});
