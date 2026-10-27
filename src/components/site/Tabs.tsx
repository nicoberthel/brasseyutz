'use client';
import { FAMILLES, type FamilleKey } from '@/lib/recipe';

export type TabValue = FamilleKey | 'toutes';

const ITEMS: [TabValue, string][] = [['toutes', 'Toutes'], ...FAMILLES.map(f => [f.key, f.label] as [TabValue, string])];

/* Onglets de familles à tiret arrondi sous l'actif. */
export function Tabs({ value, onChange }: { value: TabValue; onChange: (v: TabValue) => void }) {
  return (
    <div className="tabs" role="tablist">
      {ITEMS.map(([k, l]) => (
        <button key={k} type="button" role="tab" aria-selected={value === k} onClick={() => onChange(k)}
          className={'tab' + (value === k ? ' on' : '')}>{l}</button>
      ))}
    </div>
  );
}
