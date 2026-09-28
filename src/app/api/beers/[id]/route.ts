import { and, eq, ne } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { validateBeer } from '@/lib/validate';
import { requireSession } from '@/lib/session';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const db = getDb();
  const existing = db.select().from(beers).where(eq(beers.id, id)).get();
  if (!existing) return Response.json({ error: 'Bière introuvable.' }, { status: 404 });
  const body = await req.json().catch(() => null);
  const v = validateBeer(body, { id });
  if (!v.ok) return Response.json({ error: v.error }, { status: 400 });
  if (db.select().from(beers).where(and(eq(beers.brew, v.beer.brew), ne(beers.id, id))).get())
    return Response.json({ error: `Le brassin N° ${v.beer.brew} existe déjà.` }, { status: 409 });
  db.update(beers).set({ ...v.beer, id, createdAt: existing.createdAt, updatedAt: Date.now() }).where(eq(beers.id, id)).run();
  return Response.json(db.select().from(beers).where(eq(beers.id, id)).get());
}

export async function DELETE(req: Request, ctx: Ctx): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const db = getDb();
  if (!db.select().from(beers).where(eq(beers.id, id)).get())
    return Response.json({ error: 'Bière introuvable.' }, { status: 404 });
  db.delete(beers).where(eq(beers.id, id)).run();
  return Response.json({ ok: true });
}
