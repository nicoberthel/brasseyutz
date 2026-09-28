import bcrypt from 'bcryptjs';
import { allowLogin } from '@/lib/ratelimit';
import { sessionCookieHeader } from '@/lib/session';

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!allowLogin(ip)) return Response.json({ error: 'Trop d’essais, réessayez dans 15 minutes.' }, { status: 429 });
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return Response.json({ error: 'ADMIN_PASSWORD_HASH non configuré.' }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!password || !(await bcrypt.compare(password, hash)))
    return Response.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': sessionCookieHeader() } });
}
