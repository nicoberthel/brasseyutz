'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Beer } from '@/lib/schema';
import { labelProps } from '@/lib/label';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { Button } from '@/components/ds/Button';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { brewUrl, QrStyled } from '@/lib/qr';

type Box = { l: number; t: number; w: number; h: number };

export function PlancheApp({ beers, siteUrl, defaultBeerId }: { beers: Beer[]; siteUrl: string; defaultBeerId?: string }) {
  const sorted = [...beers].sort((a, b) => b.brew - a.brew);
  const first = (defaultBeerId && beers.some(b => b.id === defaultBeerId) ? defaultBeerId : sorted[0]?.id) || '';
  const firstBottle = beers.find(b => b.id === first)?.bottle || '75cl';
  const [slots, setSlots] = useState<string[]>(Array(4).fill(first));
  const [bottles, setBottles] = useState<string[]>(Array(4).fill(firstBottle));
  const [cut, setCut] = useState(true);
  const [qr, setQr] = useState(true);
  const [mono, setMono] = useState(false);
  const [qrBox, setQrBox] = useState<Box>({ l: 0, t: 7.3, w: 14, h: 11 });
  const [zoom, setZoom] = useState(1);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setZoom(Math.min(1, (Math.min(window.innerWidth, 1320) - 64) / 1123));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Mesure la cellule « Alc. » de la première étiquette pour y poser le QR (prototype).
  useEffect(() => {
    const slot = sheetRef.current?.querySelector('[data-slot]');
    if (!slot) return;
    const cap = [...slot.querySelectorAll('div')].find(d => d.textContent === 'Alc.');
    if (!cap?.parentElement) return;
    const s = slot.getBoundingClientRect(), c = cap.parentElement.getBoundingClientRect();
    if (!s.width) return;
    const k = 140 / s.width, r = (v: number) => Math.round(v * k * 20) / 20;
    const box = { l: r(c.left - s.left), t: r(c.top - s.top), w: r(c.width), h: r(c.height) };
    if ((['l', 't', 'w', 'h'] as const).some(p => Math.abs(qrBox[p] - box[p]) > 0.06)) setQrBox(box);
  }, [slots, mono, qr, zoom, qrBox]);

  const checkbox: React.CSSProperties = { accentColor: 'var(--encre)', width: 16, height: 16 };

  return (
    <main data-sheet-wrap="1" style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,48px) 96px' }}>
      <div data-noprint="1" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24, marginBottom: 28, borderBottom: '1px solid var(--encre)' }}>
        <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--encre-2)' }}>
          <CuveeIcon name="ArrowLeft" size={16} />Backoffice
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, font: '400 clamp(44px,6vw,72px)/0.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
            Planche <i style={{ color: 'var(--accent)' }}>A4</i>
          </h1>
          <Button variant="primary" onClick={() => window.print()}>Imprimer</Button>
        </div>
        <p style={{ margin: 0, font: '400 14px/1.5 var(--font-text)', color: 'var(--encre-2)' }}>
          A4 paysage, 4 étiquettes 140 × 75 mm. Imprimez à 100 % (taille réelle), sans marges.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
          {slots.map((value, i) => (
            <label key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: '600 11px var(--font-text)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--encre-2)' }}>Emplacement {i + 1}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={value} onChange={e => { const v = e.target.value; setSlots(sl => sl.map((x, j) => j === i ? v : x)); setBottles(bt => bt.map((x, j) => j === i ? (beers.find(b => b.id === v)?.bottle || '75cl') : x)); }}
                  style={{ flex: 1, minWidth: 0, height: 42, padding: '0 10px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 15px var(--font-text)', color: 'var(--encre)', borderRadius: 0 }}>
                  <option value="">Vide</option>
                  {sorted.map(b => <option key={b.id} value={b.id}>N° {b.brew} · {b.name}{b.edition ? ' ' + b.edition : ''}</option>)}
                </select>
                <select value={bottles[i]} onChange={e => { const v = e.target.value; setBottles(bt => bt.map((x, j) => j === i ? v : x)); }} aria-label={`Contenance emplacement ${i + 1}`}
                  style={{ width: 86, height: 42, padding: '0 8px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 15px var(--font-text)', color: 'var(--encre)', borderRadius: 0 }}>
                  <option value="75cl">75 cl</option>
                  <option value="33cl">33 cl</option>
                </select>
              </div>
            </label>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--encre)', cursor: 'pointer' }}>
            <input type="checkbox" checked={cut} onChange={() => setCut(c => !c)} style={checkbox} />Repères de coupe
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--encre)', cursor: 'pointer' }}>
            <input type="checkbox" checked={qr} onChange={() => setQr(q => !q)} style={checkbox} />QR code (à la place de « Alc. »)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--encre)', cursor: 'pointer' }}>
            <input type="checkbox" checked={mono} onChange={() => setMono(m => !m)} style={checkbox} />100 % noir
          </label>
        </div>
      </div>
      <div style={{ overflow: 'auto' }}>
        <div ref={sheetRef} data-sheet="1" style={{ zoom, position: 'relative', width: '297mm', height: '210mm', background: 'var(--papier)', boxShadow: 'var(--shadow-print)', display: 'grid', gridTemplateColumns: '140mm 140mm', gridTemplateRows: '75mm 75mm', justifyContent: 'center', alignContent: 'center', margin: '0 auto' }}>
          {slots.map((id, i) => {
            const b = beers.find(x => x.id === id);
            return (
              <div key={i} data-slot="1" style={{ position: 'relative', width: '140mm', height: '75mm', overflow: 'hidden' }}>
                {b && <BeerLabel {...labelProps({ ...b, bottle: bottles[i] }, 1, { print: true, monochrome: mono })} />}
                {b && qr && (
                  <div style={{ position: 'absolute', left: qrBox.l + 'mm', top: qrBox.t + 'mm', width: qrBox.w + 'mm', height: qrBox.h + 'mm', background: 'var(--papier)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.1mm' }}>
                    <QrStyled url={brewUrl(siteUrl, b.brew)} accent={mono ? 'var(--encre)' : b.accent} />
                  </div>
                )}
              </div>
            );
          })}
          {cut && (
            <svg viewBox="0 0 297 210" style={{ position: 'absolute', left: 0, top: 0, width: '297mm', height: '210mm', pointerEvents: 'none' }} fill="none" stroke="#161616" strokeWidth="0.15">
              <path d="M8.5 22V28M148.5 22V28M288.5 22V28M8.5 182V188M148.5 182V188M288.5 182V188M2 30H6.5M2 105H6.5M2 180H6.5M290.5 30H295M290.5 105H295M290.5 180H295"></path>
            </svg>
          )}
        </div>
      </div>
    </main>
  );
}
