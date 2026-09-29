'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Beer } from '@/lib/schema';
import { matches, splitName } from '@/lib/domain';
import { Button } from '@/components/ds/Button';
import { CuveeIcon } from '@/components/ds/CuveeIcon';

const actionStyle: React.CSSProperties = { font: '600 11px var(--font-text)', letterSpacing: '0.16em', textTransform: 'uppercase' };

export function AdminList({ beers }: { beers: Beer[] }) {
  const router = useRouter();
  const [list, setList] = useState(beers);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const sorted = [...list].sort((a, b) => b.brew - a.brew).filter(b => matches(b, query));

  async function del(b: Beer) {
    if (!confirm(`Supprimer « ${b.name} » ?`)) return;
    const res = await fetch(`/api/beers/${b.id}`, { method: 'DELETE' });
    if (res.status === 401) { location.href = '/connexion'; return; }
    if (!res.ok) return;
    setList(bs => bs.filter(x => x.id !== b.id));
    router.refresh();
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    let parsed: unknown;
    try { parsed = JSON.parse(await f.text()); } catch { setError('Fichier JSON illisible.'); return; }
    const res = await fetch('/api/import', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(parsed) });
    if (res.status === 401) { location.href = '/connexion'; return; }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setError(data.error || 'Import impossible.'); return; }
    location.reload();
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,48px) 96px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap', paddingBottom: 20, borderBottom: '1px solid var(--encre)' }}>
        <div>
          <div style={{ font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>Backoffice</div>
          <h1 style={{ margin: '8px 0 0', font: '400 clamp(44px,6vw,72px)/0.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
            Les <i style={{ color: 'var(--accent)' }}>brassins</i>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="/api/export" download style={{ ...actionStyle, color: 'var(--encre-2)', cursor: 'pointer' }} className="hov-ink">Exporter</a>
          <label style={{ ...actionStyle, color: 'var(--encre-2)', cursor: 'pointer' }} className="hov-ink">
            <input type="file" accept="application/json,.json" onChange={onImport} style={{ display: 'none' }} />Importer
          </label>
          <Link href="/admin/planche"><Button variant="outline">Planche A4</Button></Link>
          <Link href="/admin/biere/nouvelle"><Button variant="primary">Nouvelle bière</Button></Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', margin: '20px 0 16px' }}>
        <label style={{ flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 44, background: 'var(--papier)', border: '1px solid var(--filet)' }}>
          <CuveeIcon name="Search" size={16} color="var(--encre-3)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nom, style, houblon, malt, n° de brassin…"
            style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', font: '400 15px var(--font-text)', color: 'var(--encre)' }} />
        </label>
        <span style={{ font: '500 13px var(--font-mono)', color: 'var(--encre-3)' }}>{sorted.length}{sorted.length > 1 ? ' brassins' : ' brassin'}</span>
      </div>
      {error && <p style={{ margin: '0 0 12px', font: '500 14px var(--font-text)', color: 'var(--danger)' }}>{error}</p>}

      <div style={{ background: 'var(--papier)', border: '1px solid var(--filet)', overflowX: 'auto' }}>
        <div style={{ minWidth: 640 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '56px minmax(0,1.5fr) minmax(0,1fr) 100px 190px', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--encre)', font: '500 11px var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--encre-3)' }}>
            <span>N°</span><span>Nom</span><span>Style</span><span>Embout.</span><span style={{ textAlign: 'right' }}>Actions</span>
          </div>
          {sorted.map(b => {
            const [f, s] = splitName(b);
            return (
              <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '56px minmax(0,1.5fr) minmax(0,1fr) 100px 190px', gap: 12, alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid var(--filet)' }}>
                <span style={{ font: '500 14px var(--font-mono)', color: 'var(--encre)' }}>{b.brew}</span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
                  <span style={{ font: '400 20px/1 var(--font-display)', color: 'var(--encre)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f} {s && <i style={{ color: b.accent }}>{s}</i>}</span>
                  {b.favorite ? <span title="Coup de cœur" style={{ display: 'inline-flex', color: b.accent }}><CuveeIcon name="Heart" size={13} stroke={2} /></span> : null}
                </span>
                <span style={{ fontSize: 14, color: 'var(--encre-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.styleName}</span>
                <span style={{ font: '400 13px var(--font-mono)', color: 'var(--encre-2)' }}>{b.bottledOn}</span>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, ...actionStyle }}>
                  <Link href={`/biere/${b.id}`} style={{ color: 'var(--encre-2)' }} className="hov-ink">Voir</Link>
                  <Link href={`/admin/biere/${b.id}`} style={{ color: 'var(--encre)' }} className="hov-under">Modifier</Link>
                  <span onClick={() => del(b)} style={{ cursor: 'pointer', color: 'var(--danger)' }} className="hov-under">Suppr.</span>
                </div>
              </div>
            );
          })}
          {sorted.length === 0 && (
            <p style={{ margin: 0, padding: '24px 16px', font: 'italic 400 20px var(--font-display)', color: 'var(--encre-2)' }}>Aucun brassin ne correspond à « {query} ».</p>
          )}
        </div>
      </div>
    </main>
  );
}
