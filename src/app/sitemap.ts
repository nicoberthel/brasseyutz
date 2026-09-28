import type { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.SITE_URL || 'https://www.brasseyutz.fr').replace(/\/$/, '');
  const list = getDb().select().from(beers).all();
  return [
    { url: site },
    { url: site + '/mentions-legales' },
    ...list.flatMap(b => [{ url: `${site}/biere/${b.id}` }, { url: `${site}/brassin/${b.brew}` }]),
  ];
}
