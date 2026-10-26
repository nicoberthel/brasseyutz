import type { CSSProperties, ReactNode } from 'react';
import type { HopStage } from '@/lib/recipe';
import { CuveeIcon } from '@/components/ds/CuveeIcon';

/* Bloc de recette : pastille d'icône, titre serif, meta mono à droite. */
export function Blk({ icon, title, meta, accent, children }: {
  icon: string; title: string; meta?: ReactNode; accent: string; children?: ReactNode;
}) {
  return (
    <section className="blk">
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--papier)', display: 'grid', placeItems: 'center', color: accent, flex: 'none' }}>
          <CuveeIcon name={icon} size={22} stroke={1.6} />
        </span>
        <h3 style={{ margin: 0, flex: 1, font: '400 28px/1 var(--font-display)' }}>{title}</h3>
        {meta ? <span style={{ font: '500 13px var(--font-mono)', color: 'var(--text-body)', textAlign: 'right', whiteSpace: 'nowrap' }}>{meta}</span> : null}
      </header>
      {children}
    </section>
  );
}

/* Paliers : « 67 °C · Saccharification · 60 min ». */
export function Steps({ rows, accent }: { rows: { temp: number; label: string; right: string }[]; accent: string }) {
  return (
    <ol className="steps">
      {rows.map((r, i) => (
        <li key={i}><b style={{ color: accent }}>{r.temp}{' '}°C</b><span>{r.label}</span><em>{r.right}</em></li>
      ))}
    </ol>
  );
}

const STAGE: Record<HopStage, CSSProperties> = {
  'Ébullition': { background: 'var(--papier)', color: 'var(--encre)', border: '1px solid var(--filet)' },
  'Hopstand': { background: 'var(--papier-2)', color: 'var(--encre)', border: '0' },
  'Dry hop': { background: 'var(--encre)', color: 'var(--papier)', border: '0' },
  'Épices': { background: 'var(--papier)', color: 'var(--encre)', border: '1px dashed var(--encre-3)' },
};

export function StageBadge({ stage }: { stage: HopStage }) {
  return <span className="stage" data-stage={stage} style={STAGE[stage] ?? STAGE['Ébullition']}>{stage}</span>;
}
