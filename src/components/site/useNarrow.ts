import { useSyncExternalStore } from 'react';

/** Point de rupture mobile du gabarit (même seuil que `@media (max-width:760px)` dans globals.css). */
export const NARROW = '(max-width:760px)';

const canMatch = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

function subscribe(cb: () => void) {
  if (!canMatch()) return () => {};
  const m = window.matchMedia(NARROW);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}
const isNarrow = () => canMatch() && window.matchMedia(NARROW).matches;

/** Vrai sous 760 px. Rendu serveur : faux (la version large est hydratée, puis corrigée sans mismatch). */
export function useNarrow() {
  return useSyncExternalStore(subscribe, isNarrow, () => false);
}
