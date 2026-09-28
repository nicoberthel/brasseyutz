import { getDb } from '@/lib/db';
import { beers, type NewBeer } from '@/lib/schema';
import { validateBeer } from '@/lib/validate';
import { requireSession } from '@/lib/session';

export async function POST(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null) as { beers?: unknown[] } | null;
  if (!body || !Array.isArray(body.beers) || body.beers.length === 0)
    return Response.json({ error: 'Fichier d’import invalide : tableau « beers » attendu.' }, { status: 400 });
  const validated: NewBeer[] = [];
  const ids = new Set<string>(), brews = new Set<number>();
  for (let i = 0; i < body.beers.length; i++) {
    const v = validateBeer(body.beers[i]);
    if (!v.ok) return Response.json({ error: `Bière ${i + 1} : ${v.error}` }, { status: 400 });
    if (ids.has(v.beer.id) || brews.has(v.beer.brew))
      return Response.json({ error: `Bière ${i + 1} : identifiant ou n° de brassin en double.` }, { status: 400 });
    ids.add(v.beer.id);
    brews.add(v.beer.brew);
    validated.push(v.beer);
  }
  const db = getDb();
  const now = Date.now();
  db.transaction(tx => {
    tx.delete(beers).run();
    for (const b of validated) tx.insert(beers).values({ ...b, createdAt: now, updatedAt: now }).run();
  });
  return Response.json({ ok: true, count: validated.length });
}
