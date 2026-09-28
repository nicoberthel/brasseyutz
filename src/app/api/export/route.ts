import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { requireSession } from '@/lib/session';

export async function GET(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return Response.json({ exportedAt: new Date().toISOString(), beers: list }, {
    headers: { 'Content-Disposition': 'attachment; filename="brasseyutz-export.json"' },
  });
}
