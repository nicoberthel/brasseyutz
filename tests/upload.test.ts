import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { POST as upload } from '@/app/api/upload/route';
import { GET as serveUpload } from '@/app/uploads/[...file]/route';
import { uploadsDir } from '@/lib/db';
import { sign, SESSION_COOKIE } from '@/lib/session';

const cookie = () => `${SESSION_COOKIE}=${sign(Date.now() + 60000)}`;
async function makeReq(bytes: Uint8Array, name = 'photo.png', type = 'image/png') {
  const fd = new FormData();
  fd.set('file', new File([bytes], name, { type }));
  return new Request('http://test/api/upload', { method: 'POST', headers: { cookie: cookie() }, body: fd });
}
const png = () => sharp({ create: { width: 2000, height: 1000, channels: 3, background: '#336699' } }).png().toBuffer();

describe('POST /api/upload', () => {
  it('sans session → 401', async () => {
    const fd = new FormData();
    fd.set('file', new File([new Uint8Array([1])], 'x.png'));
    const res = await upload(new Request('http://test', { method: 'POST', body: fd }));
    expect(res.status).toBe(401);
  });
  it('image valide → jpg ≤ 1600 px écrit dans uploads', async () => {
    const res = await upload(await makeReq(new Uint8Array(await png())));
    expect(res.status).toBe(200);
    const { path: p } = await res.json();
    expect(p).toMatch(/^\/uploads\/[0-9a-f-]+\.jpg$/);
    const file = path.join(uploadsDir(), path.basename(p));
    const meta = await sharp(file).metadata();
    expect(meta.width).toBe(1600);
    expect(meta.format).toBe('jpeg');
  });
  it('non-image → 415, rien d’écrit', async () => {
    fs.mkdirSync(uploadsDir(), { recursive: true });
    const before = fs.readdirSync(uploadsDir()).length;
    const res = await upload(await makeReq(new TextEncoder().encode('pas une image'), 'x.txt', 'text/plain'));
    expect(res.status).toBe(415);
    expect((await res.json()).error).toBe('Image illisible.');
    expect(fs.readdirSync(uploadsDir()).length).toBe(before);
  });
  it('> 10 Mo → 413, rien d’écrit', async () => {
    fs.mkdirSync(uploadsDir(), { recursive: true });
    const before = fs.readdirSync(uploadsDir()).length;
    const res = await upload(await makeReq(new Uint8Array(11 * 1024 * 1024)));
    expect(res.status).toBe(413);
    expect(fs.readdirSync(uploadsDir()).length).toBe(before);
  });
});

describe('GET /uploads/…', () => {
  it('sert le fichier, bloque la traversée', async () => {
    const up = await upload(await makeReq(new Uint8Array(await png())));
    const name = path.basename((await up.json()).path);
    const ok = await serveUpload(new Request('http://test'), { params: Promise.resolve({ file: [name] }) });
    expect(ok.status).toBe(200);
    expect(ok.headers.get('content-type')).toBe('image/jpeg');
    const evil = await serveUpload(new Request('http://test'), { params: Promise.resolve({ file: ['..', 'brasseyutz.sqlite'] }) });
    expect(evil.status).toBe(404);
  });
});
