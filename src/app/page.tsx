import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { Home } from './home';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return <Home beers={list} />;
}
