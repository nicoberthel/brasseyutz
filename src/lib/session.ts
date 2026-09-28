import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'by_session';
const DAYS = 30;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET manquant ou trop court (32 caractères minimum).');
  return s;
}

export function sign(exp: number): string {
  const p = String(exp);
  const sig = crypto.createHmac('sha256', secret()).update(p).digest('base64url');
  return p + '.' + sig;
}

export function verify(token?: string): boolean {
  if (!token) return false;
  const i = token.lastIndexOf('.');
  if (i < 1) return false;
  const p = token.slice(0, i), sig = token.slice(i + 1);
  const good = crypto.createHmac('sha256', secret()).update(p).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(good);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(p) > Date.now();
}

export function sessionCookieHeader(): string {
  const exp = Date.now() + DAYS * 864e5;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${sign(exp)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${DAYS * 86400}${secure}`;
}

export function clearCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/* Pages serveur (contexte requête Next). */
export async function hasSession(): Promise<boolean> {
  const c = await cookies();
  return verify(c.get(SESSION_COOKIE)?.value);
}

/* Garde des API : lit l'en-tête cookie de la requête (testable hors contexte Next). */
export function requireSession(req: Request): Response | null {
  const raw = req.headers.get('cookie') || '';
  const token = raw.split(/;\s*/).find(p => p.startsWith(SESSION_COOKIE + '='))?.slice(SESSION_COOKIE.length + 1);
  if (verify(token)) return null;
  return Response.json({ error: 'Non autorisé.' }, { status: 401 });
}
