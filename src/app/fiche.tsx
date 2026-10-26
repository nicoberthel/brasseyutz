import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { Beer } from '@/lib/schema';
import { abvTxt, num } from '@/lib/domain';
import {
  fr, grainsTotalKg, hopsTotalG, mashMinutes, nbsp,
  parseFerment, parseGrains, parseHops, parseMash, parseRadar,
} from '@/lib/recipe';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { Gauge } from '@/components/ds/Gauge';
import { LabelThumb } from '@/components/site/LabelThumb';
import { PhotoCard, soft } from '@/components/site/Cards';
import { Blk, StageBadge, Steps } from '@/components/site/Blk';
import { Radar } from '@/components/site/Radar';

const NB = '\u00a0';
const ONE_COL: CSSProperties = { gridTemplateColumns: 'minmax(0,1fr)' };

function Back() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', minHeight: 52 }}>
      <Link href="/cuvees" className="iconbtn" aria-label="Retour" style={{ color: 'var(--encre)' }}><CuveeIcon name="ChevronLeft" size={22} stroke={1.75} /></Link>
    </div>
  );
}

export function FicheIntrouvable() {
  return (
    <main className="page" style={{ alignItems: 'center', textAlign: 'center', paddingTop: 48 }}>
      <h1 style={{ margin: 0, font: '400 clamp(44px,7vw,64px)/1 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
        Bière <i style={{ color: 'var(--accent)' }}>introuvable</i>
      </h1>
      <p style={{ margin: 0, font: '400 17px/1.5 var(--font-text)', color: 'var(--text-body)' }}>Ce brassin n’est pas (ou plus) en ligne.</p>
      <Link href="/cuvees" className="pill" style={{ background: 'var(--encre)', color: 'var(--papier)' }}>
        <CuveeIcon name="ChevronLeft" size={18} stroke={1.75} />Toutes les cuvées
      </Link>
    </main>
  );
}

function Kv({ k, v, nw }: { k: string; v: string; nw?: boolean }) {
  return v ? <div className="row kv"><span>{k}</span><b className={nw ? 'nw' : undefined}>{nbsp(v)}</b></div> : null;
}

/* La recette (§5.3-4) : chaque bloc omis sans données, section omise si les 4 le sont. */
function Recette({ beer }: { beer: Beer }) {
  const ac = beer.accent;
  const grains = parseGrains(beer.grains);
  const hops = parseHops(beer.hopSchedule);
  const mash = parseMash(beer.mash);
  const ferment = parseFerment(beer.ferment);
  if (!grains && !hops && !mash && !ferment) return null;

  const kg = grains ? grainsTotalKg(grains) : null;
  const hopG = hops ? hopsTotalG(hops) : 0;
  const mashMin = mash ? mashMinutes(mash) : 0;
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h2 className="h2">La recette</h2>
      <div className="rec" style={{ '--c': ac, '--cs': soft(ac) } as CSSProperties}>
        {grains ? (
          <Blk icon="Wheat" title="Malts & grains" meta={kg !== null ? `${fr(kg, 2, 2)}${NB}kg` : undefined} accent={ac}>
            <div className="rows">
              {grains.map((g, i) => g.kg !== null ? (
                <div key={i} className="row g">
                  <span>{g.nom}</span>
                  <span className="bar"><i style={{ width: (kg ? g.kg / kg * 100 : 0) + '%' }} /></span>
                  <b>{fr(g.kg, 2, 2)}{NB}kg</b>
                  <em>{kg ? `${fr(g.kg / kg * 100, 0)}${NB}%` : ''}</em>
                </div>
              ) : (
                <div key={i} className="row g"><span style={{ gridColumn: '1 / -1' }}>{g.nom}</span></div>
              ))}
            </div>
          </Blk>
        ) : null}
        {hops ? (
          <Blk icon="Hop" title="Houblonnage" meta={hopG > 0 ? `${fr(hopG, 1)}${NB}g` : undefined} accent={ac}>
            <div className="rows">
              {hops.map((h, i) => (
                <div key={i} className="row h">
                  <StageBadge stage={h.etape} />
                  <span className="hn"><span>{h.nom}</span>{h.detail ? <em>{nbsp(h.detail)}</em> : null}</span>
                  <b>{nbsp(h.qte)}</b>
                </div>
              ))}
            </div>
          </Blk>
        ) : null}
        {mash ? (
          <Blk icon="Thermometer" title="Empâtage" meta={mashMin > 0 ? `${mashMin}${NB}min` : undefined} accent={ac}>
            <div className="rows">
              <Kv k="Eau d’empâtage" v={mash.eau} />
              {mash.paliers.length
                ? <Steps accent={ac} rows={mash.paliers.map(p => ({ temp: p.temp, label: p.label, right: p.min !== null ? `${p.min}${NB}min` : '' }))} />
                : null}
              <Kv k="Rinçage" v={mash.rincage} />
              <Kv k="Ébullition" v={mash.ebullitionMin !== null ? `${mash.ebullitionMin}${NB}min` : ''} nw />
              <Kv k="Note" v={mash.note} />
            </div>
          </Blk>
        ) : null}
        {ferment ? (
          <Blk icon="FlaskConical" title="Fermentation" meta={beer.yeast || undefined} accent={ac}>
            <div className="rows">
              <Kv k="Ensemencement" v={ferment.ensemencement} />
              {ferment.paliers.length
                ? <Steps accent={ac} rows={ferment.paliers.map(p => ({ temp: p.temp, label: p.label, right: nbsp(p.duree) }))} />
                : null}
              <Kv k="Refermentation" v={ferment.refermentation} />
            </div>
          </Blk>
        ) : null}
      </div>
    </section>
  );
}

/* Dégustation (§5.3-5) : radar et notes omis indépendamment, section omise si tout est vide. */
function Degustation({ beer }: { beer: Beer }) {
  const ac = beer.accent;
  const radar = parseRadar(beer.radar);
  const notes = ([['Eye', 'Aspect', beer.look], ['Flower2', 'Nez', beer.nose], ['Droplets', 'Bouche', beer.mouth], ['Hourglass', 'Finale', beer.finish]] as const)
    .filter(n => n[2] && n[2].trim());
  const serving = beer.serving?.trim() ?? '';
  const hasNotes = notes.length > 0 || !!serving;
  if (!radar && !hasNotes) return null;
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h2 className="h2">Dégustation</h2>
      <div className="degus" style={radar && hasNotes ? undefined : ONE_COL}>
        {radar ? <div className="blk" style={{ alignItems: 'center', justifyContent: 'center' }}><Radar values={radar} accent={ac} /></div> : null}
        {hasNotes ? (
          <div className="blk notes">
            {notes.map(([icon, k, v]) => (
              <div key={k} className="note">
                <span className="ni" style={{ color: ac }}><CuveeIcon name={icon} size={20} stroke={1.6} /></span>
                <div><b>{k}</b><p>{nbsp(v)}</p></div>
              </div>
            ))}
            {serving ? <div className="serve"><span><CuveeIcon name="Thermometer" size={18} stroke={1.75} />{'Servir à ' + nbsp(serving)}</span></div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

type Fig = { k: string; v: string; u?: string };

export function Fiche({ beer, others }: { beer: Beer; others: Beer[] }) {
  const ac = beer.accent;
  const og = num(beer.og), fg = num(beer.fg), ebc = num(beer.ebc), ibu = num(beer.ibu);
  const figs = ([
    beer.abv?.trim() ? { k: 'Alcool', v: abvTxt(beer.abv), u: `%${NB}vol` } : null,
    og !== undefined ? { k: 'Densité initiale', v: fr(og, 3, 3) } : null,
    fg !== undefined ? { k: 'Densité finale', v: fr(fg, 3, 3) } : null,
    beer.volume?.trim() ? { k: 'Volume', v: abvTxt(beer.volume), u: 'L' } : null,
    beer.bottledOn?.trim() ? { k: 'Mise en bouteille', v: beer.bottledOn } : null,
  ].filter(Boolean)) as Fig[];
  const hasGauges = ebc !== undefined || ibu !== undefined;
  const paras = (beer.description ?? '').split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean);
  const notes = (beer.notes ?? '').trim();
  const sub = [beer.styleName, beer.denomination, `brassin n°${NB}${beer.brew}`].filter(Boolean).join(' · ');

  let story: ReactNode = null;
  if (paras.length || notes) {
    story = (
      <section className="story" style={paras.length && notes ? undefined : ONE_COL}>
        {paras.length ? (
          <div>
            <div className="eyebrow">L’histoire du brassin</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{paras.map((p, i) => <p key={i}>{nbsp(p)}</p>)}</div>
          </div>
        ) : null}
        {notes ? (
          <blockquote style={{ '--c': ac } as CSSProperties}>
            <div className="eyebrow">Le mot du brasseur</div>
            <p>{`«${NB}${nbsp(notes)}${NB}»`}</p>
            <cite><img src="/assets/logo-brasse-yutz-noir.svg" alt="" style={{ height: 22, width: 'auto' }} />Nicolas</cite>
          </blockquote>
        ) : null}
      </section>
    );
  }

  return (
    <main className="page">
      <Back />
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
        <div style={{ width: 'min(100%,620px)', padding: '28px 20px', boxSizing: 'border-box', borderRadius: 'var(--radius-web-hero)', background: soft(ac) }}>
          <LabelThumb beer={beer} />
        </div>
        <h1 style={{ margin: '10px 0 0', font: '400 clamp(44px,7vw,64px)/.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
          {beer.name}{beer.edition ? <i style={{ color: ac }}> {beer.edition}</i> : null}
          {beer.favorite
            ? <span title="Coup de cœur" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: 12, color: ac }}><CuveeIcon name="Heart" size={28} stroke={2} /></span>
            : null}
        </h1>
        <div style={{ font: '400 17px var(--font-text)', color: 'var(--text-body)', width: '100%', textWrap: 'balance' }}>{sub}</div>
      </header>

      {story}

      {figs.length || hasGauges ? (
        <section className="spec">
          {figs.length ? (
            <div className="figs" style={{ '--n': figs.length } as CSSProperties}>
              {figs.map(f => (
                <div key={f.k} className="fig" data-fig={f.k === 'Mise en bouteille' ? 'bottling' : undefined}>
                  <span style={{ whiteSpace: 'nowrap' }}>{f.k}</span>
                  <b>{f.v}{f.u ? <small>{NB}{f.u}</small> : null}</b>
                </div>
              ))}
            </div>
          ) : null}
          {hasGauges ? (
            <div className="gauges" style={figs.length ? undefined : { borderTop: 0 }}>
              {ebc !== undefined ? <div className="gz"><div className="lbl">Couleur <b>{abvTxt(beer.ebc)}{NB}EBC</b></div><Gauge kind="ebc" value={ebc} showLabel={false} /></div> : null}
              {ibu !== undefined ? <div className="gz"><div className="lbl">Amertume <b>{abvTxt(beer.ibu)}{NB}IBU</b></div><Gauge kind="ibu" value={ibu} accent={ac} showLabel={false} /></div> : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <Recette beer={beer} />
      <Degustation beer={beer} />

      {others.length ? (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 className="h2">Les autres cuvées</h2>
          <div className="photo-grid">{others.map(o => <PhotoCard key={o.id} beer={o} />)}</div>
        </section>
      ) : null}
    </main>
  );
}
