// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { describe as gaugeDescribe, level } from '@/components/ds/Gauge';
import { labelProps } from '@/lib/label';

describe('Gauge', () => {
  it('describe ebc/ibu', () => {
    expect(gaugeDescribe('ebc', 11)).toBe('Dorée');
    expect(gaugeDescribe('ebc', 80)).toBe('Noire');
    expect(gaugeDescribe('ibu', 40)).toBe('Marquée');
  });
  it('level bornes', () => {
    expect(level('ebc', 10)).toBe(1);
    expect(level('ibu', 100)).toBe(5);
  });
});

describe('CuveeIcon', () => {
  it('rend un svg pour un nom connu', () => {
    const { container } = render(<CuveeIcon name="Hop" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
  it('placeholder pour un nom inconnu', () => {
    const { container } = render(<CuveeIcon name="Inexistant" />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('span')).toBeTruthy();
  });
});

describe('BeerLabel', () => {
  const base = labelProps({
    name: 'Hop Overflow', styleName: 'NEIPA', brew: 33, abv: '5', ebc: '11', ibu: '40',
    bottle: '75cl', accent: 'var(--cuvee-orange)', icon: 'Hop',
    malts: '*Orge* : Pale Ale', hops: 'Citra', yeast: 'Verdant IPA', other: 'Eau, sucre',
    bottledOn: '07/05/2026', bestBefore: '05/2027', lot: '',
  });
  it('rend dénomination, TAV, volume, lot auto', () => {
    render(<BeerLabel {...base} />);
    expect(screen.getByText(/Bière NEIPA · 5 % vol\./)).toBeTruthy();
    expect(screen.getByText('75 cl')).toBeTruthy();
    expect(screen.getByText('L2605-33')).toBeTruthy();
    expect(screen.getByText('Dorée')).toBeTruthy(); // qualificatif EBC 11
  });
  it('allergène en gras capitales', () => {
    render(<BeerLabel {...base} />);
    const b = screen.getAllByText('Orge').find(e => e.tagName === 'B');
    expect(b).toBeTruthy();
  });
  it('nom un seul mot : pas de <i> vide, pas de crash', () => {
    const { container } = render(<BeerLabel {...labelProps({ name: 'Paul', styleName: 'Triple', brew: 31, abv: '8,2' })} />);
    const italics = [...container.querySelectorAll('i')].filter(i => !i.textContent);
    expect(italics).toHaveLength(0);
  });
  it('monochrome : accent devient encre', () => {
    const { container } = render(<BeerLabel {...labelProps({ name: 'X Y', styleName: 'Pils', brew: 1, abv: '5', accent: 'var(--cuvee-bleu)' }, 1, { monochrome: true })} />);
    expect(container.innerHTML).not.toContain('var(--cuvee-bleu)');
  });
});

describe('BeerLabel — jauges dans la case (débordement du dos)', () => {
  it('colonnes stats en minmax(0,1fr) et cellules overflow hidden', () => {
    const { container } = render(<BeerLabel {...labelProps({ name: 'Hop Overflow', styleName: 'NEIPA', brew: 33, abv: '5', ebc: '11', ibu: '40' })} />);
    const grid = [...container.querySelectorAll('div')].find(d => d.style.gridTemplateColumns.startsWith('14mm'))!;
    expect(grid.style.gridTemplateColumns).toBe('14mm minmax(0,1fr) minmax(0,1fr)');
    const cells = [...grid.children] as HTMLElement[];
    expect(cells).toHaveLength(3);
    cells.slice(1).forEach(c => expect(c.style.overflow).toBe('hidden'));
  });
});

describe('BeerLabel — cellules stats réorganisées', () => {
  it('unités en tête (Couleur / EBC, Amertume / IBU) et qualificatif à droite de la jauge', () => {
    const { container } = render(<BeerLabel {...labelProps({ name: 'Hop Overflow', styleName: 'NEIPA', brew: 33, abv: '5', ebc: '11', ibu: '40' })} />);
    expect(screen.getAllByText('Couleur / EBC').length).toBe(1);
    expect(screen.getAllByText('Amertume / IBU').length).toBe(1);
    // le qualificatif partage sa ligne avec le chiffre ; la jauge, pleine largeur, est en dessous
    const desc = screen.getByText('Marquée');
    const row = desc.parentElement!;
    expect(row.textContent).toContain('40');
    expect(row.querySelector('[data-gauge]')).toBeNull();
    expect(row.parentElement!.querySelector('[data-gauge]')).toBeTruthy();
  });
});

describe('Logo B5 (anneau-crosse)', () => {
  it('SignatureH : BRASSE / filet / YUTZ à gauche du logo, 52 px par défaut, version simple', async () => {
    const { SignatureH } = await import('@/components/ds/Logo');
    const { container } = render(<SignatureH />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-layout')).toBe('horizontal');
    const svg = root.querySelector('svg')!;
    expect(svg.getAttribute('data-detail')).toBe('0');
    expect(svg.style.height).toBe('52px');
    expect(root.firstElementChild!.tagName).toBe('SPAN'); // texte avant le logo
    expect(root.lastElementChild!.tagName).toBe('svg');
    expect(container.textContent).toContain('Brasse');
    expect(container.textContent).toContain('Yutz');
    expect(container.textContent).not.toContain('maison');
  });
  it('détail automatique : 64 px et 17 mm détaillés, 48 px et 9 mm simples, forçable', async () => {
    const { LogoMark, autoDetail } = await import('@/components/ds/Logo');
    expect(autoDetail(64, 'px')).toBe(true);
    expect(autoDetail(63, 'px')).toBe(false);
    expect(autoDetail(17, 'mm')).toBe(true);
    expect(autoDetail(9, 'mm')).toBe(false);
    const big = render(<LogoMark size={64} />).container.querySelector('svg')!;
    expect(big.getAttribute('data-detail')).toBe('1');
    expect(big.querySelectorAll('path[stroke-width="0.5"], path[stroke-width=".5"]').length).toBe(1); // second filet
    const forced = render(<LogoMark size={120} detail={false} />).container.querySelector('svg')!;
    expect(forced.getAttribute('data-detail')).toBe('0');
  });
  it('knock papier : découpes peintes, pas de masque ; inverse : masques et encre papier', async () => {
    const { Logo, LogoMark } = await import('@/components/ds/Logo');
    const painted = render(<LogoMark size={48} />).container.querySelector('svg')!;
    expect(painted.querySelector('mask')).toBeNull();
    expect(painted.querySelectorAll('rect[fill="var(--papier)"]').length).toBe(3); // croix de Lorraine
    const inv = render(<Logo size={48} inverse />).container.querySelector('svg')!;
    expect(inv.querySelectorAll('mask').length).toBe(8); // anneau, mitre, 6 écailles
    expect(inv.querySelector('path[fill="var(--papier)"]')).toBeTruthy();
    expect(inv.querySelector('[stroke="var(--encre)"]')).toBeNull();
  });
  it('ancien dessin disparu : plus de cercle fermé ni de mitre B4', async () => {
    const { LogoMark } = await import('@/components/ds/Logo');
    const html = render(<LogoMark size={48} />).container.innerHTML;
    expect(html).not.toContain('<circle');
    expect(html).not.toContain('M30 52V36Q30 16 50 3');
  });
});

describe('CuveeIcon gabarit', () => {
  it('CuveeIcon rend Eye, Hourglass, ArrowRight', () => {
    for (const name of ['Eye', 'Hourglass', 'ArrowRight']) {
      const { container, unmount } = render(<CuveeIcon name={name} />);
      expect(container.querySelector('svg'), name).not.toBeNull();
      unmount();
    }
  });
});
