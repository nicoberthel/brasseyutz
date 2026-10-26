'use client';
import { CuveeIcon } from '@/components/ds/CuveeIcon';

export function Search({ value, onChange, onEnter, autoFocus }: {
  value: string; onChange: (v: string) => void; onEnter?: () => void; autoFocus?: boolean;
}) {
  return (
    <label className="search">
      <CuveeIcon name="Search" size={20} stroke={1.75} />
      <input value={value} autoFocus={autoFocus} onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') onEnter?.(); }}
        placeholder="Une bière, un style, un houblon… (Citra, NEIPA)" aria-label="Rechercher une cuvée" />
      {value
        ? <button type="button" onClick={() => onChange('')} aria-label="Effacer" style={{ display: 'grid' }}><CuveeIcon name="X" size={18} stroke={1.75} /></button>
        : null}
    </label>
  );
}
