import React from 'react';
export function Badge({tone='outline',children,style}){
  const t={ink:['var(--encre)','var(--papier)','var(--encre)'],outline:['transparent','var(--encre)','var(--encre)'],muted:['var(--papier-2)','var(--encre-2)','transparent'],accent:['transparent','var(--accent)','var(--accent)']}[tone]||['transparent','var(--encre)','var(--encre)'];
  return <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:'3px 8px',background:t[0],color:t[1],border:`1px solid ${t[2]}`,font:'500 11px/1.3 var(--font-mono)',letterSpacing:'0.08em',textTransform:'uppercase',whiteSpace:'nowrap',...style}}>{children}</span>;
}
