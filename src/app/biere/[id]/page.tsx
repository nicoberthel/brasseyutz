import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadById } from '@/app/fiche-data';
import { Fiche } from '@/app/fiche';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = loadById(id);
  if (!data) return { title: 'Bière introuvable' };
  const b = data.beer;
  const title = `${b.name}${b.edition ? ' ' + b.edition : ''}`;
  const description = `${b.styleName} · Brassin N° ${b.brew} · recette et fiche de dégustation.`;
  return { title, description, openGraph: { title, description } };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const data = loadById(id);
  if (!data) notFound();
  return <Fiche beer={data.beer} others={data.others} />;
}
