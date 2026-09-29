'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Beer } from '@/lib/schema';
import { lotFor, slug } from '@/lib/domain';
import { labelProps } from '@/lib/label';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { Button } from '@/components/ds/Button';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { brewUrl, QrSvg, qrSvgString } from '@/lib/qr';
import { ICON_GROUPS } from '@/components/ds/icon-catalog';

const ACCENTS: [string, string][] = [['Orange', 'var(--cuvee-orange)'], ['Houblon', 'var(--cuvee-houblon)'], ['Ocre', 'var(--cuvee-ocre)'], ['Framboise', 'var(--cuvee-framboise)'], ['Bleu', 'var(--cuvee-bleu)'], ['Violet', 'var(--cuvee-violet)'], ['Bordeaux', 'var(--cuvee-bordeaux)'], ['Malt', 'var(--cuvee-malt)']];

type FormKey = 'name' | 'edition' | 'styleName' | 'denomination' | 'brew' | 'abv' | 'ebc' | 'ibu' | 'bottle' | 'accent' | 'icon' | 'artwork' | 'badge' | 'malts' | 'hops' | 'yeast' | 'other' | 'bottledOn' | 'bestBefore' | 'lot' | 'volume' | 'og' | 'fg' | 'grains' | 'hopSchedule' | 'mash' | 'ferment' | 'notes' | 'look' | 'nose' | 'mouth' | 'finish' | 'serving' | 'description' | 'labelImage';
type Form = Record<FormKey, string>;

function blank(nextBrew: number): Form {
  return { name: '', edition: '', styleName: '', denomination: '', brew: String(nextBrew), abv: '', ebc: '', ibu: '', bottle: '75cl', accent: 'var(--cuvee-orange)', icon: 'Hop', artwork: '', badge: '', malts: '', hops: '', yeast: '', other: 'Eau, sucre', bottledOn: '', bestBefore: '', lot: '', volume: '20', og: '', fg: '', grains: '', hopSchedule: '', mash: '', ferment: '', notes: '', look: '', nose: '', mouth: '', finish: '', serving: '', description: '', labelImage: '' };
}

function toForm(b: Beer): Form {
  const base = blank(b.brew);
  const out = { ...base };
  (Object.keys(base) as FormKey[]).forEach(k => { out[k] = String((b as Record<string, unknown>)[k] ?? ''); });
  return out;
}

const capLbl: React.CSSProperties = { font: '600 11px var(--font-text)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--encre-2)' };
const inp: React.CSSProperties = { height: 42, padding: '0 12px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 15px var(--font-text)', color: 'var(--encre)', outline: 0, borderRadius: 0 };
const sel: React.CSSProperties = { height: 42, padding: '0 10px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 15px var(--font-text)', color: 'var(--encre)', borderRadius: 0 };
const ta: React.CSSProperties = { padding: '10px 12px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 15px/1.4 var(--font-text)', color: 'var(--encre)', outline: 0, resize: 'vertical', borderRadius: 0 };
const taMono: React.CSSProperties = { ...ta, font: '400 14px/1.5 var(--font-mono)' };
const legend: React.CSSProperties = { padding: '0 0 10px', font: '500 12px var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--encre)' };
const fieldset: React.CSSProperties = { margin: 0, padding: 0, border: 0, display: 'flex', flexDirection: 'column', gap: 14 };
const fieldsetNext: React.CSSProperties = { ...fieldset, padding: '24px 0 0', borderTop: '1px solid var(--encre)' };

