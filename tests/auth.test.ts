import { beforeEach, describe, expect, it } from 'vitest';
import { sign, verify } from '@/lib/session';
import { allowLogin, resetRateLimitForTests } from '@/lib/ratelimit';
import { POST as login } from '@/app/api/auth/login/route';

const req = (body: unknown, ip = '1.2.3.4') =>
  new Request('http://test/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

describe('session', () => {
  it('signe et vérifie', () => expect(verify(sign(Date.now() + 60000))).toBe(true));
  it('rejette token expiré', () => expect(verify(sign(Date.now() - 1))).toBe(false));
  it('rejette signature falsifiée', () => {
    const t = sign(Date.now() + 60000);
    expect(verify(t.slice(0, -2) + 'xx')).toBe(false);
    expect(verify('abc')).toBe(false);
    expect(verify(undefined)).toBe(false);
  });
});

describe('ratelimit', () => {
  beforeEach(resetRateLimitForTests);
  it('5 essais puis blocage, IP indépendantes', () => {
    for (let i = 0; i < 5; i++) expect(allowLogin('a')).toBe(true);
    expect(allowLogin('a')).toBe(false);
    expect(allowLogin('b')).toBe(true);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(resetRateLimitForTests);
  it('mot de passe correct → 200 + Set-Cookie', async () => {
    const res = await login(req({ password: 'test-password' }));
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toContain('by_session=');
  });
  it('mot de passe faux → 401', async () => {
    const res = await login(req({ password: 'nope' }));
    expect(res.status).toBe(401);
    const j = await res.json();
    expect(j.error).toBe('Mot de passe incorrect.');
  });
  it('6e essai → 429', async () => {
    for (let i = 0; i < 5; i++) await login(req({ password: 'nope' }, '9.9.9.9'));
    const res = await login(req({ password: 'test-password' }, '9.9.9.9'));
    expect(res.status).toBe(429);
  });
  it('body invalide → 401 sans crash', async () => {
    const res = await login(new Request('http://test', { method: 'POST', headers: { 'x-forwarded-for': 'z' }, body: '{' }));
    expect(res.status).toBe(401);
  });
});
