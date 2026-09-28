// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { brewUrl, qrSvgString, QrSvg, QrStyled } from '@/lib/qr';

describe('brewUrl', () => {
  it('compose l’URL', () => expect(brewUrl('https://www.brasseyutz.fr', 33)).toBe('https://www.brasseyutz.fr/brassin/33'));
  it('tolère le slash final', () => expect(brewUrl('https://www.brasseyutz.fr/', 33)).toBe('https://www.brasseyutz.fr/brassin/33'));
});

describe('qrSvgString', () => {
  it('SVG scannable minimal', () => {
    const s = qrSvgString('https://www.brasseyutz.fr/brassin/33');
    expect(s).toContain('<svg');
    expect(s).toContain('#161616');
    expect(s).toContain('fill="#fff"');
  });
});

describe('QrSvg / QrStyled', () => {
  it('QrSvg rend un path de modules', () => {
    const { container } = render(<QrSvg url="https://www.brasseyutz.fr/brassin/33" />);
    expect(container.querySelector('svg path')).toBeTruthy();
  });
  it('QrStyled rend œils accent + icône centrale', () => {
    const { container } = render(<QrStyled url="https://www.brasseyutz.fr/brassin/33" accent="var(--cuvee-orange)" />);
    const rects = container.querySelectorAll('rect[stroke="var(--cuvee-orange)"]');
    expect(rects.length).toBe(3);
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2); // QR + houblon
  });
});
