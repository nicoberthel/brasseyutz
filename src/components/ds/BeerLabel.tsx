import type { CSSProperties } from 'react';
import { Gauge, describe } from './Gauge';
import { IngredientGrid } from './IngredientGrid';
import { LegalMentions } from './LegalMentions';
import { CuveeIcon } from './CuveeIcon';
import { Signature } from './Logo';

export interface LabelProps {
  bottle?: '75cl' | '33cl';
  name?: string;
  edition?: string;
  styleName?: string;
  denomination?: string;
  brew?: number | string;
  abv?: number | string;
  ebc?: number;
  ibu?: number;
  malts?: string;
  hops?: string;
  yeast?: string;
  other?: string;
  bottledOn?: string;
  bestBefore?: string;
  lot?: string;
  accent?: string;
  icon?: string;
  artwork?: string;
  monochrome?: boolean;
  ingredientSpacing?: number;
  ebcDisplay?: 'segments' | 'gradient';
  ruleWidth?: number;
  ruleWeight?: number;
  logoSrc?: string;
  pregnancySrc?: string;
  trimanSrc?: string;
  brewer?: string;
  address?: string;
  scale?: number;
  showVisibleZone?: boolean;
  style?: CSSProperties;
}

/* 140 × 75 mm — 75 cl et 33 cl long neck. Fond papier, une encre + une couleur de cuvée (« highlight »).
   Dos 60 mm : fiche technique. Face 80 mm : centrée, aérée, nom en serif. */
export function BeerLabel({ bottle = '75cl', name, edition, styleName, denomination, brew, abv, ebc, ibu, malts, hops, yeast, other, bottledOn, bestBefore, lot, accent = 'var(--cuvee-orange)', icon = 'Hop', artwork, monochrome = false, ingredientSpacing = 1.3, ebcDisplay = 'segments', ruleWidth = 62, ruleWeight = 0.8, pregnancySrc, trimanSrc, brewer, address, scale = 1, showVisibleZone = false, style }: LabelProps) {
  const vol = bottle === '33cl' ? '33 cl' : '75 cl';
  const abvTxt = String(abv).replace('.', ',');
  const ac = monochrome ? 'var(--encre)' : accent;
  const words = String(name || '').split(' ');
  const first = edition ? (name || '') : words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const second = edition || words.slice(Math.ceil(words.length / 2)).join(' ');
  const longest = Math.max(first.length, second.length);
  const nameSize = Math.min(12.5, 62 / (longest * 0.46));
  const hair = 'var(--label-hair) solid var(--encre)';
  const light = 'var(--label-hair-light) solid var(--filet)';
  const cap: CSSProperties = { font: '600 1.9mm var(--font-text)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' };
  const num: CSSProperties = { font: '400 4.8mm/1 var(--font-display)', color: 'var(--text-strong)', whiteSpace: 'nowrap' };
  const unitS: CSSProperties = { font: '500 1.8mm var(--font-mono)', color: 'var(--text-muted)', marginLeft: '0.6mm' };
  const desc: CSSProperties = { font: 'italic 400 2.7mm/1 var(--font-display)', color: ac, whiteSpace: 'nowrap' };
  const numRow: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1mm', margin: '0.7mm 0 1mm' };
  const zone = bottle === '33cl' ? 50 : 64;
  return <div style={{ zoom: scale, width: '140mm', height: '75mm', display: 'flex', background: 'var(--papier)', color: 'var(--text-body)', overflow: 'hidden', flex: 'none', position: 'relative', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', ...style }}>
    <div style={{ width: '62mm', flex: 'none', borderRight: hair, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '2.6mm 3mm 1.6mm', borderBottom: hair }}>
        <span style={{ font: '600 2.2mm var(--font-text)', letterSpacing: '0.16em', textTransform: 'uppercase', color: ac, whiteSpace: 'nowrap' }}>{styleName}</span>
        <span style={{ font: '500 2.2mm var(--font-mono)', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>N° {brew} · {bottledOn}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '14mm 1fr 1fr', borderBottom: hair }}>
        <div style={{ padding: '1.4mm 3mm' }}><div style={cap}>Alc.</div><div style={{ ...num, marginTop: '0.7mm' }}>{abvTxt}<span style={unitS}>%</span></div></div>
        {ebc != null && <div style={{ padding: '1.4mm 2.4mm', borderLeft: light }}><div style={cap}>Couleur</div><div style={numRow}><span style={num}>{ebc}<span style={unitS}>EBC</span></span><span style={desc}>{describe('ebc', ebc)}</span></div><Gauge kind="ebc" value={ebc} unit="mm" variant={ebcDisplay} showLabel={false} /></div>}
        {ibu != null && <div style={{ padding: '1.4mm 2.4mm', borderLeft: light }}><div style={cap}>Amertume</div><div style={numRow}><span style={num}>{ibu}<span style={unitS}>IBU</span></span><span style={desc}>{describe('ibu', ibu)}</span></div><Gauge kind="ibu" value={ibu} unit="mm" accent={ac} showLabel={false} /></div>}
      </div>
      <div style={{ padding: '0.2mm 0 0', flex: 1, minHeight: 0 }}><IngredientGrid unit="mm" inset={3} rowPadding={ingredientSpacing} accent={ac} malts={malts} hops={hops} yeast={yeast} other={other} /></div>
      <div style={{ padding: '1.2mm 3mm 2mm', borderTop: light }}><LegalMentions unit="mm" quiet lot={lot} bestBefore={bestBefore} brewer={brewer} address={address} pregnancySrc={pregnancySrc} trimanSrc={trimanSrc} /></div>
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.4mm 0 2.6mm', boxSizing: 'border-box', position: 'relative' }}>
      <Signature size={9} unit="mm" ring={ac} ink="var(--encre)" style={{ marginBottom: '2mm' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.2mm', minHeight: 0 }}>
        <CuveeIcon name={icon} src={artwork} size={12} unit="mm" color={ac} stroke={1.1} />
        <div style={{ font: `400 ${nameSize}mm/0.92 var(--font-display)`, letterSpacing: '-0.02em', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{first}{second && <><br /><i style={{ color: ac }}>{second}</i></>}</div>
      </div>
      <span style={{ width: ruleWidth + 'mm', height: ruleWeight + 'mm', background: ac, display: 'block', flex: 'none' }}></span>
      <div style={{ width: '50mm', paddingTop: '1.6mm', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ font: '600 2.4mm var(--font-text)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{denomination || ('Bière ' + styleName)} · {abvTxt} % vol.</span>
        <span style={{ font: '400 6.5mm/1 var(--font-display)', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{vol}</span>
      </div>
      {showVisibleZone && <div style={{ position: 'absolute', top: '-1mm', bottom: '-1mm', left: `calc(50% - ${zone / 2}mm)`, width: zone + 'mm', border: '0.4mm dashed var(--cuvee-bleu)', pointerEvents: 'none', boxSizing: 'border-box' }}><span style={{ position: 'absolute', top: '1.6mm', left: '1.6mm', font: '600 2mm var(--font-mono)', background: 'var(--cuvee-bleu)', color: '#fff', padding: '0.4mm 1mm' }}>visible {vol} ≈ {zone} mm</span></div>}
    </div>
  </div>;
}
