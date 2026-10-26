import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Beer } from '@/lib/schema';
import { abvTxt, num, splitName } from '@/lib/domain';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { Gauge } from '@/components/ds/Gauge';
import { LabelThumb } from './LabelThumb';

const NB = ' ';

/* Teinte douce d'une couleur de cuvée : var(--cuvee-x) → var(--cuvee-x-soft). */
export function soft(accent: string): string {
  return /^var\(--cuvee-[a-z0-9-]+\)$/.test(accent) ? accent.replace(')', '-soft)') : 'var(--papier-ecran)';
}

export function Stat({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 14px/1 var(--font-text)', color: 'var(--text-body)' }}>
      <CuveeIcon name={icon} size={16} stroke={1.75} />{children}
    </span>
  );
}

function Heart({ beer }: { beer: Beer }) {
  return beer.favorite
    ? <span title="Coup de cœur" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: 8, color: beer.accent }}><CuveeIcon name="Heart" size={18} stroke={2} /></span>
    : null;
}

function Name({ beer }: { beer: Beer }) {
  const [first, second] = splitName(beer);
  return <>{first}{second ? <i style={{ color: beer.accent }}> {second}</i> : null}<Heart beer={beer} /></>;
}

/* Tuile du rail d'accueil. */
export function CuveeTile({ beer }: { beer: Beer }) {
  return (
    <Link href={`/biere/${beer.id}`} className="tile" style={{ background: soft(beer.accent) }}>
      <div style={{ padding: '10px 0 20px' }}><LabelThumb beer={beer} tilt={-2} /></div>
      <div style={{ font: '400 30px/1 var(--font-display)', color: 'var(--text-strong)', letterSpacing: '-0.01em', textAlign: 'left' }}><Name beer={beer} /></div>
      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        <Stat icon="Percent">{abvTxt(beer.abv)}{NB}%</Stat>
        <Stat icon="Tag">{beer.styleName}</Stat>
      </div>
    </Link>
  );
}

/* Bouton « fun » façon commande de terminal vers la fiche. */
export function CodeLink({ beer }: { beer: Beer }) {
  return (
    <Link href={`/biere/${beer.id}`} className="cmd" aria-label={`Ouvrir la fiche de ${beer.name}`}>
      Fiche de brassin
      <span className="go" style={{ background: beer.accent }}><CuveeIcon name="Beer" size={18} color="#fff" stroke={2} /></span>
    </Link>
  );
}

/* Carte de la grille /cuvees (§5.2). */
export function CuveeCard({ beer }: { beer: Beer }) {
  const ebc = num(beer.ebc), ibu = num(beer.ibu);
  return (
    <article className="card" style={{ background: soft(beer.accent) }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ width: 72, height: 72, borderRadius: 'var(--radius-web-tile)', background: 'var(--papier)', display: 'grid', placeItems: 'center', color: beer.accent, flex: 'none' }}>
          {beer.artwork
            ? <img src={beer.artwork} alt="" style={{ width: 36, height: 36, objectFit: 'contain', display: 'block' }} />
            : <CuveeIcon name={beer.icon} size={36} stroke={1.4} />}
        </span>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ font: '400 30px/1 var(--font-display)', letterSpacing: '-0.01em' }}><Name beer={beer} /></div>
          <div style={{ font: '400 15px var(--font-text)', color: 'var(--text-body)' }}>{beer.styleName}{beer.denomination ? ' · ' + beer.denomination : ''}</div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <Stat icon="Percent">{abvTxt(beer.abv)}{NB}%{NB}vol</Stat>
            {ibu !== undefined ? <Stat icon="Hop">{beer.ibu}{NB}IBU</Stat> : null}
            <Stat icon="Hash">Brassin {beer.brew}</Stat>
          </div>
        </div>
      </div>
      <div style={{ margin: '18px 0 4px' }}><LabelThumb beer={beer} /></div>
      {ebc !== undefined || ibu !== undefined ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          {ebc !== undefined ? <div className="mini"><span>Couleur · {beer.ebc}{NB}EBC</span><Gauge kind="ebc" value={ebc} showLabel={false} /></div> : null}
          {ibu !== undefined ? <div className="mini"><span>Amertume · {beer.ibu}{NB}IBU</span><Gauge kind="ibu" value={ibu} accent={beer.accent} showLabel={false} /></div> : null}
        </div>
      ) : null}
      <div style={{ alignSelf: 'center', marginTop: 16 }}><CodeLink beer={beer} /></div>
    </article>
  );
}

/* Carte « Les autres cuvées » de la fiche. */
export function PhotoCard({ beer }: { beer: Beer }) {
  return (
    <Link href={`/biere/${beer.id}`} className="photo" style={{ background: soft(beer.accent) }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 14px 0' }}>
        <LabelThumb beer={beer} tilt={-2} />
      </div>
      <span className="cap">
        <b>{beer.name}{beer.edition ? <i> {beer.edition}</i> : null}</b>
        <span><CuveeIcon name="Percent" size={14} stroke={1.75} />{abvTxt(beer.abv)}{NB}% · {beer.styleName}</span>
      </span>
    </Link>
  );
}

/* Recherche sans résultat. */
export function Empty({ q }: { q: string }) {
  return (
    <div className="panel" style={{ textAlign: 'center', display: 'grid', gap: 6, justifyItems: 'center' }}>
      <span style={{ font: '500 15px var(--font-mono)' }}>404 — bière introuvable</span>
      <span style={{ font: '400 15px var(--font-text)', color: 'var(--text-body)' }}>Rien pour «{NB}{q}{NB}». Essaie un houblon : Citra, Mosaïc, Fuggle…</span>
    </div>
  );
}
