// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AdminList } from '@/app/admin/admin-list';
import { EditForm } from '@/app/admin/biere/[id]/edit-form';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn() }) }));
const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', artwork: '', favorite: 0, ...b })) as Beer[];

describe('AdminList', () => {
  const list = () => render(<AdminList beers={beers} />);
  it('liste compacte : 6 lignes, Modifier pointe vers la page d’édition', () => {
    list();
    const edits = screen.getAllByText('Modifier');
    expect(edits).toHaveLength(6);
    expect(edits[0].closest('a')!.getAttribute('href')).toBe('/admin/biere/dark-mode');
  });
  it('recherche filtre la liste', () => {
    list();
    fireEvent.change(screen.getByPlaceholderText(/Nom, style, houblon/), { target: { value: 'electrique' } });
    expect(screen.getAllByText('Modifier')).toHaveLength(1);
  });
  it('« Nouvelle bière » pointe vers /admin/biere/nouvelle', () => {
    list();
    expect(screen.getByText('Nouvelle bière').closest('a')!.getAttribute('href')).toBe('/admin/biere/nouvelle');
  });
});

describe('EditForm', () => {
  const editPaul = () => render(<EditForm beer={beers.find(b => b.id === 'paul')!} nextBrew={35} siteUrl="https://www.brasseyutz.fr" />);
  const createNew = () => render(<EditForm beer={null} nextBrew={35} siteUrl="https://www.brasseyutz.fr" />);

  it('nouvelle bière : brew = max+1, titre « Nouvelle bière »', () => {
    createNew();
    expect((screen.getByLabelText(/N° de brassin/i) as HTMLInputElement).value).toBe('35');
    expect(screen.getByText('Nouvelle bière', { selector: 'h1,h2' })).toBeTruthy();
  });
  it('édition : formulaire pré-rempli, champ badge présent', () => {
    editPaul();
    expect((screen.getByLabelText(/^Nom$/i) as HTMLInputElement).value).toBe('Paul');
    expect(screen.getByText(/Modifier « Paul »/)).toBeTruthy();
    expect((screen.getByLabelText(/Coup de cœur/i) as HTMLInputElement).type).toBe('checkbox');
  });
  it('nouvelle bière : recette pré-remplie sur le modèle Citra Xtra', () => {
    createNew();
    expect((screen.getByLabelText(/Malts & grains/i) as HTMLTextAreaElement).value).toContain('Pale Ale | 3,6 kg');
    expect((screen.getByLabelText(/Houblonnage/i) as HTMLTextAreaElement).value).toContain('dry hop J4');
  });
  it('l’URL du QR suit le n° de brassin', () => {
    createNew();
    expect(screen.getByText('https://www.brasseyutz.fr/brassin/35')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/N° de brassin/i), { target: { value: '42' } });
    expect(screen.getByText('https://www.brasseyutz.fr/brassin/42')).toBeTruthy();
  });
  it('erreur client si champs requis vides', async () => {
    createNew();
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.getByText('Nom, style, n° de brassin et alcool sont obligatoires.')).toBeTruthy());
  });
  it('enregistre via POST et affiche « Enregistré »', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ ...beers[0], id: 'comet-ale', name: 'Comet Ale', brew: 35 }) });
    vi.stubGlobal('fetch', fetchMock);
    createNew();
    fireEvent.change(screen.getByLabelText(/^Nom$/i), { target: { value: 'Comet Ale' } });
    fireEvent.change(screen.getByLabelText(/^Style$/i), { target: { value: 'Pale Ale' } });
    fireEvent.change(screen.getByLabelText(/Alcool/i), { target: { value: '5,2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.getByText(/Enregistré ·/)).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith('/api/beers', expect.objectContaining({ method: 'POST' }));
    vi.unstubAllGlobals();
  });
});
