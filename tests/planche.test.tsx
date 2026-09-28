// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PlancheApp } from '@/app/admin/planche/planche-app';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', ...b })) as Beer[];
const app = () => render(<PlancheApp beers={beers} siteUrl="https://www.brasseyutz.fr" />);

describe('PlancheApp', () => {
  it('4 emplacements pré-remplis avec le dernier brassin + 4 sélecteurs de contenance', () => {
    app();
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects).toHaveLength(8); // 4 bières + 4 contenances
    const beerSelects = selects.filter(s => [...s.options].some(o => o.value === 'dark-mode'));
    expect(beerSelects).toHaveLength(4);
    beerSelects.forEach(s => expect(s.value).toBe('dark-mode'));
    const bottleSelects = selects.filter(s => [...s.options].some(o => o.value === '33cl'));
    expect(bottleSelects).toHaveLength(4);
    bottleSelects.forEach(s => expect(s.value).toBe('75cl')); // défaut = bouteille de la bière
  });
  it('defaultBeerId pré-remplit les 4 emplacements', () => {
    render(<PlancheApp beers={beers} siteUrl="https://www.brasseyutz.fr" defaultBeerId="paul" />);
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    const beerSelects = selects.filter(s => [...s.options].some(o => o.value === 'dark-mode'));
    beerSelects.forEach(s => expect(s.value).toBe('paul'));
  });
  it('variante 33 cl sur un emplacement → l’étiquette affiche 33 cl', () => {
    app();
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    const bottleSelects = selects.filter(s => [...s.options].some(o => o.value === '33cl'));
    fireEvent.change(bottleSelects[0], { target: { value: '33cl' } });
    expect(screen.getAllByText('33 cl').length).toBeGreaterThan(0);
  });
  it('un emplacement vide ne rend pas d’étiquette', () => {
    app();
    const selects = (screen.getAllByRole('combobox') as HTMLSelectElement[]).filter(s => [...s.options].some(o => o.value === 'dark-mode'));
    fireEvent.change(selects[0], { target: { value: '' } });
    const sheet = document.querySelector('[data-sheet]')!;
    expect(sheet.querySelectorAll('[data-slot]')).toHaveLength(4);
  });
  it('cases Repères de coupe / QR / 100 % noir présentes et actives', () => {
    app();
    expect((screen.getByLabelText(/Repères de coupe/) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText(/QR code/) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText(/100 % noir/) as HTMLInputElement).checked).toBe(false);
  });
});
