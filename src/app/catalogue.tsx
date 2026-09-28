'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Beer } from '@/lib/schema';
import { abvTxt, matches, splitName } from '@/lib/domain';
import { labelProps } from '@/lib/label';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { CuveeIcon } from '@/components/ds/CuveeIcon';

const CARD_ZOOM = 0.58;

export function Catalogue({ beers }: { beers: Beer[] }) {
  const [query, setQuery] = useState('');
  const filtered = beers.filter(b => matches(b, query));
  const countTxt = filtered.length + (filtered.length > 1 ? ' bières' : ' bière');
  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(32px,6vw,72px) clamp(16px,4vw,48px) 96px' }}>
      <div style={{ font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>Bières maison · Yutz</div>
      <h1 style={{ margin: '12px 0 0', font: '400 clamp(52px,8vw,104px)/0.92 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
        Toutes les <i style={{ color: 'var(--accent)' }}>bières</i>
      </h1>
      <p style={{ margin: '20px 0 0', maxWidth: 560, fontSize: 'var(--fs-lead)', lineHeight: 1.5, color: 'var(--encre-2)', textWrap: 'pretty' }}>
        Chaque étiquette porte un QR code qui mène ici : la recette, les chiffres et les mentions de la cuvée.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', margin: '40px 0 24px', paddingTop: 24, borderTop: '1px solid var(--encre)' }}>
        <label style={{ flex: '1 1 320px', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 48, background: 'var(--papier)', border: '1px solid var(--filet)' }}>
          <CuveeIcon name="Search" size={18} color="var(--encre-3)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nom, style, houblon, malt, n° de brassin…"
            style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', font: '400 16px var(--font-text)', color: 'var(--encre)' }} />
        </label>
        <span style={{ font: '500 13px var(--font-mono)', color: 'var(--encre-3)' }}>{countTxt}</span>
      </div>
      {filtered.length === 0 && (
        <p style={{ padding: '48px 0', font: 'italic 400 28px var(--font-display)', color: 'var(--encre-2)' }}>
          Aucune bière ne correspond à « {query} ».
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: 20 }}>
        {filtered.map(b => {
          const [first, second] = splitName(b);
          return (
            <Link key={b.id} href={`/biere/${b.id}`} className="hov-border"
              style={{ display: 'flex', flexDirection: 'column', background: 'var(--papier)', border: '1px solid var(--filet)', color: 'var(--encre)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--filet)' }}>
                <span style={{ font: '600 11px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: b.accent }}>{b.styleName}</span>
                <span style={{ font: '500 12px var(--font-mono)', color: 'var(--encre)' }}>N° {b.brew}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '22px 12px', background: 'var(--papier-2)', overflow: 'hidden' }}>
                {b.labelImage
                  ? <img src={b.labelImage} alt={`Étiquette ${b.name}`} style={{ display: 'block', maxWidth: '100%', height: Math.round(283 * CARD_ZOOM), objectFit: 'contain', boxShadow: 'var(--shadow-print)' }} />
                  : <BeerLabel {...labelProps(b, CARD_ZOOM)} />}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: 14, borderTop: '1px solid var(--filet)' }}>
                <span style={{ font: '400 26px/1 var(--font-display)', color: 'var(--encre)' }}>{first} {second && <i style={{ color: b.accent }}>{second}</i>}</span>
                <span style={{ font: '500 12px var(--font-mono)', color: 'var(--encre-2)', whiteSpace: 'nowrap' }}>{abvTxt(b.abv)} % · {b.bottle === '33cl' ? '33 cl' : '75 cl'}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
