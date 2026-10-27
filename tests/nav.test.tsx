// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

let mockPath = '/';
vi.mock('next/navigation', () => ({ usePathname: () => mockPath }));

import { BottomNav, Shell, TopNav } from '@/components/site/Nav';

afterEach(cleanup);

describe('Nav', () => {
  it('TopNav sur /biere/x : Cuvées actif (classe on)', () => {
    mockPath = '/biere/x';
    render(<TopNav />);
    expect(screen.getByText('Cuvées').className).toContain('on');
    expect(screen.getByText('Accueil').className).not.toContain('on');
  });
  it('TopNav sur /admin : aucun actif', () => {
    mockPath = '/admin';
    const { container } = render(<TopNav />);
    expect(container.querySelectorAll('.navlink.on').length).toBe(0);
  });
  it('BottomNav null sur /admin', () => {
    mockPath = '/admin';
    const { container } = render(<BottomNav />);
    expect(container.innerHTML).toBe('');
  });
  it('BottomNav sur / : Accueil aria-current=page', () => {
    mockPath = '/';
    const { container } = render(<BottomNav />);
    expect(container.querySelector('nav.bottom')).not.toBeNull();
    const cur = container.querySelectorAll('[aria-current="page"]');
    expect(cur.length).toBe(1);
    expect(cur[0].textContent).toBe('Accueil');
  });
  it("Shell n'enveloppe pas /admin/planche", () => {
    mockPath = '/admin/planche';
    const { container } = render(<Shell><p>x</p></Shell>);
    expect(container.querySelector('.shell')).toBeNull();
    expect(container.querySelector('p')).not.toBeNull();
  });
  it('Shell enveloppe /cuvees dans .shell', () => {
    mockPath = '/cuvees';
    const { container } = render(<Shell><p>x</p></Shell>);
    expect(container.querySelector('.shell > p')).not.toBeNull();
  });
});
