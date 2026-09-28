import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { Catalogue } from './catalogue';

export const dynamic = 'force-dynamic';

export default function Home() {
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return <Catalogue beers={list} />;
}
