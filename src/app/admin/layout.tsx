import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasSession())) redirect('/connexion');
  return <>{children}</>;
}
