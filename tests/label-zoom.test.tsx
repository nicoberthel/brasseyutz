// @vitest-environment jsdom
import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { LabelZoom } from '@/app/label-zoom';
import { labelProps } from '@/lib/label';

const props = labelProps({ name: 'Hop Overflow', styleName: 'NEIPA', brew: 33, abv: '5' });

function zoomOf(container: HTMLElement): number {
  const el = container.querySelector('[data-label-zoom]') as HTMLElement;
  return Number(el.style.zoom || 1);
}

describe('LabelZoom', () => {
  it('réduit l’étiquette sur mobile (formule du prototype)', () => {
    window.innerWidth = 375;
    let container: HTMLElement;
    act(() => { ({ container } = render(<LabelZoom {...props} />)); });
    // min(1.25, (min(375, 860) - 64) / 529) ≈ 0.588
    expect(zoomOf(container!)).toBeCloseTo((375 - 64) / 529, 2);
  });
  it('agrandit jusqu’à 1,25 sur grand écran', () => {
    window.innerWidth = 1400;
    let container: HTMLElement;
    act(() => { ({ container } = render(<LabelZoom {...props} />)); });
    expect(zoomOf(container!)).toBeCloseTo(1.25, 2);
  });
});
