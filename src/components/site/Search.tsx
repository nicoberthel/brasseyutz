'use client';
import { useSyncExternalStore } from 'react';
import { CuveeIcon } from '@/components/ds/CuveeIcon';

const NARROW = '(max-width:760px)';
const PLACEHOLDER = 'Une bière, un style, un houblon… (Citra, NEIPA)';
const PLACEHOLDER_SHORT = 'Une bière, un style, un houblon…';

function subscribe(cb: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const m = window.matchMedia(NARROW);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}
const isNarrow = () => typeof window.matchMedia === 'function' && window.matchMedia(NARROW).matches;

export function Search({ value, onChange, onEnter, autoFocus }: {
  value: string; onChange: (v: string) => void; onEnter?: () => void; autoFocus?: boolean;
}) {
  const narrow = useSyncExternalStore(subscribe, isNarrow, () => false);
  return (
    <label className="search">
      <CuveeIcon name="Search" size={20} stroke={1.75} />
      <input value={value} autoFocus={autoFocus} onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onEnter?.(); }}
        placeholder={narrow ? PLACEHOLDER_SHORT : PLACEHOLDER} aria-label="Rechercher une cuvée" />
      {value
        ? <button type="button" onClick={() => onChange('')} aria-label="Effacer" style={{ display: 'grid' }}><CuveeIcon name="X" size={18} stroke={1.75} /></button>
        : null}
    </label>
  );
}
