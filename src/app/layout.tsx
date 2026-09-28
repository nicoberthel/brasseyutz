import type { Metadata } from 'next';
import { Instrument_Serif, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import Link from 'next/link';
import { Signature } from '@/components/ds/Logo';
import { NavLinks } from './nav-links';
import './globals.css';

const serif = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--nf-serif' });
const sans = Instrument_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--nf-sans' });
const mono = IBM_Plex_Mono({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--nf-mono' });

export const metadata: Metadata = {
  title: { default: 'Brasse-Yutz · Bières maison', template: '%s · Brasse-Yutz' },
  description: 'Brasserie amateur à Yutz (Moselle). Recettes, chiffres et mentions de chaque brassin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '14px clamp(16px,4vw,48px)', background: 'var(--papier)', borderBottom: '1px solid var(--filet)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--encre)' }}>
            <Signature size={40} />
          </Link>
          <NavLinks />
        </header>
        {children}
        <footer style={{ padding: '28px clamp(16px,4vw,48px)', borderTop: '1px solid var(--filet)', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', font: '400 13px var(--font-text)', color: 'var(--encre-3)' }}>
          <span>Bière maison · Brasse-Yutz, Yutz · <Link href="/mentions-legales" style={{ color: 'var(--encre-3)', textDecoration: 'underline' }}>Mentions légales</Link></span>
          <span>L’abus d’alcool est dangereux pour la santé, à consommer avec modération.</span>
        </footer>
      </body>
    </html>
  );
}
