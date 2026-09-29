import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import { SignatureH } from '@/components/ds/Logo';
import { NavLinks } from './nav-links';
import './globals.css';

/* Polices embarquées dans le repo (src/fonts) : aucun téléchargement au build,
   rendu identique en dev, prod, CI et Docker. */
const brasseSerif = localFont({
  src: [
    { path: '../fonts/instrument-serif-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/instrument-serif-400-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--nf-serif',
});
const brasseSans = localFont({
  src: [{ path: '../fonts/instrument-sans-variable.woff2', weight: '400 700', style: 'normal' }],
  variable: '--nf-sans',
});
const brasseMono = localFont({
  src: [
    { path: '../fonts/ibm-plex-mono-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ibm-plex-mono-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/ibm-plex-mono-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--nf-mono',
});

export const metadata: Metadata = {
  title: { default: 'Brasse-Yutz · Bières maison', template: '%s · Brasse-Yutz' },
  description: 'Brasserie amateur à Yutz (Moselle). Recettes, chiffres et mentions de chaque brassin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${brasseSerif.variable} ${brasseSans.variable} ${brasseMono.variable}`}>
      <body>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '14px clamp(16px,4vw,48px)', background: 'var(--papier)', borderBottom: '1px solid var(--filet)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--encre)' }}>
            <SignatureH size={44} />
          </Link>
          <NavLinks />
        </header>
        {children}
        <footer style={{ padding: '28px clamp(16px,4vw,48px)', borderTop: '1px solid var(--filet)', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', font: '400 13px var(--font-text)', color: 'var(--encre-3)' }}>
          <span>Les Bières Maison de Brasse-Yutz · <Link href="/mentions-legales" style={{ color: 'var(--encre-3)', textDecoration: 'underline' }}>Mentions légales</Link> · <Link href="/admin" className="hov-ink" style={{ color: 'var(--encre-3)' }}>Backoffice</Link></span>
          <span>L’abus d’alcool est dangereux pour la santé, à consommer avec modération.</span>
        </footer>
      </body>
    </html>
  );
}
