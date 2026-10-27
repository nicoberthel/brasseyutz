import { num, norm } from './domain.ts';
import {
  familleOf, emptyMash, emptyFerment,
  type Grain, type HopLine, type HopStage, type Mash, type MashStep,
  type Ferment, type FermentStep, type FamilleKey,
} from './recipe.ts';

export type LegacyBeer = {
  grains?: string; hopSchedule?: string; mash?: string; ferment?: string;
  yeast?: string; other?: string; styleName?: string; serving?: string;
};

const NUM = '\\d+(?:[.,]\\d+)?';

/** Lignes non vides découpées sur « | » (colonnes rognées). */
function lines(t: unknown): string[][] {
  return String(t || '').split('\n').map(l => l.trim()).filter(Boolean)
    .map(l => l.split('|').map(s => s.trim()));
}

const hasTemp = (s: string) => /°/.test(s) || new RegExp(`^${NUM}$`).test(s);
const firstNum = (s: string): number | null => {
  const m = s.match(new RegExp(NUM));
  return m ? (num(m[0]) ?? null) : null;
};

export function legacyGrains(t: string): Grain[] | null {
  const out: Grain[] = [];
  for (const c of lines(t)) {
    const nom = c[0] || '';
    const q = c[1] || '';
    if (!nom && !q) continue;
    const m = q.match(new RegExp(`^(${NUM})\\s*(?:k|kg)?$`, 'i'));
    if (m) out.push({ nom, kg: num(m[1]) ?? null });
    else out.push({ nom: q ? `${nom} ${q}`.trim() : nom, kg: null });
  }
  return out.length ? out : null;
}

const SPICES = ['gingembre', 'cannelle', 'girofle', 'orange', 'coriandre', 'framboise', 'mangue',
  'ananas', 'zeste', 'ecorce', 'poivre', 'vanille', 'sucre'];

function stageOf(raw: string): HopStage | null {
  const s = norm(raw);
  if (s.includes('ebullition') || s.includes('ebulition')) return 'Ébullition';
  if (s.includes('hopstand') || s.includes('whirlpool')) return 'Hopstand';
  if (s.includes('dry hop')) return 'Dry hop';
  if (s.includes('fermentation')) return 'Épices';
  return null;
}

export function legacyHops(t: string): HopLine[] | null {
  const out: HopLine[] = [];
  for (const c of lines(t)) {
    const nom = c[0] || '';
    if (!nom) continue;
    const qte = c[1] || '';
    const duree = c[2] || '';
    const etapeRaw = c[3] || '';
    const isSpice = SPICES.some(w => norm(nom).includes(w));
    if (norm(etapeRaw).includes('fermentation')) {
      out.push({ etape: 'Épices', nom, qte, detail: duree ? `en fermentation · ${duree}` : 'en fermentation' });
    } else if (isSpice) {
      out.push({ etape: 'Épices', nom, qte, detail: duree });
    } else {
      const etape = (etapeRaw ? stageOf(etapeRaw) : stageOf(duree)) ?? 'Ébullition';
      out.push({ etape, nom, qte, detail: duree });
    }
  }
  return out.length ? out : null;
}

function mashLabel(label: string, temp: number): string {
  const n = norm(label.trim());
  if (!n) return temp <= 55 ? 'Palier protéique' : temp >= 75 ? 'Mash-out' : 'Saccharification';
  if (n.startsWith('empatage') || n.startsWith('saccharification')) return 'Saccharification';
  if (/^mash[- ]?out/.test(n)) return 'Mash-out';
  if (n.startsWith('proteine')) return 'Palier protéique';
  return label.trim();
}

