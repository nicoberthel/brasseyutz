'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import type { Beer } from '@/lib/schema';
import { labelProps } from '@/lib/label';
import { BeerLabel } from '@/components/ds/BeerLabel';

/* Largeur de l'étiquette 140 mm à l'échelle 1, en px CSS. */
const LABEL_W = 529.13;

/* Étiquette réelle ajustée à la largeur du conteneur (§5.4) ; image chargée si présente. */
export function LabelThumb({ beer, tilt = 0 }: { beer: Beer; tilt?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const transform = tilt ? `rotate(${tilt}deg)` : 'none';

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => { if (el.clientWidth) setScale(el.clientWidth / LABEL_W); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (beer.labelImage) {
    return <img src={beer.labelImage} alt={`Étiquette ${beer.name}`}
      style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 4, boxShadow: 'var(--shadow-web)', transform }} />;
  }
  return (
    <div ref={ref} data-label-thumb style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ boxShadow: 'var(--shadow-web)', transform, borderRadius: 4, overflow: 'hidden', lineHeight: 0 }}>
        <BeerLabel {...labelProps(beer, scale)} style={{}} />
      </div>
    </div>
  );
}
