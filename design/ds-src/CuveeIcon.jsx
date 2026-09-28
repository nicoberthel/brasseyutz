import React from 'react';
/* Rend une icône Lucide (window.lucide, CDN) en SVG React. Illustration « simple » de cuvée. */
export function CuveeIcon({name='Hop',size=24,color='currentColor',stroke=1.25,unit='px',src,style}){
  const s=size+unit;
  if(src) return <img src={src} alt="" style={{height:s,width:'auto',display:'block',...style}}/>;
  const node=typeof window!=='undefined'&&window.lucide&&window.lucide.icons&&window.lucide.icons[name];
  if(!node) return <span style={{display:'inline-block',width:s,height:s,border:'1px dashed var(--encre-3)',boxSizing:'border-box',...style}} title={'Icône '+name+' (charger lucide)'}></span>;
  const kids=node[2]||[];
  return <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{display:'block',...style}}>{kids.map(([t,a],i)=>React.createElement(t,{key:i,...a}))}</svg>;
}
