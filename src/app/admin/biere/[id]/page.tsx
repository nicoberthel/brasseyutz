import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { EditForm } from './edit-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Backoffice' };

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const all = db.select().from(beers).all();
  const nextBrew = Math.max(0, ...all.map(b => b.brew)) + 1;
  if (id === 'nouvelle') {
    return <EditForm beer={null} nextBrew={nextBrew} siteUrl={process.env.SITE_URL || 'https://www.brasseyutz.fr'} />;
  }
  const beer = all.find(b => b.id === id);
  if (!beer) notFound();
  return <EditForm beer={beer} nextBrew={nextBrew} siteUrl={process.env.SITE_URL || 'https://www.brasseyutz.fr'} />;
}
