// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Radar } from '@/components/site/Radar';
import type { Radar as RadarValues } from '@/lib/recipe';

const values: RadarValues = [2.5, 3, 3, 1, 1.5, 0.5, 4.5, 3];

describe('Radar', () => {
  it('rend 5 polygones de grille + 1 polygone rempli + 8 points', () => {
    const { container } = render(<Radar values={values} accent="var(--cuvee-orange)" />);
    expect(container.querySelectorAll('polygon[data-radar-grid]').length).toBe(5);
    expect(container.querySelectorAll('polygon[data-radar-area]').length).toBe(1);
    expect(container.querySelectorAll('circle[data-radar-point]').length).toBe(8);
    expect(container.querySelectorAll('line').length).toBe(8);
  });
  it('aria-label contient « Amertume 2,5/5 »', () => {
    render(<Radar values={values} accent="var(--cuvee-orange)" />);
    const svg = screen.getByRole('img');
    expect(svg.getAttribute('aria-label')).toContain('Amertume 2,5/5');
    expect(svg.getAttribute('aria-label')).toMatch(/^Profil : /);
  });
  it('libellés et notes « 4,5/5 » présents', () => {
    const { container } = render(<Radar values={values} accent="var(--cuvee-orange)" />);
    const texts = Array.from(container.querySelectorAll('text')).map(t => t.textContent);
    expect(texts).toHaveLength(8);
    expect(texts).toContain('Malté4,5/5');
    expect(texts).toContain('Floral / herbacé1,5/5');
    expect(Array.from(container.querySelectorAll('tspan')).map(t => t.textContent)).toContain('4,5/5');
  });
});
