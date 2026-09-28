'use client';
import { useEffect, useState } from 'react';
import { BeerLabel, type LabelProps } from '@/components/ds/BeerLabel';

/* Zoom responsive de l'étiquette sur la fiche — formule du prototype :
   min(1,25, (min(vw, 860) − 64) / 529). SSR à 1, ajusté au montage. */
export function LabelZoom(props: LabelProps) {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const onResize = () => setZoom(Math.min(1.25, (Math.min(window.innerWidth, 860) - 64) / 529));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return <div data-label-zoom style={{ zoom }}><BeerLabel {...props} scale={1} /></div>;
}
