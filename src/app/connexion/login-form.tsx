'use client';
import { useState } from 'react';
import { Button } from '@/components/ds/Button';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      location.href = '/admin';
      return;
    }
    const j = await res.json().catch(() => ({ error: 'Erreur inattendue.' }));
    setError(j.error || 'Erreur inattendue.');
    setBusy(false);
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: '600 11px var(--font-text)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--encre-2)' }}>Mot de passe</span>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus
          style={{ height: 42, padding: '0 12px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 15px var(--font-text)', color: 'var(--encre)', outline: 0, borderRadius: 0 }} />
      </label>
      <div><Button variant="primary" type="submit" disabled={busy}>Se connecter</Button></div>
      {error && <p style={{ margin: 0, font: '500 14px var(--font-text)', color: 'var(--danger)' }}>{error}</p>}
    </form>
  );
}
