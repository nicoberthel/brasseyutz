import React from 'react';
export function PictoSlot({src,label,size,u}){return src?<img src={src} alt={label} style={{height:u(size),width:'auto',display:'block',flex:'none'}}/>:<div title={label} style={{height:u(size),width:u(size),flex:'none',border:`${u(size*0.025)} dashed var(--encre-3)`,display:'grid',placeItems:'center',font:`500 ${u(size*0.14)}/1.1 var(--font-mono)`,color:'var(--encre-3)',textAlign:'center',boxSizing:'border-box',padding:u(size*0.05)}}>{label}</div>;}
/* Bloc légal : tableau aligné (DDM / Lot / Embouteillée, valeurs mono à droite) + responsable et pictogrammes. */
export function LegalMentions({lot,bestBefore,bottledOn,brewer='Brasse-Yutz',address='Yutz',pregnancySrc,trimanSrc,unit='px',homebrew=true,pictos=true,quiet=false,style}){
  const mm=unit==='mm';const fs=mm?2.4:12;const u=v=>v+unit;const line=`${mm?'0.15mm':'1px'} solid var(--filet)`;
  const tone=quiet?'var(--encre-2)':'var(--text-body)';const k={font:`400 ${u(fs)}/1.2 var(--font-text)`,color:tone,padding:`${u(fs*(quiet?0.08:0.22))} 0`,whiteSpace:'nowrap'};
  const v={font:`${quiet?400:500} ${u(fs)}/1.2 var(--font-mono)`,color:quiet?'var(--encre-2)':'var(--text-strong)',textAlign:'right',whiteSpace:'nowrap',padding:`${u(fs*(quiet?0.08:0.22))} 0`};
  const rows=[['À consommer de préférence avant fin',bestBefore],['Lot',lot],bottledOn&&['Embouteillée le',bottledOn]].filter(Boolean);
  return <div style={{display:'flex',flexDirection:'column',gap:u(fs*0.35),...style}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr auto',columnGap:u(fs)}}>{rows.map(([a,b],i)=><React.Fragment key={a}><span style={{...k,borderTop:i&&!quiet?line:'none'}}>{a}</span><span style={{...v,borderTop:i&&!quiet?line:'none'}}>{b}</span></React.Fragment>)}</div>
    <div style={{display:'flex',alignItems:'center',gap:u(fs*0.6),borderTop:line,paddingTop:u(fs*0.4)}}>
      <span style={{flex:1,minWidth:0,font:`400 ${u(fs)}/1.25 var(--font-text)`,color:tone,textWrap:'pretty'}}>{homebrew?'Bière maison · ':''}{brewer}, {address}</span>
      {pictos&&<><PictoSlot src={pregnancySrc} label="Zéro alcool pendant la grossesse" size={fs*2.9} u={u}/><PictoSlot src={trimanSrc} label="Info-tri Triman" size={fs*2.9} u={u}/></>}
    </div>
  </div>;
}
