import { useId, type CSSProperties } from 'react';
/* Marque B5 : mitre + barbe houblon en encre, croix de Lorraine découpée, anneau-crosse en couleur (marque : orange ; étiquette : couleur de cuvée).
   Signature « G » : logo, puis BRASSE / filet couleur / YUTZ justifiés à la même largeur, YUTZ plus grand. */
const SCALES = [
  { d: 'M29 57C29 68.16 33.48 73.2 36 75C38.52 73.2 43 68.16 43 57Z', v: 'M36 60V71' },
  { d: 'M43 57C43 68.16 47.48 73.2 50 75C52.52 73.2 57 68.16 57 57Z', v: 'M50 60V71' },
  { d: 'M57 57C57 68.16 61.48 73.2 64 75C66.52 73.2 71 68.16 71 57Z', v: 'M64 60V71' },
  { d: 'M36 67.5C36 79.59 40.48 85.05 43 87C45.52 85.05 50 79.59 50 67.5Z', v: 'M43 70.5V83' },
  { d: 'M50 67.5C50 79.59 54.48 85.05 57 87C59.52 85.05 64 79.59 64 67.5Z', v: 'M57 70.5V83' },
  { d: 'M43 79C43 92.02 47.48 97.9 50 100C52.52 97.9 57 92.02 57 79Z', v: 'M50 82V96' },
];
const MITRE = 'M31 52V38C31 25 39 13 50 4C61 13 69 25 69 38V52Z';
const MITRE_IN = 'M33.6 50V38C33.6 26.5 40.6 16 50 7.6C59.4 16 66.4 26.5 66.4 38V50Z';
/* L'anneau s'ouvre derrière la mitre et s'enroule en crosse (Saint Nicolas). */
const CROSSE = 'M36.55 20.33A40 40 0 1 0 74 26C71 22 69.4 15.4 73 11.4C76.8 7.2 85 7.8 87.4 13C89.4 17.6 85.8 22 81.4 20.4';
const ARC_IN = 'M12.4 58A37.6 37.6 0 1 0 87.6 58A37.6 37.6 0 1 0 12.4 58Z';
const LOR: [number, number, number, number][] = [[48.85, 15, 2.3, 29], [45, 21, 10, 2.07], [42, 28.5, 16, 2.07]];

export type LogoUnit = 'px' | 'mm';

export interface LogoMarkProps {
  size?: number;
  unit?: LogoUnit;
  ring?: string;
  ink?: string;
  /** Couleur du fond : découpes peintes (vectoriel net en PDF). `'transparent'` : vraies découpes par masque, pour tout fond. */
  knock?: string;
  /** Double filet, contour de mitre, nervures. Défaut : automatique (≥ 64 px ou ≥ 17 mm). */
  detail?: boolean;
  style?: CSSProperties;
}

/** Niveau de détail automatique : détaillé à partir de 64 px à l'écran, 17 mm à l'impression. */
export const autoDetail = (size: number, unit: LogoUnit) => (unit === 'mm' ? size >= 17 : size >= 64);

const MitreCut = ({ d, c }: { d: boolean; c: string }) => <>
  {LOR.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={c} />)}
  {d && <path d={MITRE_IN} fill="none" stroke={c} strokeWidth=".6" />}
</>;
const Gap = ({ p, w }: { p: string; w: number }) => <path d={p} fill="#000" stroke="#000" strokeWidth={w} strokeLinejoin="round" />;

