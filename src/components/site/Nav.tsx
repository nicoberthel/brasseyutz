'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { SignatureH } from '@/components/ds/Logo';
import { useNarrow } from './useNarrow';

const NAV = [
  { href: '/', label: 'Accueil', icon: 'House' },
  { href: '/cuvees', label: 'Cuvées', icon: 'Beer' },
] as const;

const isPrivate = (p: string) => p.startsWith('/admin') || p.startsWith('/connexion');

function isActive(href: string, p: string) {
  if (isPrivate(p)) return false;
  if (href === '/') return p === '/';
  return p === '/cuvees' || p.startsWith('/cuvees/') || p.startsWith('/biere/') || p.startsWith('/brassin/');
}

/** Signature horizontale de l'en-tête : 52 px, 44 px sous 760 px (version simple du logo dans les deux cas). */
export function HeaderSignature() {
  const narrow = useNarrow();
  return <SignatureH size={narrow ? 44 : 52} />;
}

export function TopNav() {
  const p = usePathname() ?? '/';
  return (
    <nav style={{ display: 'flex', gap: 6 }}>
      {NAV.map(n => {
        const on = isActive(n.href, p);
        return <Link key={n.href} href={n.href} className={'navlink' + (on ? ' on' : '')} aria-current={on ? 'page' : undefined}>{n.label}</Link>;
      })}
    </nav>
  );
}

export function BottomNav() {
  const p = usePathname() ?? '/';
  if (isPrivate(p)) return null;
  return (
    <nav className="bottom" aria-label="Navigation principale">
      {NAV.map(n => {
        const on = isActive(n.href, p);
        return (
          <Link key={n.href} href={n.href} aria-current={on ? 'page' : undefined} style={{ color: on ? 'var(--accent)' : 'var(--encre)' }}>
            <CuveeIcon name={n.icon} size={24} stroke={on ? 2.2 : 1.6} />
            <span>{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const p = usePathname() ?? '/';
  if (isPrivate(p)) return <>{children}</>;
  return <div className="shell">{children}</div>;
}
