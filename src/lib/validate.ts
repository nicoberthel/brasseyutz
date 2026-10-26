import { lotFor, slug } from './domain.ts';
import type { NewBeer } from './schema.ts';
import {
  FAMILLES, familleOf, isLegacyText, parseFerment, parseGrains, parseHops, parseMash, parseRadar, toCol,
  type HopLine,
} from './recipe.ts';
import { legacyMash, legacyToRecipe, normalizeServing, type LegacyBeer } from './recipe-legacy.ts';

const OPTIONAL_TEXT = ['edition', 'denomination', 'ebc', 'ibu', 'malts', 'hops', 'yeast', 'other',
  'bottledOn', 'bestBefore', 'lot', 'volume', 'og', 'fg', 'notes', 'look', 'nose', 'mouth', 'finish',
  'description', 'labelImage', 'artwork'] as const;

export const RECIPE_COLUMNS = ['grains', 'hopSchedule', 'mash', 'ferment'] as const;
type RecipeCol = typeof RECIPE_COLUMNS[number];

const REQUIRED_MSG = 'Nom, style, n° de brassin et alcool sont obligatoires.';

/* Les 4 colonnes recette en chaînes JSON normalisées ('' si vide). Chaque colonne accepte
   objet/tableau, chaîne JSON ou texte legacy « a | b | c » (converti via recipe-legacy). */
export function recipeColumns(o: Record<string, unknown>): Record<RecipeCol, string> {
  const legacy = (k: RecipeCol) => isLegacyText(o[k]);
  const L = RECIPE_COLUMNS.some(legacy)
    ? legacyToRecipe({
      ...(o as LegacyBeer),
      ...Object.fromEntries(RECIPE_COLUMNS.map(k => [k, legacy(k) ? String(o[k]) : ''])),
    })
    : null;
  let hops: HopLine[] | null;
  if (legacy('hopSchedule')) hops = L!.hopSchedule;
  else {
    // L.hopSchedule ne contient alors que les lignes de fermentation reportées en Épices
    const extra = [...(parseHops(o.hopSchedule) || []), ...(L?.hopSchedule || [])];
    hops = extra.length ? extra : null;
  }
  return {
    grains: toCol(legacy('grains') ? L!.grains : parseGrains(o.grains)),
    hopSchedule: toCol(hops),
    mash: toCol(legacy('mash') ? legacyMash(String(o.mash), hops) : parseMash(o.mash)),
    ferment: toCol(legacy('ferment') ? L!.ferment : parseFerment(o.ferment)),
  };
}

export function validateBeer(input: unknown, opts: { id?: string } = {}):
  { ok: true; beer: NewBeer } | { ok: false; error: string } {
  if (typeof input !== 'object' || input === null) return { ok: false, error: REQUIRED_MSG };
  const o = input as Record<string, unknown>;
  const s = (k: string) => String(o[k] ?? '').trim();
  const name = s('name'), styleName = s('styleName'), abv = s('abv');
  const brew = Number(o.brew);
  if (!name || !styleName || !abv || !Number.isInteger(brew) || brew <= 0)
    return { ok: false, error: REQUIRED_MSG };
  const edition = s('edition');
  const bottle = s('bottle') === '33cl' ? '33cl' : '75cl';
  const beer: NewBeer = {
    id: opts.id || (typeof o.id === 'string' && o.id.trim()) || slug(name + (edition ? ' ' + edition : '')),
    name, styleName, abv, brew, bottle,
    accent: s('accent') || 'var(--cuvee-orange)',
    icon: s('icon') || 'Hop',
  };
  for (const k of OPTIONAL_TEXT) (beer as Record<string, unknown>)[k] = String(o[k] ?? '').replace(/^\s+|\s+$/g, '');
  Object.assign(beer, recipeColumns(o));
  beer.serving = normalizeServing(String(o.serving ?? ''));
  beer.radar = toCol(parseRadar(o.radar));
  const famille = s('famille');
  if (FAMILLES.some(f => f.key === famille)) beer.famille = famille;
  // ancien format (export v1 : pas de clé famille) : déduite du style, comme la migration
  else if (!('famille' in o)) beer.famille = familleOf(styleName);
  else beer.famille = '';
  beer.favorite = o.favorite === true || o.favorite === 1 || o.favorite === '1' ? 1 : 0;
  if (!beer.lot) beer.lot = lotFor({ bottledOn: beer.bottledOn, brew });
  return { ok: true, beer };
}