export function EditForm({ beer, nextBrew, siteUrl }: { beer: Beer | null; nextBrew: number; siteUrl: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Form>(() => (beer ? toForm(beer) : blank(nextBrew)));
  const [editingId, setEditingId] = useState<string | null>(beer?.id ?? null);
  const [savedMsg, setSavedMsg] = useState('');
  const [formError, setFormError] = useState('');
  const set = (k: FormKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    setSavedMsg('');
  };
  const previewId = editingId || slug(form.name + (form.edition ? ' ' + form.edition : ''));
  const previewUrl = brewUrl(siteUrl, form.brew || '');

  async function save() {
    if (!form.name.trim() || !form.styleName.trim() || !form.brew.trim() || !form.abv.trim()) {
      setFormError('Nom, style, n° de brassin et alcool sont obligatoires.');
      return;
    }
    const res = await fetch(editingId ? `/api/beers/${editingId}` : '/api/beers', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.status === 401) { location.href = '/connexion'; return; }
    const data = await res.json().catch(() => ({ error: 'Erreur inattendue.' }));
    if (!res.ok) { setFormError(data.error || 'Erreur inattendue.'); return; }
    setEditingId(data.id);
    setForm(toForm(data));
    setFormError('');
    setSavedMsg('Enregistré · ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    window.history.replaceState(null, '', `/admin/biere/${data.id}`);
    router.refresh();
  }

  async function del() {
    if (!editingId || !confirm(`Supprimer « ${form.name} » ?`)) return;
    const res = await fetch(`/api/beers/${editingId}`, { method: 'DELETE' });
    if (res.status === 401) { location.href = '/connexion'; return; }
    if (!res.ok) return;
    router.push('/admin');
    router.refresh();
  }

  function onUpload(field: 'labelImage' | 'artwork') {
    return async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = '';
      if (!f) return;
      const fd = new FormData();
      fd.set('file', f);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.status === 401) { location.href = '/connexion'; return; }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setFormError(data.error || 'Fichier illisible.'); return; }
      setForm(fm => ({ ...fm, [field]: data.path }));
      setSavedMsg('');
    };
  }

  function downloadQr() {
    const s = qrSvgString(previewUrl);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' }));
    a.download = 'qr-' + previewId + '.svg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const labelInputs: [FormKey, string, string][] = [
    ['name', 'Nom', 'Hop Overflow'], ['edition', '2e ligne (option)', '2025'], ['styleName', 'Style', 'NEIPA'],
    ['denomination', 'Dénomination (option)', 'Bière blonde'], ['brew', 'N° de brassin', ''], ['abv', 'Alcool % vol.', '5,5'],
    ['ebc', 'EBC', '11'], ['ibu', 'IBU', '40'], ['bottledOn', 'Embouteillée le', 'JJ/MM/AAAA'],
    ['bestBefore', 'DDM', 'MM/AAAA'], ['lot', 'Lot', lotFor({ bottledOn: form.bottledOn, brew: form.brew })],
    ['badge', 'Badge site (option)', 'Coup de cœur'],
  ];
  const labelTexts: [FormKey, string, string][] = [
    ['malts', 'Malts (allergènes entre *astérisques*)', '*Orge* : Pale Ale, Munich'],
    ['hops', 'Houblons', 'Citra, Mosaïc'], ['yeast', 'Levure', 'S-04'], ['other', 'Autres', 'Eau, sucre'],
  ];
  const tasteTexts: [FormKey, string, string][] = [
    ['look', 'Aspect', 'Robe, limpidité, mousse'], ['nose', 'Nez', 'Arômes'], ['mouth', 'Bouche', 'Saveurs, texture, corps'],
    ['finish', 'Finale', 'Amertume, longueur'], ['serving', 'Service', 'Température, verre'],
  ];
  const recipeInputs: [FormKey, string, string][] = [
    ['volume', 'Volume (L)', '20'], ['og', 'Densité initiale', '1,050'], ['fg', 'Densité finale', '1,012'],
  ];
  const recipeTexts: [FormKey, string, string][] = [
    ['grains', 'Malts & grains', 'Pale Ale | 4,0 kg'], ['hopSchedule', 'Houblonnage', 'Citra | 50 g | dry hop J3'],
    ['mash', 'Empâtage', 'Empâtage | 67 °C | 60 min'], ['ferment', 'Fermentation', 'Verdant IPA | 19 °C | 10 jours'],
    ['notes', 'Le mot du brasseur', 'Une phrase, sans point d’exclamation.'],
  ];

  return (
    <main style={{ maxWidth: 1320, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,48px) 96px' }}>
      <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--encre-2)' }}>
        <CuveeIcon name="ArrowLeft" size={16} />Les brassins
      </Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', margin: '20px 0 0', paddingBottom: 20, borderBottom: '1px solid var(--encre)' }}>
        <h1 style={{ margin: 0, font: '400 clamp(32px,4.5vw,52px)/1 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
          {editingId ? `Modifier « ${form.name} »` : 'Nouvelle bière'}
        </h1>
        <span style={{ font: '500 12px var(--font-mono)', color: 'var(--success)' }}>{savedMsg}</span>
      </div>

      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,540px),1fr))', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <fieldset style={fieldset}>
            <legend style={legend}>Étiquette</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>
              {labelInputs.map(([k, label, placeholder]) => (
                <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={capLbl}>{label}</span>
                  <input value={form[k]} onChange={set(k)} placeholder={placeholder} style={inp} />
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={capLbl}>Bouteille</span>
                <select value={form.bottle} onChange={set('bottle')} style={sel}>
                  <option value="75cl">75 cl</option><option value="33cl">33 cl long neck</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={capLbl}>Couleur de cuvée</span>
                <select value={form.accent} onChange={set('accent')} style={sel}>
                  {ACCENTS.map(([l, v]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={capLbl}>Icône</span>
                <select value={form.icon} onChange={set('icon')} style={sel} disabled={!!form.artwork}>
                  {ICON_GROUPS.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.icons.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={capLbl}>SVG perso (remplace l’icône)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 42 }}>
                  {form.artwork && <img src={form.artwork} alt="Illustration perso" style={{ height: 32, width: 'auto', display: 'block' }} />}
                  <label style={{ display: 'inline-flex', alignItems: 'center', height: 32, padding: '0 10px', border: '1px solid var(--encre)', background: 'var(--papier)', cursor: 'pointer', font: '600 10px var(--font-text)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--encre)' }}>
                    <input type="file" accept=".svg,image/svg+xml" onChange={onUpload('artwork')} style={{ display: 'none' }} />
                    {form.artwork ? 'Remplacer' : 'Charger'}
                  </label>
                  {form.artwork && (
                    <span onClick={() => { setForm(fm => ({ ...fm, artwork: '' })); setSavedMsg(''); }} className="hov-under"
                      style={{ cursor: 'pointer', font: '600 10px var(--font-text)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--danger)' }}>Retirer</span>
                  )}
                </div>
              </div>
            </div>
            {labelTexts.map(([k, label, placeholder]) => (
              <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={capLbl}>{label}</span>
                <textarea value={form[k]} onChange={set(k)} placeholder={placeholder} rows={2} style={ta} />
              </label>
            ))}
          </fieldset>

          <fieldset style={fieldsetNext}>
            <legend style={legend}>Ancienne étiquette (image)</legend>
            <p style={{ margin: 0, font: '400 13px/1.5 var(--font-text)', color: 'var(--encre-3)' }}>
              Si une image est chargée, elle remplace l’étiquette générée sur le site. Les planches A4 utilisent toujours l’étiquette générée.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              {form.labelImage && <img src={form.labelImage} alt="Ancienne étiquette" style={{ display: 'block', height: 96, width: 'auto', border: '1px solid var(--filet)' }} />}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 16px', border: '1px solid var(--encre)', background: 'var(--papier)', cursor: 'pointer', font: '600 12px var(--font-text)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--encre)' }}>
                <input type="file" accept="image/*" onChange={onUpload('labelImage')} style={{ display: 'none' }} />
                {form.labelImage ? 'Remplacer l’image' : 'Charger une image'}
              </label>
              {form.labelImage && (
                <span onClick={() => { setForm(fm => ({ ...fm, labelImage: '' })); setSavedMsg(''); }} className="hov-under"
                  style={{ cursor: 'pointer', font: '600 11px var(--font-text)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--danger)' }}>Retirer</span>
              )}
            </div>
          </fieldset>

          <fieldset style={fieldsetNext}>
            <legend style={legend}>Dégustation &amp; histoire</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
              {tasteTexts.map(([k, label, placeholder]) => (
                <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={capLbl}>{label}</span>
                  <textarea value={form[k]} onChange={set(k)} placeholder={placeholder} rows={2} style={ta} />
                </label>
              ))}
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={capLbl}>Histoire du brassin (option, avant la recette)</span>
              <textarea value={form.description} onChange={set('description')} placeholder="D’où vient l’idée, la démarche, l’événement pour lequel elle a été brassée…" rows={5} style={{ ...ta, font: '400 15px/1.5 var(--font-text)' }} />
            </label>
          </fieldset>

          <fieldset style={fieldsetNext}>
            <legend style={legend}>Recette</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
              {recipeInputs.map(([k, label, placeholder]) => (
                <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={capLbl}>{label}</span>
                  <input value={form[k]} onChange={set(k)} placeholder={placeholder} style={{ ...inp, font: '400 15px var(--font-mono)' }} />
                </label>
              ))}
            </div>
            <p style={{ margin: 0, font: '400 13px/1.5 var(--font-text)', color: 'var(--encre-3)' }}>
              Une ligne par élément, colonnes séparées par « | ». Exemple : <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--encre-2)' }}>Citra | 50 g | dry hop J3</span>
            </p>
            {recipeTexts.map(([k, label, placeholder]) => (
              <label key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={capLbl}>{label}</span>
                <textarea value={form[k]} onChange={set(k)} placeholder={placeholder} rows={4} style={taMono} />
              </label>
            ))}
          </fieldset>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', paddingTop: 20, borderTop: '1px solid var(--encre)' }}>
            <Button variant="primary" onClick={save}>Enregistrer</Button>
            <Link href="/admin"><Button variant="outline">Retour</Button></Link>
            {editingId && (
              <span onClick={del} className="hov-under" style={{ marginLeft: 'auto', cursor: 'pointer', font: '600 11px var(--font-text)', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--danger)' }}>Supprimer</span>
            )}
          </div>
          {formError && <p style={{ margin: 0, font: '500 14px var(--font-text)', color: 'var(--danger)' }}>{formError}</p>}
        </div>

        <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--papier-2)', padding: '24px 12px', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <BeerLabel {...labelProps(form, 0.9)} />
          </div>
          <div style={{ background: 'var(--papier)', border: '1px solid var(--filet)', display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: 20, padding: 20, alignItems: 'center' }}>
            <div style={{ width: 148, height: 148, background: 'var(--papier)' }}><QrSvg url={previewUrl} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
              <div style={{ font: '500 12px var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--encre)' }}>QR code de l’étiquette</div>
              <div style={{ font: '400 13px/1.4 var(--font-mono)', color: 'var(--encre-2)', wordBreak: 'break-all' }}>{previewUrl}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button variant="outline" size="sm" onClick={downloadQr}>Télécharger SVG</Button>
                <Link href={`/admin/planche?biere=${previewId}`}><Button variant="outline" size="sm">Planche A4</Button></Link>
                <Link href={`/biere/${previewId}`}><Button variant="ghost" size="sm">Voir la page</Button></Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
