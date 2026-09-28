'use client';
import React, { type CSSProperties, type ReactNode } from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  type?: 'button' | 'submit';
}

export function Button({ variant = 'primary', size = 'md', icon, children, disabled, onClick, style, ...rest }: ButtonProps) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const sz = { sm: { padding: '6px 12px', fontSize: 12 }, md: { padding: '10px 18px', fontSize: 13 }, lg: { padding: '14px 26px', fontSize: 15 } }[size];
  const v: CSSProperties = {
    primary: { background: h ? 'var(--encre-2)' : 'var(--encre)', color: 'var(--papier)', border: '1px solid var(--encre)' },
    outline: { background: h ? 'var(--encre)' : 'transparent', color: h ? 'var(--papier)' : 'var(--encre)', border: '1px solid var(--encre)' },
    ghost: { background: 'transparent', color: 'var(--encre)', border: '1px solid transparent', textDecoration: h ? 'underline' : 'none', textUnderlineOffset: 4 },
    accent: { background: h ? 'var(--encre)' : 'var(--accent)', color: 'var(--papier)', border: '1px solid transparent' },
  }[variant] as CSSProperties;
  return <button disabled={disabled} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }} onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-text)', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: 0, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.35 : 1, transform: p ? 'translateY(1px)' : 'none', transition: 'background var(--dur-fast),color var(--dur-fast)', whiteSpace: 'nowrap', ...sz, ...v, ...style }} {...rest}>{icon}{children}</button>;
}
