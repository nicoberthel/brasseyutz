import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { AdminList } from './admin-list';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Backoffice' };

export default function AdminPage() {
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return <AdminList beers={list} />;
}
