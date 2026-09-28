import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/session';
import { LoginForm } from './login-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Connexion' };

export default async function Connexion() {
  if (await hasSession()) redirect('/admin');
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,48px) 96px' }}>
      <div style={{ font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>Backoffice</div>
      <h1 style={{ margin: '8px 0 24px', font: '400 clamp(44px,6vw,72px)/0.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
        Se <i style={{ color: 'var(--accent)' }}>connecter</i>
      </h1>
      <LoginForm />
    </main>
  );
}
