import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadByBrew } from '@/app/fiche-data';
import { Fiche } from '@/app/fiche';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ brew: string }> };

function load(brew: string) {
  if (!/^\d+$/.test(brew)) return null;
  return loadByBrew(Number(brew));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brew } = await params;
  const data = load(brew);
  if (!data) return { title: 'Bière introuvable' };
  const b = data.beer;
  const title = `${b.name}${b.edition ? ' ' + b.edition : ''}`;
  const description = `${b.styleName} · Brassin N° ${b.brew} · recette et fiche de dégustation.`;
  return { title, description, openGraph: { title, description } };
}

export default async function Page({ params }: Props) {
  const { brew } = await params;
  const data = load(brew);
  if (!data) notFound();
  return <Fiche beer={data.beer} others={data.others} />;
}
