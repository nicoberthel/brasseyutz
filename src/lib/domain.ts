export function num(v: unknown): number | undefined {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return isNaN(n) ? undefined : n;
}

export function norm(s: unknown): string {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function slug(s: string): string {
  return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'biere';
}

export function splitName(b: { name?: string; edition?: string }): [string, string] {
  if (b.edition) return [b.name || '', b.edition];
  const w = String(b.name || '').split(' ');
  const k = Math.ceil(w.length / 2);
  return [w.slice(0, k).join(' '), w.slice(k).join(' ')];
}

export function lotFor(b: { bottledOn?: string; brew?: number | string }): string {
  const m = String(b.bottledOn || '').match(/(\d{2})\/(\d{2})\/\d{2}(\d{2})/);
  return m ? 'L' + m[3] + m[2] + '-' + b.brew : 'L—';
}

export interface BeerLike {
  name?: string; edition?: string; styleName?: string; denomination?: string;
  malts?: string; hops?: string; yeast?: string; other?: string;
  brew?: number | string; lot?: string; grains?: string; hopSchedule?: string;
}

/* Noms des lignes d’une colonne recette JSON (tableau d’objets { nom }) ; rien pour le texte legacy. */
function jsonNames(v: unknown): string[] {
  const t = String(v ?? '').trim();
  if (!t.startsWith('[')) return [];
  try {
    const a: unknown = JSON.parse(t);
    return Array.isArray(a) ? a.map(x => String((x as { nom?: unknown })?.nom ?? '')) : [];
  } catch { return []; }
}

export function matches(b: BeerLike, query: string): boolean {
  const q = norm(query).trim();
  if (!q) return true;
  const hay = norm([b.name, b.edition, b.styleName, b.denomination, b.malts, b.hops, b.yeast, b.other, 'n° ' + b.brew, b.brew, b.lot,
    ...jsonNames(b.grains), ...jsonNames(b.hopSchedule)].join(' '));
  return q.split(/\s+/).every(t => hay.includes(t));
}

/* Filtre commun accueil / cuvées : famille (onglet, 'toutes' = pas de filtre) + recherche. */
export function filterBeers<T extends BeerLike & { famille?: string | null }>(beers: T[], tab: string, q: string): T[] {
  return beers.filter(b => (tab === 'toutes' || b.famille === tab) && matches(b, q));
}

export function abvTxt(abv: unknown): string {
  return String(abv ?? '').replace('.', ',');
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export interface BrewStats {
  count: number; liters: number; since?: string;
  topHop?: { name: string; count: number }; abvMin?: number; abvMax?: number;
}

/* Chiffres du bandeau d'accueil, calculés sur les champs saisis ; un champ vide ne compte pas. */
export function brewStats(beers: { volume?: string; abv?: string; hops?: string; bottledOn?: string }[]): BrewStats {
  let liters = 0, first: [number, number] | undefined;
  const abvs: number[] = [];
  const hops = new Map<string, { name: string; count: number }>();
  for (const b of beers) {
    liters += num(b.volume) ?? 0;
    const a = num(b.abv);
    if (a !== undefined) abvs.push(a);
    const m = String(b.bottledOn || '').match(/^\d{2}\/(\d{2})\/(\d{4})$/);
    if (m) {
      const d: [number, number] = [+m[2], +m[1]];
      if (!first || d[0] < first[0] || (d[0] === first[0] && d[1] < first[1])) first = d;
    }
    const seen = new Set<string>();
    for (const h of String(b.hops || '').split(/[,;+/]/).map(s => s.trim()).filter(Boolean)) {
      const k = norm(h);
      if (seen.has(k)) continue;
      seen.add(k);
      const e = hops.get(k);
      if (e) e.count++; else hops.set(k, { name: h, count: 1 });
    }
  }
  const topHop = [...hops.values()].sort((x, y) => y.count - x.count || x.name.localeCompare(y.name, 'fr'))[0];
  return {
    count: beers.length, liters: Math.round(liters * 10) / 10,
    since: first ? `${MOIS[first[1] - 1]} ${first[0]}` : undefined,
    topHop, abvMin: abvs.length ? Math.min(...abvs) : undefined, abvMax: abvs.length ? Math.max(...abvs) : undefined,
  };
}
