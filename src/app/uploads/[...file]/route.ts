import fs from 'node:fs';
import path from 'node:path';
import { uploadsDir } from '@/lib/db';

export async function GET(_req: Request, ctx: { params: Promise<{ file: string[] }> }): Promise<Response> {
  const { file } = await ctx.params;
  const base = uploadsDir();
  const p = path.normalize(path.join(base, ...file));
  if (!p.startsWith(base + path.sep) || !fs.existsSync(p) || !fs.statSync(p).isFile())
    return new Response('Introuvable', { status: 404 });
  return new Response(new Uint8Array(fs.readFileSync(p)), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
