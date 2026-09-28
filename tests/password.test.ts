import { describe, expect, it } from 'vitest';
import bcrypt from 'bcryptjs';
import { hashPassword, verifyPassword } from '@/lib/password';
import { POST as login } from '@/app/api/auth/login/route';
import { resetRateLimitForTests } from '@/lib/ratelimit';

const req = (password: string, ip: string) =>
  new Request('http://test/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify({ password }),
  });

describe('password (format scrypt sans $, sûr dans les .env)', () => {
  it('hashPassword produit scrypt:sel:hash sans aucun $', () => {
    const h = hashPassword('mon-mot-de-passe');
    expect(h).toMatch(/^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/);
    expect(h).not.toContain('$');
  });
  it('verifyPassword accepte le bon mot de passe, rejette le mauvais', async () => {
    const h = hashPassword('bon');
    expect(await verifyPassword('bon', h)).toBe(true);
    expect(await verifyPassword('mauvais', h)).toBe(false);
  });
  it('compat bcrypt : les anciens hashs $2b$ restent valides', async () => {
    const h = bcrypt.hashSync('legacy', 4);
    expect(await verifyPassword('legacy', h)).toBe(true);
    expect(await verifyPassword('autre', h)).toBe(false);
  });
  it('hash inconnu ou vide → refus sans crash', async () => {
    expect(await verifyPassword('x', 'nimporte-quoi')).toBe(false);
    expect(await verifyPassword('x', '')).toBe(false);
  });
  it('login fonctionne avec un hash scrypt dans ADMIN_PASSWORD_HASH', async () => {
    resetRateLimitForTests();
    const old = process.env.ADMIN_PASSWORD_HASH;
    process.env.ADMIN_PASSWORD_HASH = hashPassword('scrypt-pass');
    try {
      const ok = await login(req('scrypt-pass', '7.7.7.7'));
      expect(ok.status).toBe(200);
      const ko = await login(req('faux', '7.7.7.8'));
      expect(ko.status).toBe(401);
    } finally {
      process.env.ADMIN_PASSWORD_HASH = old;
    }
  });
});
