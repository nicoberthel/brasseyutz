'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks() {
  const path = usePathname();
  const home = !path.startsWith('/admin') && !path.startsWith('/connexion');
  return (
    <nav style={{ display: 'flex', gap: 24, font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      <Link href="/" style={{ color: 'var(--encre)', padding: '6px 0', borderBottom: `1px solid ${home ? 'var(--encre)' : 'transparent'}` }}>Bières</Link>
    </nav>
  );
}
