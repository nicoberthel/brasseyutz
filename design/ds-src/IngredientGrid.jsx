import React from 'react';
import { CuveeIcon } from './CuveeIcon.jsx';
const fmt=t=>String(t||'').split(/(\*[^*]+\*)/g).map((p,i)=>p.startsWith('*')?<b key={i} style={{fontWeight:700,textTransform:'uppercase',letterSpacing:'0.02em',color:'var(--text-strong)'}}>{p.slice(1,-1)}</b>:p);
const ROWS=[['malts','Wheat','Malts'],['hops','Hop','Houblons'],['yeast','FlaskConical','Levure'],['other','Droplets','Autres']];
/* Grille d'ingrédients : icône (Malts, Houblons, Levure, Autres) + liste. Allergènes entre *astérisques*. */
export function IngredientGrid({malts,hops,yeast,other,unit='px',accent='var(--accent)',rowPadding,inset=0,style}){
  const mm=unit==='mm';const u=v=>v+unit;const fs=mm?2.4:14;const ic=mm?3.6:20;const vals={malts,hops,yeast,other};
  const rows=ROWS.filter(r=>vals[r[0]]);
  return <div style={{display:'grid',gridTemplateColumns:`${u(ic+inset)} 1fr`,...style}}>
    {rows.map(([key,icon,label],i)=>{const bt=i?`${mm?'0.15mm':'1px'} solid var(--filet)`:'none';const pad=`${u(rowPadding??(mm?1.3:8))} 0`;return <React.Fragment key={key}>
      <span title={label} aria-label={label} style={{padding:pad,paddingLeft:u(inset),borderTop:bt,display:'flex',alignItems:'flex-start'}}><CuveeIcon name={icon} size={ic} unit={unit} color={accent} stroke={1.5}/></span>
      <span style={{font:`400 ${u(fs)}/1.28 var(--font-text)`,color:'var(--text-body)',padding:pad,paddingLeft:u(mm?2.4:14),paddingRight:u(inset),borderTop:bt,textWrap:'pretty'}}>{fmt(vals[key])}</span>
    </React.Fragment>;})}
  </div>;
}
