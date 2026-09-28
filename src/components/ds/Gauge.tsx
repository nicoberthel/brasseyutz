import type { CSSProperties } from 'react';

const EBC = 'linear-gradient(90deg,var(--ebc-4),var(--ebc-8) 10%,var(--ebc-12) 15%,var(--ebc-20) 25%,var(--ebc-30) 37%,var(--ebc-45) 56%,var(--ebc-70) 87%,var(--ebc-100))';
const EBC_SEG = ['var(--ebc-4)', 'var(--ebc-12)', 'var(--ebc-20)', 'var(--ebc-45)', 'var(--ebc-100)'];

export type GaugeKind = 'ebc' | 'ibu';

export function level(kind: GaugeKind, v: number): number {
  return kind === 'ebc' ? (v <= 10 ? 1 : v <= 16 ? 2 : v <= 30 ? 3 : v <= 60 ? 4 : 5) : (v <= 15 ? 1 : v <= 30 ? 2 : v <= 45 ? 3 : v <= 70 ? 4 : 5);
}

export function describe(kind: GaugeKind, v: number): string {
  if (kind === 'ebc') return v <= 10 ? 'Blonde' : v <= 16 ? 'Dorée' : v <= 30 ? 'Ambrée' : v <= 60 ? 'Brune' : 'Noire';
  return v <= 15 ? 'Légère' : v <= 30 ? 'Modérée' : v <= 45 ? 'Marquée' : v <= 70 ? 'Intense' : 'Extrême';
}

export interface GaugeProps {
  kind?: GaugeKind;
  value?: number;
  max?: number;
  unit?: 'px' | 'mm';
  accent?: string;
  variant?: 'segments' | 'gradient';
  showLabel?: boolean;
  style?: CSSProperties;
}

/* 5 segments (variant 'segments', défaut) : EBC = teintes de bière, IBU = couleur de cuvée. EBC variant 'gradient' = dégradé + repère. */
export function Gauge({ kind = 'ebc', value = 0, max, unit = 'px', accent = 'var(--accent)', variant = 'segments', showLabel = true, style }: GaugeProps) {
  const m = max ?? (kind === 'ebc' ? 80 : 100);
  const pct = Math.max(0, Math.min(100, value / m * 100));
  const u = (v: number) => v + unit;
  const mm = unit === 'mm';
  const h = mm ? 1.3 : 6;
  const fs = mm ? 2.2 : 11;
  const n = level(kind, value);
  const bar = kind === 'ebc' && variant === 'gradient'
    ? <span style={{ position: 'relative', display: 'block', height: u(h), background: EBC }}><span style={{ position: 'absolute', left: pct + '%', top: u(-h * 0.45), bottom: u(-h * 0.45), width: u(mm ? 0.45 : 2), marginLeft: u(mm ? -0.22 : -1), background: 'var(--encre)' }}></span></span>
    : <span style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: u(mm ? 0.5 : 3), height: u(h) }}>{[0, 1, 2, 3, 4].map(i => <span key={i} style={{ background: i < n ? (kind === 'ebc' ? EBC_SEG[i] : accent) : 'var(--filet)' }}></span>)}</span>;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: u(mm ? 0.9 : 5), ...style }}>
    {showLabel && <span style={{ display: 'flex', justifyContent: 'space-between', font: `500 ${u(fs)} var(--font-mono)`, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}><span>{kind === 'ebc' ? 'Couleur' : 'Amertume'}</span><span style={{ color: 'var(--text-strong)' }}>{kind.toUpperCase()} {value}</span></span>}
    {bar}
  </div>;
}
