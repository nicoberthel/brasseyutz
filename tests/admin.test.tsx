// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AdminApp } from '@/app/admin/admin-app';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', ...b })) as Beer[];
const app = () => render(<AdminApp initial={beers} siteUrl="https://www.brasseyutz.fr" />);

describe('AdminApp', () => {
  it('table des brassins triée + formulaire « Nouvelle bière » avec brew = max+1', () => {
    app();
    expect(screen.getByText('brassins', { selector: 'i' })).toBeTruthy();
    const rows = screen.getAllByText(/^Voir$/);
    expect(rows).toHaveLength(6);
    expect((screen.getByLabelText(/N° de brassin/i) as HTMLInputElement).value).toBe('35');
  });
  it('Modifier pré-remplit le formulaire', () => {
    app();
    fireEvent.click(screen.getAllByText('Modifier')[0]);
    expect((screen.getByLabelText(/^Nom$/i) as HTMLInputElement).value).toBe('Dark Mode');
    expect(screen.getByText(/Modifier « Dark Mode »/)).toBeTruthy();
  });
  it('l’URL du QR suit le n° de brassin', () => {
    app();
    expect(screen.getByText('https://www.brasseyutz.fr/brassin/35')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/N° de brassin/i), { target: { value: '42' } });
    expect(screen.getByText('https://www.brasseyutz.fr/brassin/42')).toBeTruthy();
  });
  it('erreur client si champs requis vides', async () => {
    app();
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.getByText('Nom, style, n° de brassin et alcool sont obligatoires.')).toBeTruthy());
  });
  it('enregistre via POST et affiche « Enregistré »', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ ...beers[0], id: 'comet-ale', name: 'Comet Ale', brew: 35 }) });
    vi.stubGlobal('fetch', fetchMock);
    app();
    fireEvent.change(screen.getByLabelText(/^Nom$/i), { target: { value: 'Comet Ale' } });
    fireEvent.change(screen.getByLabelText(/^Style$/i), { target: { value: 'Pale Ale' } });
    fireEvent.change(screen.getByLabelText(/Alcool/i), { target: { value: '5,2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.getByText(/Enregistré ·/)).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith('/api/beers', expect.objectContaining({ method: 'POST' }));
    vi.unstubAllGlobals();
  });
});