export function legacyMash(t: string, hops: HopLine[] | null): Mash | null {
  const m = emptyMash();
  const notes: string[] = [];
  for (const c of lines(t)) {
    const label = c[0] || '';
    const rest = c.slice(1);
    const rawTempCol = rest.find(x => /°/.test(x)) ?? (rest[0] && hasTemp(rest[0]) ? rest[0] : undefined);
    const tempCol = rawTempCol && firstNum(rawTempCol) !== null ? rawTempCol : undefined;
    const isRinse = norm(label).startsWith('rincage');
    if (isRinse) {
      const vol = rest.find(x => /^\d+(?:[.,]\d+)?\s*L\b/i.test(x));
      const temp = tempCol ? `${firstNum(tempCol)} °C`.replace('.', ',') : '';
      m.rincage = vol && temp ? `${vol} à ${temp}` : (vol || temp);
      if (!m.rincage) notes.push(c.filter(Boolean).join(' '));
      continue;
    }
    if (!tempCol) {
      const text = c.filter(Boolean).join(' ');
      if (text) notes.push(text);
      continue;
    }
    const temp = firstNum(tempCol) as number;
    const mm = (rest[1] || '').match(new RegExp(`^(${NUM})\\s*(?:min)?$`, 'i'));
    const step: MashStep = { temp, min: mm ? (num(mm[1]) ?? null) : null, label: mashLabel(label, temp) };
    m.paliers.push(step);
    const eau = rest[2] || '';
    if (/\d/.test(eau) && /L\b/i.test(eau) && !m.eau) m.eau = eau;
  }
  m.note = notes.join(' · ');
  if (!m.paliers.length && !m.eau && !m.rincage && !m.note) return null;
  const boil = (hops || []).filter(h => h.etape === 'Ébullition')
    .map(h => h.detail.match(/(\d+)\s*min/i)).filter(Boolean).map(x => Number((x as RegExpMatchArray)[1]));
  m.ebullitionMin = boil.length ? Math.max(...boil) : 60;
  return m;
}

const isCold = (s: string) => /cold cr(?:ash|ush)/.test(norm(s));

function dureeOf(raw: string): { duree: string; reste: string } {
  const m = raw.match(new RegExp(`^(${NUM})\\s*(jours?|j|semaines?|sem)\\.?(?![a-zà-ÿ])\\s*(.*)$`, 'i'));
  if (!m) return { duree: raw, reste: '' };
  const unit = m[2].toLowerCase().startsWith('s') ? 'sem.' : 'j';
  return { duree: `${m[1]} ${unit}`, reste: m[3].trim() };
}

export function legacyFerment(
  t: string, yeast: string, other: string, onSkip?: (cols: string[]) => void,
): Ferment | null {
  const f = emptyFerment();
  for (const raw of lines(t)) {
    let c = raw;
    let label = '';
    if (!hasTemp(c[0] || '')) {
      if (c[1] && /°/.test(c[1])) {
        if (isCold(c[0]) || norm(c[0]) === 'garde') label = c[0];
        c = c.slice(1);
      } else { onSkip?.(raw); continue; }
    }
    const temp = firstNum(c[0]);
    if (temp === null) { onSkip?.(raw); continue; }
    const { duree, reste } = dureeOf(c[1] || '');
    label = label || c[2] || reste;
    if (isCold(label)) label = 'Cold crash';
    if (!label) {
      label = !f.paliers.length ? 'Fermentation principale' : temp <= 5 ? 'Garde à froid' : 'Fin de fermentation';
    }
    const step: FermentStep = { temp, duree, label };
    f.paliers.push(step);
  }
  f.ensemencement = yeast && yeast.trim() ? `1 sachet · ${yeast.trim()}` : '';
  f.refermentation = norm(other).includes('sucre') ? 'Sucre · 2 sem. à 20 °C' : '';
  if (!f.paliers.length) return null;
  return f;
}

export function normalizeServing(s: string): string {
  const t = String(s || '').trim().replace(/\.$/, '').trim();
  return t.replace(/\s*°C/g, ' °C');
}

export function legacyToRecipe(b: LegacyBeer): {
  grains: Grain[] | null; hopSchedule: HopLine[] | null; mash: Mash | null;
  ferment: Ferment | null; famille: FamilleKey | ''; serving: string;
} {
  let hopSchedule = legacyHops(b.hopSchedule || '');
  const skipped: HopLine[] = [];
  const ferment = legacyFerment(b.ferment || '', b.yeast || '', b.other || '', cols => {
    skipped.push({ etape: 'Épices', nom: cols[0] || '', qte: '', detail: cols.slice(1).filter(Boolean).join(' · ') });
  });
  if (skipped.length) hopSchedule = [...(hopSchedule || []), ...skipped];
  return {
    grains: legacyGrains(b.grains || ''),
    hopSchedule,
    mash: legacyMash(b.mash || '', hopSchedule),
    ferment,
    famille: familleOf(b.styleName || ''),
    serving: normalizeServing(b.serving || ''),
  };
}
