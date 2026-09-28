import { clearCookieHeader } from '@/lib/session';

export async function POST(): Promise<Response> {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearCookieHeader() } });
}
