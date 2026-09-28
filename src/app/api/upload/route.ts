import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { uploadsDir } from '@/lib/db';
import { requireSession } from '@/lib/session';

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_SVG_BYTES = 1024 * 1024;

/* Assainissement SVG : retire scripts, handlers d'événements, liens javascript:
   et foreignObject. Défense en profondeur — le fichier est aussi servi avec
   une CSP sans script (voir src/app/uploads). */
function sanitizeSvg(src: string): string | null {
  if (!/<svg[\s>]/i.test(src)) return null;
  return src
    .replace(/<script[\s\S]*?(<\/script>|$)/gi, '')
    .replace(/<foreignObject[\s\S]*?(<\/foreignObject>|$)/gi, '')
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/((?:xlink:)?href\s*=\s*["']?)\s*javascript:[^"'\s>]*/gi, '$1#');
}

export async function POST(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const fd = await req.formData().catch(() => null);
  const file = fd?.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Aucun fichier reçu.' }, { status: 400 });

  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
  if (isSvg) {
    if (file.size > MAX_SVG_BYTES) return Response.json({ error: 'SVG trop lourd (1 Mo maximum).' }, { status: 413 });
    const clean = sanitizeSvg(await file.text());
    if (!clean) return Response.json({ error: 'SVG illisible.' }, { status: 415 });
    fs.mkdirSync(uploadsDir(), { recursive: true });
    const name = crypto.randomUUID() + '.svg';
    fs.writeFileSync(path.join(uploadsDir(), name), clean);
    return Response.json({ path: '/uploads/' + name });
  }

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
