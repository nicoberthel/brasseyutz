import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { AdminApp } from './admin-app';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Backoffice' };

export default function AdminPage() {
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return <AdminApp initial={list} siteUrl={process.env.SITE_URL || 'https://www.brasseyutz.fr'} />;
}
