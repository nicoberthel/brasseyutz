// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PlancheApp } from '@/app/admin/planche/planche-app';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', ...b })) as Beer[];
const app = () => render(<PlancheApp beers={beers} siteUrl="https://www.brasseyutz.fr" />);

describe('PlancheApp', () => {
  it('4 emplacements pré-remplis avec le dernier brassin', () => {
    app();
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(4);
    selects.forEach(s => expect((s as HTMLSelectElement).value).toBe('dark-mode'));
  });
  it('un emplacement vide ne rend pas d’étiquette', () => {
    app();
    const selects = screen.getAllByRole('combobox');
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
