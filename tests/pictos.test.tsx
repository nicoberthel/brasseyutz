// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ICON_GROUPS } from '@/components/ds/icon-catalog';
import { CuveeIcon } from '@/components/ds/CuveeIcon';

describe('catalogue de pictos (design system, 44 entrées)', () => {
  it('44 pictos répartis en 5 groupes français', () => {
    const all = ICON_GROUPS.flatMap(g => g.icons);
    expect(all).toHaveLength(44);
    expect(ICON_GROUPS.map(g => g.group)).toEqual(['Ingrédients', 'Fruits & plantes', 'Saisons & ciel', 'Informatique', 'Fête & divers']);
    const names = all.map(([lucide]) => lucide);
    expect(names).toContain('Hop');
    expect(names).toContain('Rocket');
    expect(names).toContain('Ghost');
    expect(new Set(names).size).toBe(44); // pas de doublon
  });
  it('chaque picto du catalogue rend un svg colorisable', () => {
    for (const [lucide] of ICON_GROUPS.flatMap(g => g.icons)) {
      const { container, unmount } = render(<CuveeIcon name={lucide} color="var(--cuvee-orange)" />);
      expect(container.querySelector('svg'), `icône ${lucide} absente`).toBeTruthy();
      unmount();
    }
  });
});
