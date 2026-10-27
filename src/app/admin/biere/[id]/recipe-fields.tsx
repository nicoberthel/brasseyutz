'use client';
import React from 'react';
import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import { fr, HOP_STAGES, RADAR_AXES, type HopStage, type Radar } from '@/lib/recipe';

/* Lignes de recette en cours de saisie : tout en chaînes (virgule décimale acceptée),
   converti en nombres à l'enregistrement (edit-form.tsx). */
export type GrainRow = { nom: string; kg: string };
export type HopRow = { etape: HopStage; nom: string; qte: string; detail: string };
export type MashRow = { temp: string; min: string; label: string };
export type MashForm = { eau: string; rincage: string; ebullitionMin: string; note: string; paliers: MashRow[] };
export type FermentRow = { temp: string; duree: string; label: string };
export type FermentForm = { ensemencement: string; refermentation: string; paliers: FermentRow[] };

const capLbl: React.CSSProperties = { font: '600 11px var(--font-text)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--encre-2)' };
const cell: React.CSSProperties = { height: 36, minWidth: 0, width: '100%', padding: '0 10px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 14px var(--font-text)', color: 'var(--encre)', outline: 0, borderRadius: 0, boxSizing: 'border-box' };
const cellMono: React.CSSProperties = { ...cell, font: '400 14px var(--font-mono)' };
const inp: React.CSSProperties = { height: 42, padding: '0 12px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 15px var(--font-text)', color: 'var(--encre)', outline: 0, borderRadius: 0 };
const iconBtn: React.CSSProperties = { width: 30, height: 36, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--filet)', background: 'var(--papier)', color: 'var(--encre-2)', cursor: 'pointer', borderRadius: 0 };
const addBtn: React.CSSProperties = { alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', border: '1px solid var(--encre)', background: 'var(--papier)', cursor: 'pointer', font: '600 10px var(--font-text)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--encre)', borderRadius: 0 };
const subTitle: React.CSSProperties = { font: '500 11px var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--encre)' };
const block: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };

export type Column<T> = {
  key: keyof T & string; label: string; type?: 'text' | 'number' | 'select'; options?: readonly string[]; width?: string;
};

export function Rows<T extends Record<string, string>>({ rows, onChange, columns, blank, label }: {
  rows: T[]; onChange(rows: T[]): void; columns: Column<T>[]; blank(): T; label: string;
}) {
  const grid = [...columns.map(c => c.width || 'minmax(0,1fr)'), 'auto'].join(' ');
  const setCell = (i: number, key: keyof T, v: string) =>
    onChange(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  const swap = (i: number, j: number) => {
    if (j < 0 || j >= rows.length) return;
    const out = rows.slice();
    [out[i], out[j]] = [out[j], out[i]];
    onChange(out);
  };
  return (
    <div style={block}>
      {rows.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 6, alignItems: 'center' }}>
          {columns.map(c => <span key={c.key} style={{ ...capLbl, fontSize: 10 }}>{c.label}</span>)}
          <span style={{ width: 102 }} />
          {rows.map((r, i) => {
            const n = i + 1;
            return (
              <React.Fragment key={i}>
                {columns.map(c => c.type === 'select' ? (
                  <select key={c.key} aria-label={`${c.label} ${n}`} value={r[c.key]} onChange={e => setCell(i, c.key, e.target.value)} style={cell}>
                    {(c.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input key={c.key} aria-label={`${c.label} ${n}`} value={r[c.key]} onChange={e => setCell(i, c.key, e.target.value)}
                    {...(c.type === 'number' ? { inputMode: 'decimal' as const } : {})} style={c.type === 'number' ? cellMono : cell} />
                ))}
                <span style={{ display: 'inline-flex', gap: 6 }}>
                  <button type="button" aria-label={`Monter la ligne ${n}`} title="Monter" disabled={i === 0} onClick={() => swap(i, i - 1)} style={{ ...iconBtn, opacity: i === 0 ? 0.35 : 1 }}><ArrowUp size={14} /></button>
                  <button type="button" aria-label={`Descendre la ligne ${n}`} title="Descendre" disabled={i === rows.length - 1} onClick={() => swap(i, i + 1)} style={{ ...iconBtn, opacity: i === rows.length - 1 ? 0.35 : 1 }}><ArrowDown size={14} /></button>
                  <button type="button" aria-label={`Supprimer la ligne ${n}`} title="Supprimer" onClick={() => onChange(rows.filter((_, j) => j !== i))} style={{ ...iconBtn, color: 'var(--danger)' }}><X size={14} /></button>
                </span>
              </React.Fragment>
            );
          })}
        </div>
      )}
      <button type="button" aria-label={`Ajouter ${label}`} onClick={() => onChange([...rows, blank()])} style={addBtn}>
        <Plus size={12} />Ajouter
      </button>
    </div>
  );
}

