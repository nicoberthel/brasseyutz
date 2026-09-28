import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Beer } from '@/lib/schema';
import { abvTxt, num, rows, splitName } from '@/lib/domain';
import { labelProps } from '@/lib/label';
import { LabelZoom } from '@/app/label-zoom';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { Gauge } from '@/components/ds/Gauge';

const BACK = (
  <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--encre-2)' }}>
    <CuveeIcon name="ArrowLeft" size={16} />Toutes les bières
  </Link>
);

export function FicheIntrouvable() {
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,32px) 96px' }}>
      {BACK}
      <h1 style={{ margin: '48px 0 0', font: '400 56px/1 var(--font-display)', color: 'var(--encre)' }}>
        Bière <i style={{ color: 'var(--accent)' }}>introuvable</i>
      </h1>
      <p style={{ fontSize: 'var(--fs-lead)', color: 'var(--encre-2)' }}>Ce brassin n’est pas (ou plus) en ligne.</p>
    </main>
  );
}

type Stat = { label: string; value: string; unit: string; gauge?: ReactNode };

export function Fiche({ beer, others }: { beer: Beer; others: Beer[] }) {
  const [first, second] = splitName(beer);
  const ac = beer.accent;
  const stats = ([
    { label: 'Alcool', value: abvTxt(beer.abv), unit: '% vol.' },
    beer.ebc && { label: 'Couleur', value: beer.ebc, unit: 'EBC', gauge: <Gauge kind="ebc" value={num(beer.ebc) ?? 0} showLabel={false} /> },
    beer.ibu && { label: 'Amertume', value: beer.ibu, unit: 'IBU', gauge: <Gauge kind="ibu" value={num(beer.ibu) ?? 0} accent={ac} showLabel={false} /> },
    beer.og && { label: 'Densité initiale', value: beer.og, unit: 'DI' },
    beer.fg && { label: 'Densité finale', value: beer.fg, unit: 'DF' },
  ].filter(Boolean)) as Stat[];
  const blocks = [
    { title: 'Malts & grains', icon: 'Wheat', rows: rows(beer.grains) },
    { title: 'Houblonnage', icon: 'Hop', rows: rows(beer.hopSchedule) },
    { title: 'Empâtage', icon: 'Thermometer', rows: rows(beer.mash) },
    { title: 'Fermentation · ' + (beer.yeast || 'levure'), icon: 'FlaskConical', rows: rows(beer.ferment) },
  ].filter(b => b.rows.length);
  const tasting = ([['Aspect', beer.look], ['Nez', beer.nose], ['Bouche', beer.mouth], ['Finale', beer.finish], ['Service', beer.serving]] as const)
    .filter(t => t[1] && t[1].trim());
  const descParas = beer.description.split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean);
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,32px) 96px' }}>
      {BACK}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 32, paddingBottom: 10, borderBottom: '1px solid var(--encre)' }}>
        <span style={{ font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: ac }}>{beer.styleName}</span>
        <span style={{ font: '500 13px var(--font-mono)', color: 'var(--encre)' }}>N° {beer.brew} · {beer.bottledOn}</span>
      </div>
      <h1 style={{ margin: '28px 0 0', font: '400 clamp(44px,9vw,96px)/0.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)', textWrap: 'balance' }}>
        {first} {second && <i style={{ color: ac }}>{second}</i>}
      </h1>
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', padding: 'clamp(16px,4vw,40px) 8px', background: 'var(--papier-2)', overflow: 'hidden' }}>
        {beer.labelImage
          ? <img src={beer.labelImage} alt={`Étiquette ${beer.name}`} style={{ display: 'block', maxWidth: '100%', maxHeight: 420, height: 'auto', boxShadow: 'var(--shadow-print)' }} />
          : <LabelZoom {...labelProps(beer, 1)} />}
      </div>

      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', borderTop: '1px solid var(--encre)', borderLeft: '1px solid var(--filet)' }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: '14px 16px 16px', background: 'var(--papier)', borderRight: '1px solid var(--filet)', borderBottom: '1px solid var(--filet)' }}>
            <div style={{ font: '600 11px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--encre-3)' }}>{s.label}</div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ font: '400 40px/1 var(--font-display)', color: 'var(--encre)' }}>{s.value}</span>
              <span style={{ font: '500 12px var(--font-mono)', color: 'var(--encre-3)' }}>{s.unit}</span>
            </div>
            {s.gauge && <div style={{ marginTop: 10 }}>{s.gauge}</div>}
          </div>
        ))}
      </div>

      {descParas.length > 0 && (
        <section style={{ marginTop: 64, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ font: '600 11px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--encre-3)', paddingBottom: 10, borderBottom: '1px solid var(--encre)' }}>L’histoire du brassin</div>
          {descParas.map((p, i) => (
            <p key={i} style={{ margin: 0, maxWidth: 680, fontSize: 'var(--fs-lead)', lineHeight: 1.6, color: 'var(--encre-2)', textWrap: 'pretty' }}>{p}</p>
          ))}
        </section>
      )}

      <section style={{ marginTop: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, font: '400 var(--fs-h2)/1 var(--font-display)', color: 'var(--encre)' }}>La <i style={{ color: ac }}>recette</i></h2>
          <span style={{ font: '500 13px var(--font-mono)', color: 'var(--encre-2)' }}>{beer.volume ? `Pour ${beer.volume} litres` : ''}</span>
        </div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {blocks.map(bl => (
            <div key={bl.title} style={{ background: 'var(--papier)', border: '1px solid var(--filet)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--encre)' }}>
                <CuveeIcon name={bl.icon} size={20} color={ac} />
                <span style={{ font: '500 12px var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--encre)' }}>{bl.title}</span>
              </div>
              {bl.rows.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,auto)', gap: '4px 16px', alignItems: 'baseline', padding: '10px 16px', borderTop: '1px solid var(--filet)' }}>
                  <span style={{ fontSize: 16, color: 'var(--encre)', textWrap: 'pretty' }}>{r.a}</span>
                  <span style={{ font: '500 14px var(--font-mono)', color: 'var(--encre)', textAlign: 'right', whiteSpace: 'nowrap' }}>{r.b}</span>
                  <span style={{ font: '400 13px var(--font-mono)', color: 'var(--encre-3)', textAlign: 'right' }}>{r.c}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {beer.notes && (
        <section style={{ marginTop: 56, padding: '28px 0', borderTop: '1px solid var(--encre)', borderBottom: '1px solid var(--filet)' }}>
          <div style={{ font: '600 11px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--encre-3)' }}>Le mot du brasseur</div>
          <p style={{ margin: '12px 0 0', font: 'italic 400 clamp(24px,4vw,32px)/1.25 var(--font-display)', color: 'var(--encre)', textWrap: 'pretty' }}>{beer.notes}</p>
        </section>
      )}

      {tasting.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <h2 style={{ margin: 0, font: '400 var(--fs-h2)/1 var(--font-display)', color: 'var(--encre)' }}>La <i style={{ color: ac }}>dégustation</i></h2>
          <div style={{ marginTop: 20, borderTop: '1px solid var(--encre)' }}>
            {tasting.map(([label, text]) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: 'minmax(88px,160px) minmax(0,1fr)', gap: '4px 24px', alignItems: 'baseline', padding: '18px 0', borderBottom: '1px solid var(--filet)' }}>
                <span style={{ font: '500 12px var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: ac }}>{label}</span>
                <span style={{ font: '400 clamp(20px,3vw,24px)/1.35 var(--font-display)', color: 'var(--encre)', textWrap: 'pretty' }}>{text}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 64 }}>
        <div style={{ font: '600 11px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--encre-3)', paddingBottom: 10, borderBottom: '1px solid var(--encre)' }}>Autres bières</div>
        {others.map(o => {
          const [f, s] = splitName(o);
          return (
            <Link key={o.id} href={`/biere/${o.id}`} className="hov-bottom"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--filet)', color: 'var(--encre)' }}>
              <span style={{ font: '400 26px/1 var(--font-display)' }}>{f} {s && <i style={{ color: o.accent }}>{s}</i>}</span>
              <span style={{ font: '500 12px var(--font-mono)', color: 'var(--encre-2)' }}>{o.styleName} · N° {o.brew}</span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
