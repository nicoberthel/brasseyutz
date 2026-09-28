import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { uploadsDir } from '@/lib/db';
import { requireSession } from '@/lib/session';

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const fd = await req.formData().catch(() => null);
  const file = fd?.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Aucun fichier reçu.' }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: 'Image trop lourde (10 Mo maximum).' }, { status: 413 });
  const buf = Buffer.from(await file.arrayBuffer());
  let out: Buffer;
  try {
    out = await sharp(buf).rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch {
    return Response.json({ error: 'Image illisible.' }, { status: 415 });
  }
  fs.mkdirSync(uploadsDir(), { recursive: true });
  const name = crypto.randomUUID() + '.jpg';
  fs.writeFileSync(path.join(uploadsDir(), name), out);
  return Response.json({ path: '/uploads/' + name });
}
