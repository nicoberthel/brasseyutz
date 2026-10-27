'use client';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { useNarrow } from './useNarrow';

const PLACEHOLDER = 'Une bière, un style, un houblon… (Citra, NEIPA)';
const PLACEHOLDER_SHORT = 'Une bière, un style, un houblon…';

export function Search({ value, onChange, onEnter, autoFocus }: {
  value: string; onChange: (v: string) => void; onEnter?: () => void; autoFocus?: boolean;
}) {
  const narrow = useNarrow();
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
