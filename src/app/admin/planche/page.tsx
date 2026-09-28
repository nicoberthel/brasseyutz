import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { PlancheApp } from './planche-app';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Planche A4' };

export default async function PlanchePage({ searchParams }: { searchParams: Promise<{ biere?: string }> }) {
  const { biere } = await searchParams;
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return <PlancheApp beers={list} siteUrl={process.env.SITE_URL || 'https://www.brasseyutz.fr'} defaultBeerId={biere} />;
}
