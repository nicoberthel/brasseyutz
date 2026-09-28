// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Catalogue } from '@/app/catalogue';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', ...b })) as Beer[];

describe('Catalogue', () => {
  it('affiche titre, compteur et toutes les cartes', () => {
    render(<Catalogue beers={beers} />);
    expect(screen.getByText('Brassins', { selector: 'i' })).toBeTruthy();
    expect(screen.getByText('Toutes les recettes des bières de Brasse-Yutz')).toBeTruthy();
    expect(screen.getByText('6 bières')).toBeTruthy();
    expect(screen.getAllByText('Overflow').length).toBeGreaterThan(0); // carte + étiquette
  });
  it('recherche filtre sans accents', () => {
    render(<Catalogue beers={beers} />);
    fireEvent.change(screen.getByPlaceholderText(/Nom, style, houblon/), { target: { value: 'electrique' } });
    expect(screen.getByText('1 bière')).toBeTruthy();
  });
  it('aucun résultat → message avec la requête', () => {
    render(<Catalogue beers={beers} />);
    fireEvent.change(screen.getByPlaceholderText(/Nom, style, houblon/), { target: { value: 'xyz' } });
    expect(screen.getByText(/Aucune bière ne correspond à « xyz »/)).toBeTruthy();
  });
  it('les cartes n’affichent plus la contenance à côté du %', () => {
    render(<Catalogue beers={beers} />);
    expect(screen.queryByText(/% · 75 cl/)).toBeNull();
    expect(screen.queryByText(/% · 33 cl/)).toBeNull();
  });
  it('les cartes pointent vers /biere/<id>', () => {
    render(<Catalogue beers={beers} />);
    const link = screen.getAllByRole('link').find(a => a.getAttribute('href') === '/biere/hop-overflow');
    expect(link).toBeTruthy();
  });
});
