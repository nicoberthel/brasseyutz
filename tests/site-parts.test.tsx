// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';
import { CodeLink, CuveeCard, CuveeTile, Empty, PhotoCard, soft } from '@/components/site/Cards';
import { LabelThumb } from '@/components/site/LabelThumb';
import { Tabs } from '@/components/site/Tabs';
import { Search } from '@/components/site/Search';
import { StageBadge, Steps } from '@/components/site/Blk';

const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', artwork: '', favorite: 0, famille: '', radar: '', ...b })) as Beer[];
const get = (id: string) => beers.find(b => b.id === id)!;

describe('soft', () => {
  it('teinte douce d’une couleur de cuvée, papier écran sinon', () => {
    expect(soft('var(--cuvee-orange)')).toBe('var(--cuvee-orange-soft)');
    expect(soft('#ff0000')).toBe('var(--papier-ecran)');
  });
});

describe('Briques du site', () => {
  it('CuveeTile : nom, édition en <i>, « 5,5 % », style, lien /biere/hop-overflow', () => {
    const { container } = render(<><CuveeTile beer={get('xmas-2025')} /><CuveeTile beer={get('hop-overflow')} /></>);
    // l'étiquette affiche aussi le nom : on cible le titre de la tuile, hors étiquette
    const editions = screen.getAllByText('2025', { selector: 'i' }).filter(i => !i.closest('[data-label-thumb]'));
    expect(editions).toHaveLength(1);
    expect(editions[0].parentElement!.textContent).toBe('Xmas 2025');
    expect(screen.getByText('5,5 %')).toBeTruthy();
    expect(screen.getAllByText('Bière de Noël').filter(e => !e.closest('[data-label-thumb]'))).toHaveLength(1);
    const link = screen.getAllByRole('link').find(a => a.getAttribute('href') === '/biere/hop-overflow');
    expect(link).toBeTruthy();
    expect(link!.className).toContain('tile');
    expect(container.querySelectorAll('[data-label-thumb]').length).toBe(2);
    // sans édition : nom entier d'un seul tenant, sans <i> ; l'étiquette est masquée aux lecteurs d'écran
    const name = screen.getAllByText('Hop Overflow').find(e => !e.closest('[data-label-thumb]'))!;
    expect(name.querySelector('i')).toBeNull();
    expect(Array.from(name.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent)).toEqual(['Hop Overflow']);
    expect(link!.querySelector('[data-label-thumb]')!.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('link', { name: /^Hop Overflow/ })).toBe(link);
  });

  it('CuveeCard : nom sans édition non découpé', () => {
    const { container } = render(<CuveeCard beer={get('hop-overflow')} />);
    const name = screen.getAllByText('Hop Overflow').find(e => !e.closest('[data-label-thumb]'))!;
    expect(name.querySelector('i')).toBeNull();
    expect(container.querySelector('[data-label-thumb]')!.getAttribute('aria-hidden')).toBeNull();
  });

  it('CuveeCard : stats « 40 IBU », « Brassin 33 », bouton « Fiche de brassin », mini Couleur/Amertume omises si ebc/ibu vides', () => {
    const b = get('hop-overflow');
    const { container, unmount } = render(<CuveeCard beer={b} />);
    expect(screen.getByText('40 IBU')).toBeTruthy();
    expect(screen.getByText('Brassin 33')).toBeTruthy();
    expect(screen.getByText('5 % vol')).toBeTruthy();
    expect(screen.getByText('Fiche de brassin')).toBeTruthy();
    expect(screen.getByText('Couleur · 11 EBC')).toBeTruthy();
    expect(screen.getByText('Amertume · 40 IBU')).toBeTruthy();
    expect(container.querySelectorAll('.mini').length).toBe(2);
    unmount();
    const { container: c2 } = render(<CuveeCard beer={{ ...b, ebc: '', ibu: '' }} />);
    expect(c2.querySelectorAll('.mini').length).toBe(0);
    expect(screen.queryByText(/\d IBU/)).toBeNull();
  });

  it('CuveeCard : cœur si coup de cœur', () => {
    render(<CuveeCard beer={{ ...get('paul'), favorite: 1 }} />);
    expect(screen.getByTitle('Coup de cœur')).toBeTruthy();
  });

  it('LabelThumb avec labelImage rend <img>', () => {
    render(<LabelThumb beer={{ ...get('hop-overflow'), labelImage: '/uploads/x.png' }} />);
    const img = screen.getByAltText('Étiquette Hop Overflow') as HTMLImageElement;
    expect(img.tagName).toBe('IMG');
    expect(img.getAttribute('src')).toBe('/uploads/x.png');
  });

  it('LabelThumb sans image : BeerLabel avec l’ombre écran, sans ombre print', () => {
    const { container } = render(<LabelThumb beer={get('hop-overflow')} tilt={-2} />);
    const inner = container.querySelector('[data-label-thumb] > div') as HTMLElement;
    expect(inner.style.boxShadow).toBe('var(--shadow-web)');
    expect(inner.style.transform).toBe('rotate(-2deg)');
    expect(container.innerHTML).not.toContain('--shadow-print');
  });

  it('Tabs : 6 onglets, aria-selected sur l’actif', () => {
    const seen: string[] = [];
    render(<Tabs value="blonde" onChange={v => seen.push(v)} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(6);
    expect(tabs[0].textContent).toBe('Toutes');
    const on = tabs.filter(t => t.getAttribute('aria-selected') === 'true');
    expect(on).toHaveLength(1);
    expect(on[0].textContent).toBe('Blondes');
    expect(on[0].className).toBe('tab on');
    fireEvent.click(tabs[0]);
    expect(seen).toEqual(['toutes']);
  });

  it('Search : saisie, Entrée et bouton Effacer', () => {
    const seen: string[] = []; let entered = 0;
    const { rerender } = render(<Search value="" onChange={v => seen.push(v)} onEnter={() => entered++} />);
    const input = screen.getByLabelText('Rechercher une cuvée');
    expect(input.getAttribute('placeholder')).toBe('Une bière, un style, un houblon… (Citra, NEIPA)');
    expect(screen.queryByLabelText('Effacer')).toBeNull();
    fireEvent.change(input, { target: { value: 'citra' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(seen).toEqual(['citra']);
    expect(entered).toBe(1);
    rerender(<Search value="citra" onChange={v => seen.push(v)} />);
    fireEvent.click(screen.getByLabelText('Effacer'));
    expect(seen).toEqual(['citra', '']);
  });

  it('Empty sans requête : message famille vide', () => {
    render(<Empty q="  " />);
    expect(screen.getByText("Aucune cuvée dans cette famille pour l'instant")).toBeTruthy();
    expect(screen.queryByText(/404/)).toBeNull();
  });
  it('Empty affiche « 404 — bière introuvable » et la requête', () => {
    render(<Empty q="xyz" />);
    expect(screen.getByText('404 — bière introuvable')).toBeTruthy();
    expect(screen.getByText(/Rien pour « xyz »/)).toBeTruthy();
  });

  it('StageBadge Dry hop fond encre', () => {
    render(<StageBadge stage="Dry hop" />);
    const el = screen.getByText('Dry hop');
    expect(el.className).toBe('stage');
    expect(el.style.background).toContain('var(--encre)');
    expect(el.style.color).toBe('var(--papier)');
  });

  it('Steps : température en couleur de cuvée, libellé et durée', () => {
    const { container } = render(<Steps rows={[{ temp: 67, label: 'Saccharification', right: '60 min' }]} accent="var(--cuvee-orange)" />);
    const b = container.querySelector('.steps li b') as HTMLElement;
    expect(b.textContent).toBe('67\u00a0°C');
    expect(b.style.color).toBe('var(--cuvee-orange)');
    expect(screen.getByText('Saccharification')).toBeTruthy();
    expect(screen.getByText('60 min')).toBeTruthy();
  });

  it('Steps : température décimale à virgule', () => {
    const { container } = render(<Steps rows={[{ temp: 65.5, label: 'Protéines', right: '15 min' }]} accent="var(--cuvee-orange)" />);
    expect(container.querySelector('.steps li b')!.textContent).toBe('65,5 °C');
  });

  it('CodeLink : aria-label Ouvrir la fiche de …', () => {
    render(<CodeLink beer={get('hop-overflow')} />);
    const a = screen.getByLabelText('Ouvrir la fiche de Hop Overflow');
    expect(a.getAttribute('href')).toBe('/biere/hop-overflow');
    expect(a.className).toBe('cmd');
  });

  it('PhotoCard : lien, légende nom et « % · style »', () => {
    render(<PhotoCard beer={get('xmas-2025')} />);
    const a = screen.getByRole('link', { name: /^Xmas 2025/ });
    expect(screen.getAllByText('2025', { selector: 'i' }).filter(i => !i.closest('[data-label-thumb]'))).toHaveLength(1);
    expect(a.querySelector('[data-label-thumb]')!.getAttribute('aria-hidden')).toBe('true');
    expect(a.getAttribute('href')).toBe('/biere/xmas-2025');
    expect(a.className).toBe('photo');
    expect(screen.getByText('5,5 % · Bière de Noël')).toBeTruthy();
  });
});
