import { lotFor, slug } from './domain';
import type { NewBeer } from './schema';

const OPTIONAL_TEXT = ['edition', 'denomination', 'ebc', 'ibu', 'malts', 'hops', 'yeast', 'other',
  'bottledOn', 'bestBefore', 'lot', 'volume', 'og', 'fg', 'grains', 'hopSchedule', 'mash',
  'ferment', 'notes', 'look', 'nose', 'mouth', 'finish', 'serving', 'description', 'labelImage'] as const;

const REQUIRED_MSG = 'Nom, style, n° de brassin et alcool sont obligatoires.';

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
  if (!beer.lot) beer.lot = lotFor({ bottledOn: beer.bottledOn, brew });
  return { ok: true, beer };
}
