import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { validateBeer } from '@/lib/validate';
import { requireSession } from '@/lib/session';

export async function GET(): Promise<Response> {
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return Response.json(list);
}

export async function POST(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const v = validateBeer(body);
  if (!v.ok) return Response.json({ error: v.error }, { status: 400 });
  const db = getDb();
  if (db.select().from(beers).where(eq(beers.id, v.beer.id)).get())
    return Response.json({ error: 'Une bière avec cet identifiant existe déjà.' }, { status: 409 });
  if (db.select().from(beers).where(eq(beers.brew, v.beer.brew)).get())
    return Response.json({ error: `Le brassin N° ${v.beer.brew} existe déjà.` }, { status: 409 });
  const now = Date.now();
  db.insert(beers).values({ ...v.beer, createdAt: now, updatedAt: now }).run();
  const created = db.select().from(beers).where(eq(beers.id, v.beer.id)).get();
  return Response.json(created, { status: 201 });
}
