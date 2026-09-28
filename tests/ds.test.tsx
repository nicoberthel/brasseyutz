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
