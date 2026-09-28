import { desc, eq, ne } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers, type Beer } from '@/lib/schema';

export type FicheData = { beer: Beer; others: Beer[] };

function withOthers(beer: Beer | undefined): FicheData | null {
  if (!beer) return null;
  const others = getDb().select().from(beers).where(ne(beers.id, beer.id)).orderBy(desc(beers.brew)).limit(3).all();
  return { beer, others };
}

export function loadById(id: string): FicheData | null {
  return withOthers(getDb().select().from(beers).where(eq(beers.id, id)).get());
}

export function loadByBrew(brew: number): FicheData | null {
  return withOthers(getDb().select().from(beers).where(eq(beers.brew, brew)).get());
}
