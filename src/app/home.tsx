'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Beer } from '@/lib/schema';
import { brewStats, filterBeers } from '@/lib/domain';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { Search } from '@/components/site/Search';
import { Tabs, type TabValue } from '@/components/site/Tabs';
import { CuveeTile, Empty, soft } from '@/components/site/Cards';

const NB = '\u00a0';

const fr = (n: number) => String(n).replace('.', ',');

function Stats({ beers }: { beers: Beer[] }) {
  const s = brewStats(beers);
  const figs: [string, string][] = [[String(s.count), s.since ? `brassins depuis ${s.since}` : 'brassins']];
  if (s.liters) figs.push([`${fr(s.liters)}${NB}L`, 'brassés à la maison']);
  if (s.topHop && s.topHop.count > 1) figs.push([s.topHop.name, `houblon fétiche · ${s.topHop.count}${NB}recettes`]);
  if (s.abvMin !== undefined && s.abvMax !== undefined && s.abvMin !== s.abvMax) {
    figs.push([`${fr(s.abvMin)}–${fr(s.abvMax)}${NB}%`, 'd’alcool, de la plus légère à la plus forte']);
  }
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h2 className="h2">Le brassoir en chiffres</h2>
      <div className="stats">
        {figs.map(([v, l]) => <div key={l} className="stat"><b>{v}</b><span>{l}</span></div>)}
      </div>
    </section>
  );
}

/* Coup de cœur le plus récent : choix stable, identique côté serveur et client. */
function Favorite({ beer }: { beer: Beer }) {
  const style = beer.styleName?.trim();
  const desc = beer.description?.trim();
  return (
    <Link href={`/biere/${beer.id}`} className="news" style={{ background: soft(beer.accent), color: 'var(--encre)' }}>
      <span style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--papier)', display: 'grid', placeItems: 'center', color: beer.accent, flex: 'none' }}>
        {beer.artwork
          ? <img src={beer.artwork} alt="" style={{ width: 30, height: 30, objectFit: 'contain', display: 'block' }} />
          : <CuveeIcon name={beer.icon} size={30} stroke={1.5} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: beer.accent }}>
          <CuveeIcon name="Heart" size={14} stroke={2} />
          <span className="fav-kicker" style={{ font: '600 12px var(--font-text)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Coup de cœur</span>
        </div>
        <div style={{ font: '400 30px/1.05 var(--font-display)', marginTop: 4 }}>
          {beer.name}{beer.edition ? <i style={{ color: beer.accent }}> {beer.edition}</i> : null}{' '}
          {style ? <i style={{ color: beer.accent }}>— {style}</i> : null}
        </div>
        {desc ? <p className="clamp2" style={{ margin: '6px 0 0', font: '400 15px/1.45 var(--font-text)', color: 'var(--text-body)' }}>{desc}</p> : null}
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
  const fav = beers.filter(b => b.favorite).reduce<Beer | null>((m, b) => (!m || b.brew > m.brew ? b : m), null);
  return (
    <main className="page">
      <section className="hero">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ font: '600 12px var(--font-text)', letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.9 }}>Brasserie maison · Yutz</div>
          <h1 style={{ margin: 0, font: '400 clamp(32px,4.2vw,48px)/.98 var(--font-display)', letterSpacing: '-0.02em', textWrap: 'balance' }}>
            Des bières houblonnées, brassées <i>à la maison.</i>
          </h1>
          <p style={{ margin: 0, font: '400 16px/1.45 var(--font-text)', maxWidth: 520 }}>Petits brassins, essais, ratés et belles réussites. Chaque cuvée a sa fiche technique complète.</p>
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
      {fav ? <Favorite beer={fav} /> : null}
      {beers.length ? <Stats beers={beers} /> : null}
    </main>
  );
}
