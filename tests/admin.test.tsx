// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { AdminList } from '@/app/admin/admin-list';
import { EditForm } from '@/app/admin/biere/[id]/edit-form';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';
import { parseGrains, parseMash, toCol } from '@/lib/recipe';
import { legacyToRecipe } from '@/lib/recipe-legacy';

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
  const site = 'https://www.brasseyutz.fr';
  const byId = (id: string) => beers.find(b => b.id === id)!;
  const edit = (beer: Beer) => render(<EditForm beer={beer} nextBrew={35} siteUrl={site} />);
  const createNew = () => render(<EditForm beer={null} nextBrew={35} siteUrl={site} />);
  const count = (sel: string) => document.querySelectorAll(sel).length;
  const mockFetch = (beer: Beer, status = 200) => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status, json: async () => beer });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  };
  const sentBody = (fetchMock: ReturnType<typeof vi.fn>) => JSON.parse(fetchMock.mock.calls[0][1].body);
  const save = () => fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
  afterEach(() => { vi.unstubAllGlobals(); });

  it('nouvelle bière : brew = max+1, titre « Nouvelle bière »', () => {
    createNew();
    expect((screen.getByLabelText(/N° de brassin/i) as HTMLInputElement).value).toBe('35');
    expect(screen.getByText('Nouvelle bière', { selector: 'h1,h2' })).toBeTruthy();
  });
  it('édition : formulaire pré-rempli, champ badge présent', () => {
    edit(byId('paul'));
    expect((screen.getByLabelText(/^Nom$/i) as HTMLInputElement).value).toBe('Paul');
    expect(screen.getByText(/Modifier « Paul »/)).toBeTruthy();
    expect((screen.getByLabelText(/Coup de cœur/i) as HTMLInputElement).type).toBe('checkbox');
  });
  it('nouvelle bière : 4 lignes de malts et 3 de houblons pré-remplies', () => {
    createNew();
    expect(count('input[aria-label^="Nom du grain"]')).toBe(4);
    // « Nom du grain n » commence aussi par « Nom » : on compte dans le bloc Houblonnage
    const hops = screen.getByRole('group', { name: 'Houblonnage' });
    expect(hops.querySelectorAll('input[aria-label^="Nom "]')).toHaveLength(3);
    expect((screen.getByLabelText('Nom du grain 1') as HTMLInputElement).value).toBe('Pale Ale');
    expect((screen.getByLabelText('kg 1') as HTMLInputElement).value).toBe('3,6');
    expect((screen.getByLabelText('Nom 3') as HTMLInputElement).value).toBe('Citra');
    expect((screen.getByLabelText('Étape 3') as HTMLSelectElement).value).toBe('Dry hop');
    expect((screen.getByLabelText('Pas de radar') as HTMLInputElement).checked).toBe(true);
    expect(screen.queryByText(/Une ligne par élément/)).toBeNull();
  });
  it('édition d’une bière seed : select Famille = brune pour Dark Mode, case Pas de radar cochée, aucun curseur', () => {
    edit(byId('dark-mode'));
    expect((screen.getByLabelText('Famille') as HTMLSelectElement).value).toBe('brune');
    expect((screen.getByLabelText('Pas de radar') as HTMLInputElement).checked).toBe(true);
    expect(count('input[type="range"]')).toBe(0);
    expect(count('input[aria-label^="Nom du grain"]')).toBe(4);
    expect((screen.getByLabelText('kg 1') as HTMLInputElement).value).toBe('3,2');
  });
  it('enregistrer envoie grains en tableau et famille présente', async () => {
    const fetchMock = mockFetch(byId('dark-mode'), 201);
    createNew();
    fireEvent.change(screen.getByLabelText(/^Nom$/i), { target: { value: 'Comet Ale' } });
    fireEvent.change(screen.getByLabelText(/^Style$/i), { target: { value: 'Pale Ale' } });
    fireEvent.change(screen.getByLabelText(/Alcool/i), { target: { value: '5,2' } });
    save();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = sentBody(fetchMock);
    expect(Array.isArray(body.grains)).toBe(true);
    expect(body.grains).toEqual([
      { nom: 'Pale Ale', kg: 3.6 }, { nom: 'Pilsen', kg: 0.6 },
      { nom: 'Malt de blé', kg: 0.4 }, { nom: 'Flocons de froment', kg: 0.3 },
    ]);
    expect('famille' in body).toBe(true);
    expect(body.famille).toBe('');
    expect(body.radar).toBe('');
    expect(body.hopSchedule).toHaveLength(3);
    expect(body.mash.paliers).toEqual([{ temp: 65, min: 60, label: 'Saccharification' }]);
    expect(body.mash.ebullitionMin).toBe(60);
    expect(body.ferment.paliers).toEqual([{ temp: 20, duree: '14 j', label: 'Fermentation principale' }]);
  });
  it('famille choisie et radar décoché sont envoyés', async () => {
    const fetchMock = mockFetch(byId('paul'));
    edit(byId('paul'));
    fireEvent.change(screen.getByLabelText('Famille'), { target: { value: 'blonde' } });
    fireEvent.click(screen.getByLabelText('Pas de radar'));
    fireEvent.change(screen.getByLabelText('Corps'), { target: { value: '3.5' } });
    save();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = sentBody(fetchMock);
    expect(body.famille).toBe('blonde');
    expect(body.radar).toEqual([0, 0, 3.5, 0, 0, 0, 0, 0]);
  });
  it('l’URL du QR suit le n° de brassin', () => {
    createNew();
    expect(screen.getByText('https://www.brasseyutz.fr/brassin/35')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/N° de brassin/i), { target: { value: '42' } });
    expect(screen.getByText('https://www.brasseyutz.fr/brassin/42')).toBeTruthy();
  });
  it('erreur client si champs requis vides', async () => {
    createNew();
    save();
    await waitFor(() => expect(screen.getByText('Nom, style, n° de brassin et alcool sont obligatoires.')).toBeTruthy());
  });
  it('enregistre via POST et affiche « Enregistré »', async () => {
    const fetchMock = mockFetch({ ...beers[0], id: 'comet-ale', name: 'Comet Ale', brew: 35 }, 201);
    createNew();
    fireEvent.change(screen.getByLabelText(/^Nom$/i), { target: { value: 'Comet Ale' } });
    fireEvent.change(screen.getByLabelText(/^Style$/i), { target: { value: 'Pale Ale' } });
    fireEvent.change(screen.getByLabelText(/Alcool/i), { target: { value: '5,2' } });
    save();
    await waitFor(() => expect(screen.getByText(/Enregistré ·/)).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith('/api/beers', expect.objectContaining({ method: 'POST' }));
    // la réponse (colonnes JSON) est rechargée dans le formulaire
    expect((screen.getByLabelText('Nom du grain 1') as HTMLInputElement).value).toBe('Munich Light');
  });
  it('bière legacy chargée puis sauvegardée sans modification → mash et grains inchangés', async () => {
    const legacy = {
      styleName: 'Triple',
      grains: 'Pilsner | 5,5 kg\nMunich | 0,5 kg\nCara Belge | 0,25 kg',
      hopSchedule: 'Chinook | 12 g | 60 min | Ébullition\nFuggle | 25 g | 15 min | Ébullition',
      mash: 'Empâtage | 64 °C | 75 min\nMash-out | 78 °C | 10 min',
      ferment: 'Abbaye Belgian | 20 °C | 14 jours',
      yeast: 'Abbaye Belgian', other: 'Eau, sucre',
    };
    const L = legacyToRecipe(legacy);
    const beer: Beer = {
      ...byId('paul'),
      grains: toCol(L.grains), hopSchedule: toCol(L.hopSchedule), mash: toCol(L.mash), ferment: toCol(L.ferment),
    };
    expect(parseMash(beer.mash)!.paliers.length).toBeGreaterThan(0);
    const fetchMock = mockFetch(beer);
    edit(beer);
    save();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = sentBody(fetchMock);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/beers/paul');
    expect(body.mash).toEqual(parseMash(beer.mash));
    expect(body.grains).toEqual(parseGrains(beer.grains));
  });
  it('palier sans température n’est pas envoyé', async () => {
    const fetchMock = mockFetch(byId('paul'));
    edit(byId('paul'));
    const mash = screen.getByRole('group', { name: 'Empâtage' });
    const before = parseMash(byId('paul').mash)!.paliers.length;
    fireEvent.click(within(mash).getByRole('button', { name: 'Ajouter un palier d’empâtage' }));
    save();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(sentBody(fetchMock).mash.paliers).toHaveLength(before);
  });
  it('palier avec libellé mais sans température : erreur, rien envoyé', async () => {
    const fetchMock = mockFetch(byId('paul'));
    edit(byId('paul'));
    const mash = screen.getByRole('group', { name: 'Empâtage' });
    const before = parseMash(byId('paul').mash)!.paliers.length;
    fireEvent.click(within(mash).getByRole('button', { name: 'Ajouter un palier d’empâtage' }));
    fireEvent.change(within(mash).getByLabelText(`Libellé ${before + 1}`), { target: { value: 'Protéines' } });
    save();
    expect(await screen.findByText(`Empâtage, palier ${before + 1} : température manquante.`)).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
