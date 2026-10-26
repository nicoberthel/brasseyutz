'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Beer } from '@/lib/schema';
import { filterBeers } from '@/lib/domain';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { Search } from '@/components/site/Search';
import { Tabs, type TabValue } from '@/components/site/Tabs';
import { CuveeTile, Empty, soft } from '@/components/site/Cards';

const NB = '\u00a0';

function LastBrew({ beer }: { beer: Beer }) {
  const style = [beer.styleName, beer.denomination].filter(Boolean).join(' · ');
  return (
    <Link href={`/biere/${beer.id}`} className="news" style={{ background: soft(beer.accent), color: 'var(--encre)' }}>
      <span style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--papier)', display: 'grid', placeItems: 'center', color: beer.accent, flex: 'none' }}>
        {beer.artwork
          ? <img src={beer.artwork} alt="" style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }} />
          : <CuveeIcon name={beer.icon} size={30} stroke={1.5} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '600 12px var(--font-text)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{`Dernier brassin · n°${NB}${beer.brew}`}</div>
        <div style={{ font: '400 30px/1.05 var(--font-display)', marginTop: 4 }}>
          {beer.name}{beer.edition ? <i style={{ color: beer.accent }}> {beer.edition}</i> : null}{' '}
          {style ? <i style={{ color: beer.accent }}>— {style}</i> : null}
        </div>
        {beer.bottledOn
          ? <div style={{ font: '400 14px var(--font-text)', color: 'var(--text-body)', marginTop: 4 }}>Mise en bouteille le {beer.bottledOn}</div>
          : null}
      </div>
      <span className="iconbtn" aria-hidden="true" style={{ background: 'var(--papier)', borderRadius: '50%', flex: 'none' }}><CuveeIcon name="ArrowRight" size={20} stroke={1.75} /></span>
    </Link>
  );
}

export function Home({ beers }: { beers: Beer[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<TabValue>('toutes');
  const list = filterBeers(beers, tab, q);
  const last = beers.reduce<Beer | null>((m, b) => (!m || b.brew > m.brew ? b : m), null);
  return (
    <main className="page">
      <section className="hero">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ font: '600 12px var(--font-text)', letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.9 }}>Brasserie maison · Yutz</div>
          <h1 style={{ margin: 0, font: '400 clamp(32px,4.2vw,48px)/.98 var(--font-display)', letterSpacing: '-0.02em', textWrap: 'balance' }}>
            Des bières houblonnées, brassées <i>à la maison.</i>
          </h1>
          <p style={{ margin: 0, font: '400 16px/1.45 var(--font-text)', maxWidth: 520 }}>Petits brassins, essais, ratés et belles réussites : chaque cuvée a sa fiche technique complète.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/cuvees" className="pill light">Voir les cuvées <CuveeIcon name="ArrowRight" size={18} stroke={1.75} /></Link>
          </div>
        </div>
        <div className="hero-img"><img src="/assets/logo-brasse-yutz.svg" alt="Brasse-Yutz — Saint Nicolas" style={{ width: '62%', height: 'auto' }} /></div>
      </section>
      <Search value={q} onChange={setQ} onEnter={() => router.push('/cuvees?q=' + encodeURIComponent(q))} />
      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 className="h2">Les cuvées</h2>
          <Link href="/cuvees" className="link">Tout voir</Link>
        </div>
        <Tabs value={tab} onChange={setTab} />
        {list.length
          ? <div className="rail">{list.map(b => <CuveeTile key={b.id} beer={b} />)}</div>
          : <Empty q={q} />}
      </section>
      {last ? <LastBrew beer={last} /> : null}
    </main>
  );
}
