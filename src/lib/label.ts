import { abvTxt, lotFor, num } from './domain';
import type { LabelProps } from '@/components/ds/BeerLabel';

type BeerFields = {
  bottle?: string; name?: string; edition?: string; styleName?: string;
  denomination?: string; brew?: number | string; abv?: string; ebc?: string;
  ibu?: string; malts?: string; hops?: string; yeast?: string; other?: string;
  bottledOn?: string; bestBefore?: string; lot?: string; accent?: string; icon?: string;
  artwork?: string;
};

export function labelProps(b: BeerFields, scale = 1, opts: { print?: boolean; monochrome?: boolean } = {}): LabelProps {
  return {
    bottle: b.bottle === '33cl' ? '33cl' : '75cl',
    name: b.name || 'Nom de la bière',
    edition: b.edition || undefined,
    styleName: b.styleName || 'Style',
    denomination: b.denomination || undefined,
    brew: b.brew,
    abv: num(b.abv) ?? 0,
    ebc: num(b.ebc),
    ibu: num(b.ibu),
    malts: b.malts,
    hops: b.hops,
    yeast: b.yeast,
    other: b.other,
    bottledOn: b.bottledOn || 'JJ/MM/AAAA',
    bestBefore: b.bestBefore || 'MM/AAAA',
    lot: b.lot || lotFor(b),
    accent: b.accent,
    icon: b.icon,
    artwork: b.artwork || undefined,
    monochrome: !!opts.monochrome,
    scale,
    logoSrc: '/assets/logo-brasse-yutz.svg',
    pregnancySrc: '/assets/legal/zero-alcool-grossesse-gris.svg',
    trimanSrc: '/assets/legal/triman-gris.png',
    style: opts.print ? {} : { boxShadow: 'var(--shadow-print)' },
  };
}

export { abvTxt };