export function LogoMark({ size = 48, unit = 'px', ring = 'var(--accent)', ink = 'var(--encre)', knock = 'var(--papier)', detail, style }: LogoMarkProps) {
  const d = detail ?? autoDetail(size, unit);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const transparent = knock === 'transparent' || knock === 'none';
  const ringEl = <>
    <path d={CROSSE} fill="none" stroke={ring} strokeWidth={d ? 1.5 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
    {d && <path d={ARC_IN} fill="none" stroke={ring} strokeWidth=".5" />}
  </>;
  const svgProps = { viewBox: '7 0 86 105', role: 'img', 'aria-label': 'Brasse-Yutz', 'data-detail': d ? '1' : '0', style: { height: size + unit, width: 'auto', display: 'block', overflow: 'visible', ...style } as CSSProperties };
  if (transparent) {
    const W = <rect x="0" y="-5" width="100" height="115" fill="#fff" />;
    return <svg {...svgProps}>
      <defs>
        <mask id={uid + 'r'} maskUnits="userSpaceOnUse">{W}<Gap p={MITRE} w={3.4} />{SCALES.map((s, i) => <Gap key={i} p={s.d} w={1.6} />)}</mask>
        <mask id={uid + 'm'} maskUnits="userSpaceOnUse">{W}<MitreCut d={d} c="#000" /></mask>
        {SCALES.map((s, i) => <mask key={i} id={uid + 's' + i} maskUnits="userSpaceOnUse">
          {W}
          {d && <path d={s.v} stroke="#000" strokeWidth=".6" strokeLinecap="round" />}
          {SCALES.slice(i + 1).map((t, k) => <Gap key={k} p={t.d} w={1.6} />)}
        </mask>)}
      </defs>
      <g mask={'url(#' + uid + 'r)'}>{ringEl}</g>
      <path d={MITRE} fill={ink} mask={'url(#' + uid + 'm)'} />
      {SCALES.map((s, i) => <path key={i} d={s.d} fill={ink} mask={'url(#' + uid + 's' + i + ')'} />)}
    </svg>;
  }
  return <svg {...svgProps}>
    {ringEl}
    <path d={MITRE} fill={ink} stroke={knock} strokeWidth="3.4" paintOrder="stroke" />
    <MitreCut d={d} c={knock} />
    {SCALES.map((s, i) => <g key={i}>
      <path d={s.d} fill={ink} stroke={knock} strokeWidth="1.6" strokeLinejoin="round" />
      {d && <path d={s.v} stroke={knock} strokeWidth=".6" strokeLinecap="round" />}
    </g>)}
  </svg>;
}

const Just = ({ txt, w, fs, unit, color }: { txt: string; w: number; fs: number; unit: string; color: string }) =>
  <span style={{ display: 'flex', justifyContent: 'space-between', width: w + unit, font: `600 ${fs}${unit}/1 var(--font-text)`, textTransform: 'uppercase', color }}>
    {[...txt].map((l, i) => <span key={i}>{l}</span>)}
  </span>;

export type LogoLayout = 'stack' | 'horizontal';

export interface SignatureProps extends LogoMarkProps {
  /** `'stack'` : logo au-dessus de BRASSE / filet / YUTZ. `'horizontal'` : texte à gauche du logo, qui garde toute la hauteur (en-tête). */
  layout?: LogoLayout;
}

export function Signature({ size = 48, unit = 'px', ring = 'var(--accent)', ink = 'var(--encre)', knock = 'var(--papier)', detail, layout = 'stack', style }: SignatureProps) {
  const H = layout === 'horizontal';
  const w = H ? size * 1.08 : size * 1.62;
  const k = H ? 0.66 : 1;
  const txt = <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.09 * k + unit }}>
    <Just txt="Brasse" w={w} fs={size * 0.26 * k} unit={unit} color={ink} />
    <span style={{ width: w + unit, height: Math.max(size * 0.05 * k, 0.4) + unit, background: ring }}></span>
    <Just txt="Yutz" w={w} fs={size * 0.42 * k} unit={unit} color={ink} />
  </span>;
  return <span aria-label="Brasse-Yutz" data-layout={layout} style={{ display: 'inline-flex', flexDirection: H ? 'row' : 'column', alignItems: 'center', gap: size * (H ? 0.2 : 0.14) + unit, ...style }}>
    {H && txt}
    <LogoMark size={size} unit={unit} ring={ring} ink={ink} knock={knock} detail={detail} />
    {!H && txt}
  </span>;
}

/** Signature horizontale de l'en-tête : BRASSE / filet / YUTZ à gauche du logo. */
export function SignatureH({ size = 52, ...rest }: Omit<SignatureProps, 'layout'>) {
  return <Signature size={size} layout="horizontal" {...rest} />;
}

export interface LogoProps {
  size?: number;
  /** Encre blanche, anneau couleur, découpes transparentes : pour fond sombre. */
  inverse?: boolean;
  lockup?: boolean;
  layout?: LogoLayout;
  ring?: string;
  detail?: boolean;
  style?: CSSProperties;
}

export function Logo({ size = 48, inverse = false, lockup = false, layout = 'stack', ring = 'var(--accent)', detail, style }: LogoProps) {
  const ink = inverse ? 'var(--papier)' : 'var(--encre)';
  const knock = inverse ? 'transparent' : 'var(--papier)';
  return lockup
    ? <Signature size={size} ring={ring} ink={ink} knock={knock} detail={detail} layout={layout} style={style} />
    : <span style={{ display: 'inline-block', ...style }}><LogoMark size={size} ring={ring} ink={ink} knock={knock} detail={detail} /></span>;
}
