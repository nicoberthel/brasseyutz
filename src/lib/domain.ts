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

export function rows(t: unknown): { a: string; b: string; c: string }[] {
  return String(t || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const p = l.split('|').map(s => s.trim());
    return { a: p[0] || '', b: p[1] || '', c: p.slice(2).join(' · ') };
  });
}

export function lotFor(b: { bottledOn?: string; brew?: number | string }): string {
  const m = String(b.bottledOn || '').match(/(\d{2})\/(\d{2})\/\d{2}(\d{2})/);
  return m ? 'L' + m[3] + m[2] + '-' + b.brew : 'L—';
}

export interface BeerLike {
  name?: string; edition?: string; styleName?: string; denomination?: string;
  malts?: string; hops?: string; yeast?: string; other?: string;
  brew?: number | string; lot?: string;
}

export function matches(b: BeerLike, query: string): boolean {
  const q = norm(query).trim();
  if (!q) return true;
  const hay = norm([b.name, b.edition, b.styleName, b.denomination, b.malts, b.hops, b.yeast, b.other, 'n° ' + b.brew, b.brew, b.lot].join(' '));
  return q.split(/\s+/).every(t => hay.includes(t));
}

export function abvTxt(abv: unknown): string {
  return String(abv ?? '').replace('.', ',');
}