function Field({ label, value, onChange, mono, placeholder }: {
  label: string; value: string; onChange(v: string): void; mono?: boolean; placeholder?: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={capLbl}>{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        {...(mono ? { inputMode: 'decimal' as const } : {})}
        style={mono ? { ...inp, font: '400 15px var(--font-mono)' } : inp} />
    </label>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={title} style={{ ...block, gap: 12 }}>
      <span style={subTitle}>{title}</span>
      {children}
    </div>
  );
}

export function GrainsFields({ value, onChange }: { value: GrainRow[]; onChange(v: GrainRow[]): void }) {
  return (
    <Group title="Malts & grains">
      <Rows<GrainRow> rows={value} onChange={onChange} label="un grain" blank={() => ({ nom: '', kg: '' })}
        columns={[{ key: 'nom', label: 'Nom du grain' }, { key: 'kg', label: 'kg', type: 'number', width: '90px' }]} />
    </Group>
  );
}

export function HopsFields({ value, onChange }: { value: HopRow[]; onChange(v: HopRow[]): void }) {
  return (
    <Group title="Houblonnage">
      <Rows<HopRow> rows={value} onChange={onChange} label="un houblon"
        blank={() => ({ etape: 'Ébullition', nom: '', qte: '', detail: '' })}
        columns={[
          { key: 'etape', label: 'Étape', type: 'select', options: HOP_STAGES, width: '120px' },
          { key: 'nom', label: 'Nom' }, { key: 'qte', label: 'Quantité', width: '90px' },
          { key: 'detail', label: 'Détail', width: '100px' },
        ]} />
    </Group>
  );
}

export function MashFields({ value, onChange }: { value: MashForm; onChange(v: MashForm): void }) {
  const set = (k: keyof MashForm) => (v: string) => onChange({ ...value, [k]: v });
  return (
    <Group title="Empâtage">
      <Field label="Eau d’empâtage" value={value.eau} onChange={set('eau')} placeholder="15 L à 72 °C" />
      <Rows<MashRow> rows={value.paliers} onChange={p => onChange({ ...value, paliers: p })} label="un palier d’empâtage"
        blank={() => ({ temp: '', min: '', label: '' })}
        columns={[
          { key: 'temp', label: 'Température °C', type: 'number', width: '110px' },
          { key: 'min', label: 'Minutes', type: 'number', width: '90px' }, { key: 'label', label: 'Libellé' },
        ]} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>
        <Field label="Rinçage" value={value.rincage} onChange={set('rincage')} placeholder="12 L à 78 °C" />
        <Field label="Ébullition (min)" value={value.ebullitionMin} onChange={set('ebullitionMin')} mono placeholder="60" />
      </div>
      <Field label="Note" value={value.note} onChange={set('note')} />
    </Group>
  );
}

export function FermentFields({ value, onChange }: { value: FermentForm; onChange(v: FermentForm): void }) {
  const set = (k: keyof FermentForm) => (v: string) => onChange({ ...value, [k]: v });
  return (
    <Group title="Fermentation">
      <Field label="Ensemencement" value={value.ensemencement} onChange={set('ensemencement')} placeholder="1 sachet · S-04" />
      <Rows<FermentRow> rows={value.paliers} onChange={p => onChange({ ...value, paliers: p })} label="un palier de fermentation"
        blank={() => ({ temp: '', duree: '', label: '' })}
        columns={[
          { key: 'temp', label: 'Température °C', type: 'number', width: '110px' },
          { key: 'duree', label: 'Durée', width: '90px' }, { key: 'label', label: 'Libellé' },
        ]} />
      <Field label="Refermentation" value={value.refermentation} onChange={set('refermentation')} placeholder="Sucre · 2 sem. à 20 °C" />
    </Group>
  );
}

export function RadarFields({ value, onChange }: { value: Radar | null; onChange(v: Radar | null): void }) {
  return (
    <div style={{ ...block, gap: 12 }}>
      <span style={subTitle}>Radar</span>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <input type="checkbox" aria-label="Pas de radar" checked={value === null}
          onChange={e => onChange(e.target.checked ? null : [0, 0, 0, 0, 0, 0, 0, 0])}
          style={{ accentColor: 'var(--encre)', width: 16, height: 16 }} />
        <span style={capLbl}>Pas de radar</span>
      </label>
      {value && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '10px 20px' }}>
          {RADAR_AXES.map((axe, i) => (
            <label key={axe} style={{ display: 'grid', gridTemplateColumns: '120px minmax(0,1fr) 32px', alignItems: 'center', gap: 10 }}>
              <span style={{ ...capLbl, fontSize: 10 }}>{axe}</span>
              <input type="range" min={0} max={5} step={0.5} aria-label={axe} value={value[i]}
                onChange={e => onChange(value.map((x, j) => (j === i ? Number(e.target.value) : x)) as Radar)}
                style={{ accentColor: 'var(--encre)', minWidth: 0 }} />
              <span style={{ font: '500 13px var(--font-mono)', color: 'var(--encre)', textAlign: 'right' }}>{fr(value[i])}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
