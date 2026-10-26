'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Beer } from '@/lib/schema';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { Search } from '@/components/site/Search';
import { Tabs, type TabValue } from '@/components/site/Tabs';
import { CuveeCard, Empty } from '@/components/site/Cards';
import { filterBeers } from '@/lib/domain';

export function Cuvees({ beers, initialQuery }: { beers: Beer[]; initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const [tab, setTab] = useState<TabValue>('toutes');
  const list = filterBeers(beers, tab, q);
  return (
    <main className="page">
      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', minHeight: 52 }}>
        <Link href="/" className="iconbtn" aria-label="Retour" style={{ color: 'var(--encre)' }}><CuveeIcon name="ChevronLeft" size={22} stroke={1.75} /></Link>
        <h1 style={{ margin: 0, textAlign: 'center', font: '600 18px var(--font-text)' }}>Cuvées</h1>
        <span className="iconbtn" aria-hidden="true"><CuveeIcon name="SlidersHorizontal" size={20} stroke={1.75} /></span>
      </div>
      <Search value={q} onChange={setQ} autoFocus={!!initialQuery} />
      <Tabs value={tab} onChange={setTab} />
      {list.length
        ? <div className="cards">{list.map(b => <CuveeCard key={b.id} beer={b} />)}</div>
        : <Empty q={q} />}
    </main>
  );
}
