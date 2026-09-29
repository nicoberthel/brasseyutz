import type { CSSProperties } from 'react';
/* Marque B4 : mitre + barbe houblon en encre, croix de Lorraine découpée, anneau en couleur (marque : orange ; étiquette : couleur de cuvée).
   Signature « G » : logo, puis BRASSE / filet couleur / YUTZ justifiés à la même largeur, YUTZ plus grand. */
const sc = (x0: number, x1: number, y0: number, yb: number) => {
  const m = (x0 + x1) / 2, h = +((yb - y0) * .72 + y0).toFixed(2);
  return `M${x0} ${y0}Q${x0} ${h} ${m} ${yb}Q${x1} ${h} ${x1} ${y0}Z`;
};
const SCALES = ([[80, 102, [[42, 58]]], [68, 88, [[35, 50], [50, 65]]], [58, 76, [[28, 42.7], [42.7, 57.3], [57.3, 72]]]] as [number, number, [number, number][]][])
  .flatMap(([y0, yb, xs]) => xs.map(([a, b]) => sc(a, b, y0, yb)));
const MITRE = 'M30 52V36Q30 16 50 3Q70 16 70 36V52Z';

export interface LogoMarkProps {
  size?: number;
  unit?: 'px' | 'mm';
  ring?: string;
  ink?: string;
  knock?: string;
  style?: CSSProperties;
}

/* Sans masque : les découpes sont peintes à la couleur du fond (knock) → vectoriel net en PDF et en export PNG. */
export function LogoMark({ size = 48, unit = 'px', ring = 'var(--accent)', ink = 'var(--encre)', knock = 'var(--papier)', style }: LogoMarkProps) {
  return <svg viewBox="7 0 86 105" role="img" aria-label="Brasse-Yutz" style={{ height: size + unit, width: 'auto', display: 'block', overflow: 'visible', ...style }}>
    <circle cx="50" cy="58" r="40" fill="none" stroke={ring} strokeWidth="2.6" />
    <path d={MITRE} fill={ink} stroke={knock} strokeWidth="5" paintOrder="stroke" />
    <g fill={knock}><rect x="48.4" y="14" width="3.2" height="29" /><rect x="43.5" y="20" width="13" height="3" /><rect x="40.5" y="28" width="19" height="3" /></g>
    {SCALES.map((d, i) => <path key={i} d={d} fill={ink} stroke={knock} strokeWidth="2.6" strokeLinejoin="round" />)}
  </svg>;
}

const Just = ({ txt, w, fs, unit, color }: { txt: string; w: number; fs: number; unit: string; color: string }) =>
  <span style={{ display: 'flex', justifyContent: 'space-between', width: w + unit, font: `600 ${fs}${unit}/1 var(--font-text)`, textTransform: 'uppercase', color }}>
    {[...txt].map((l, i) => <span key={i}>{l}</span>)}
  </span>;

export function Signature({ size = 48, unit = 'px', ring = 'var(--accent)', ink = 'var(--encre)', knock = 'var(--papier)', style }: LogoMarkProps) {
  const w = size * 1.62;
  return <span aria-label="Brasse-Yutz" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.14 + unit, ...style }}>
    <LogoMark size={size} unit={unit} ring={ring} ink={ink} knock={knock} />
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.09 + unit }}>
      <Just txt="Brasse" w={w} fs={size * 0.26} unit={unit} color={ink} />
      <span style={{ width: w + unit, height: Math.max(size * 0.05, 0.4) + unit, background: ring }}></span>
      <Just txt="Yutz" w={w} fs={size * 0.42} unit={unit} color={ink} />
    </span>
  </span>;
}

/* Signature horizontale — logo et texte côte à côte : « Brasse—Yutz » en serif,
   trait d'union remplacé par le tiret épais couleur (readme du DS), sous-titre
   « Bières maison » en capitales espacées. */
export function SignatureH({ size = 44, ring = 'var(--accent)', ink = 'var(--encre)', knock = 'var(--papier)', style }: LogoMarkProps) {
  return <span aria-label="Brasse-Yutz — Bières maison" style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3, ...style }}>
    <LogoMark size={size} ring={ring} ink={ink} knock={knock} />
    <span style={{ display: 'flex', flexDirection: 'column', gap: size * 0.1 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.14, font: `400 ${size * 0.68}px/0.95 var(--font-display)`, letterSpacing: '-0.01em', color: ink, whiteSpace: 'nowrap' }}>
        Brasse<span aria-hidden style={{ width: size * 0.32, height: Math.max(size * 0.075, 2), background: ring, display: 'inline-block' }}></span>Yutz
      </span>
      <span style={{ font: `600 ${Math.max(size * 0.2, 9)}px var(--font-text)`, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--encre-3)', whiteSpace: 'nowrap' }}>Bières maison</span>
    </span>
  </span>;
}

export interface LogoProps {
  size?: number;
  inverse?: boolean;
  lockup?: boolean;
  ring?: string;
  style?: CSSProperties;
}

export function Logo({ size = 48, inverse = false, lockup = false, ring = 'var(--accent)', style }: LogoProps) {
  const ink = inverse ? 'var(--papier)' : 'var(--encre)';
  const knock = inverse ? 'var(--encre)' : 'var(--papier)';
  return lockup
    ? <Signature size={size} ring={ring} ink={ink} knock={knock} style={style} />
    : <span style={{ display: 'inline-block', ...style }}><LogoMark size={size} ring={ring} ink={ink} knock={knock} /></span>;
}
