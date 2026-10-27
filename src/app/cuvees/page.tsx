import { desc } from 'drizzle-orm';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { Cuvees } from './cuvees';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Cuvées' };

export default async function CuveesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  const query = (Array.isArray(q) ? q[0] : q) ?? '';
  return <Cuvees key={query} beers={list} initialQuery={query} />;
}
