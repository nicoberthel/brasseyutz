'use client';
import React, { type CSSProperties } from 'react';
import { CuveeIcon } from './CuveeIcon';

export interface BeerCardProps {
  name?: string;
  styleName?: string;
  abv?: number | string;
  ibu?: number | string;
  ebc?: number | string;
  brew?: number | string;
  accent?: string;
  icon?: string;
  image?: string;
  description?: string;
  onClick?: () => void;
}

export function BeerCard({ name, styleName, abv, ibu, ebc, brew, accent = 'var(--cuvee-orange)', icon = 'Hop', image, description, onClick }: BeerCardProps) {
  const [h, setH] = React.useState(false);
  const w = String(name || '').split(' ');
  const a = w.slice(0, Math.ceil(w.length / 2)).join(' '), b = w.slice(Math.ceil(w.length / 2)).join(' ');
  const cell: CSSProperties = { padding: '10px 14px', borderLeft: '1px solid var(--filet)' };
  const k: CSSProperties = { font: '500 10px var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' };
  const v: CSSProperties = { font: '400 24px/1.1 var(--font-display)', color: 'var(--text-strong)' };
  return <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: 'var(--surface-card)', border: `1px solid ${h ? 'var(--encre)' : 'var(--filet)'}`, cursor: onClick ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', transition: 'border-color var(--dur-fast)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--filet)', font: '500 11px var(--font-mono)', color: 'var(--text-strong)' }}><span style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>{styleName}</span>{brew != null && <span>N° {brew}</span>}</div>
    <div style={{ padding: '28px 16px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
      {image ? <img src={image} alt="" style={{ height: 56 }} /> : <CuveeIcon name={icon} size={44} color={accent} stroke={1.1} />}
      <div style={{ font: '400 36px/0.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>{a}{b && <><br /><i style={{ color: accent }}>{b}</i></>}</div>
      {description && <div style={{ font: '400 14px/1.45 var(--font-text)', color: 'var(--text-body)', maxWidth: 260, textWrap: 'pretty' }}>{description}</div>}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--filet)', marginTop: 'auto' }}>
      {([['Alc.', String(abv).replace('.', ',') + ' %'], ['EBC', ebc], ['IBU', ibu]] as [string, string | number | undefined][]).map(([x, y], i) => <div key={x} style={{ ...cell, borderLeft: i ? cell.borderLeft : 'none' }}><div style={k}>{x}</div><div style={v}>{y ?? '—'}</div></div>)}
    </div>
  </div>;
}
