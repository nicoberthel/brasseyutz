'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks() {
  const path = usePathname();
  const admin = path.startsWith('/admin');
  const item = (active: boolean) => ({
    color: 'var(--encre)',
    padding: '6px 0',
    borderBottom: `1px solid ${active ? 'var(--encre)' : 'transparent'}`,
  });
  return (
    <nav style={{ display: 'flex', gap: 24, font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      <Link href="/" style={item(!admin)}>Bières</Link>
      <Link href="/admin" style={item(admin)}>Backoffice</Link>
    </nav>
  );
}
