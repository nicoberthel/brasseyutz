import { num, norm } from './domain.ts';

export type HopStage = 'Ébullition' | 'Hopstand' | 'Dry hop' | 'Épices';
export const HOP_STAGES: HopStage[] = ['Ébullition', 'Hopstand', 'Dry hop', 'Épices'];
export type Grain = { nom: string; kg: number | null };
export type HopLine = { etape: HopStage; nom: string; qte: string; detail: string };
export type MashStep = { temp: number; min: number | null; label: string };
export type Mash = { eau: string; rincage: string; ebullitionMin: number | null; note: string; paliers: MashStep[] };
export type FermentStep = { temp: number; duree: string; label: string };
export type Ferment = { ensemencement: string; refermentation: string; paliers: FermentStep[] };
export type Radar = [number, number, number, number, number, number, number, number];

export const RADAR_AXES: readonly string[] = [
  'Amertume', 'Douceur', 'Corps', 'Fruité', 'Floral / herbacé', 'Épicé', 'Malté', 'Torréfié',
];

export type FamilleKey = 'houblonnee' | 'blonde' | 'belge' | 'blanche' | 'brune';
export const FAMILLES: { key: FamilleKey; label: string }[] = [
  { key: 'houblonnee', label: 'Houblonnées' },
  { key: 'blonde', label: 'Blondes' },
  { key: 'belge', label: 'Belges' },
  { key: 'blanche', label: 'Blanches & fruits' },
  { key: 'brune', label: 'Brunes & fêtes' },
];

const FAMILLE_WORDS: [FamilleKey, string[]][] = [
  ['houblonnee', ['ipa', 'neipa', 'apa', 'american pale ale', 'micro ipa', 'pale ale']],
  ['blonde', ['pils', 'lager', 'blonde', 'blond ale', 'golden']],
  ['belge', ['triple', 'double', 'belge']],
  ['blanche', ['blanche', 'blé', 'ble', 'wheat', 'fruit', 'sour']],
  ['brune', ['dunkel', 'brown', 'noël', 'noel', 'stout', 'porter', 'ambrée', 'ambree']],
];

export function familleOf(styleName: string): FamilleKey | '' {
  const s = norm(styleName);
  if (!s) return '';
  for (const [key, words] of FAMILLE_WORDS) {
    if (words.some(w => s.includes(norm(w)))) return key;
  }
  return '';
}

export function emptyMash(): Mash {
  return { eau: '', rincage: '', ebullitionMin: null, note: '', paliers: [] };
}
export function emptyFerment(): Ferment {
  return { ensemencement: '', refermentation: '', paliers: [] };
}

export function isLegacyText(v: unknown): boolean {
  if (typeof v !== 'string') return false;
  const t = v.trim();
  return t !== '' && !t.startsWith('[') && !t.startsWith('{');
}

function load(v: unknown): unknown {
  if (typeof v === 'string') {
    const t = v.trim();
    if (!t) return null;
    try { return JSON.parse(t); } catch { return null; }
  }
  return v ?? null;
}

const str = (v: unknown): string => (v == null ? '' : String(v).trim());
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

export function parseGrains(v: unknown): Grain[] | null {
  const a = load(v);
  if (!Array.isArray(a) || !a.length) return null;
  return a.filter(isObj).map(g => ({ nom: str(g.nom), kg: num(g.kg) ?? null }));
}

export function parseHops(v: unknown): HopLine[] | null {
  const a = load(v);
  if (!Array.isArray(a) || !a.length) return null;
  return a.filter(isObj).map(h => ({
    etape: (HOP_STAGES as string[]).includes(str(h.etape)) ? (str(h.etape) as HopStage) : 'Ébullition',
    nom: str(h.nom),
    qte: str(h.qte),
    detail: str(h.detail),
  }));
}

export function parseMash(v: unknown): Mash | null {
  const o = load(v);
  if (!isObj(o)) return null;
  const paliers = (Array.isArray(o.paliers) ? o.paliers : []).filter(isObj)
    .map(p => ({ temp: num(p.temp) ?? 0, min: num(p.min) ?? null, label: str(p.label) }));
  const m: Mash = {
    eau: str(o.eau), rincage: str(o.rincage), ebullitionMin: num(o.ebullitionMin) ?? null,
    note: str(o.note), paliers,
  };
  if (!m.paliers.length && !m.eau && !m.rincage && !m.note && m.ebullitionMin === null) return null;
  return m;
}

export function parseFerment(v: unknown): Ferment | null {
  const o = load(v);
  if (!isObj(o)) return null;
  const paliers = (Array.isArray(o.paliers) ? o.paliers : []).filter(isObj)
    .map(p => ({ temp: num(p.temp) ?? 0, duree: str(p.duree), label: str(p.label) }));
  const f: Ferment = { ensemencement: str(o.ensemencement), refermentation: str(o.refermentation), paliers };
  if (!f.paliers.length && !f.ensemencement && !f.refermentation) return null;
  return f;
}

export function parseRadar(v: unknown): Radar | null {
  const a = load(v);
  if (!Array.isArray(a) || a.length !== 8) return null;
  const n = a.map(x => (typeof x === 'number' || typeof x === 'string' ? num(x) : undefined));
  if (n.some(x => x === undefined || x < 0 || x > 5)) return null;
  return n as Radar;
}

export function toCol(v: unknown): string {
  return v == null ? '' : JSON.stringify(v);
}

export function grainsTotalKg(g: Grain[]): number | null {
  const k = g.filter(x => x.kg !== null);
  return k.length ? k.reduce((s, x) => s + (x.kg as number), 0) : null;
}

export function hopsTotalG(h: HopLine[]): number {
  let t = 0;
  for (const l of h) {
    if (l.etape === 'Épices') continue;
    const m = l.qte.trim().match(/^(\d+(?:[.,]\d+)?)\s*(g|kg)$/i);
    if (!m) continue;
    const n = parseFloat(m[1].replace(',', '.'));
    t += m[2].toLowerCase() === 'kg' ? n * 1000 : n;
  }
  return t;
}

export function mashMinutes(m: Mash): number {
  return m.paliers.reduce((s, p) => s + (p.min ?? 0), 0);
}

export function fr(n: number, max = 1, min = 0): string {
  return Number(n).toLocaleString('fr-FR', { maximumFractionDigits: max, minimumFractionDigits: min });
}

export function nbsp(s: string): string {
  return s
    .replace(/n°\s/g, 'n° ')
    .replace(/(\d)\s(%|L\b|min\b|°C|g\b|kg\b|j\b|sem\.|EBC|IBU)/g, '$1 $2');
}
