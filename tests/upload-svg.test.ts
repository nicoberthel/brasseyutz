import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { POST as upload } from '@/app/api/upload/route';
import { GET as serveUpload } from '@/app/uploads/[...file]/route';
import { uploadsDir } from '@/lib/db';
import { sign, SESSION_COOKIE } from '@/lib/session';

const cookie = () => `${SESSION_COOKIE}=${sign(Date.now() + 60000)}`;
function svgReq(body: string, name = 'art.svg') {
  const fd = new FormData();
  fd.set('file', new File([body], name, { type: 'image/svg+xml' }));
  return new Request('http://test/api/upload', { method: 'POST', headers: { cookie: cookie() }, body: fd });
}

describe('upload SVG (illustration perso)', () => {
  it('SVG valide → stocké en .svg', async () => {
    const res = await upload(svgReq('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 2h20v20H2z"/></svg>'));
    expect(res.status).toBe(200);
    const { path: p } = await res.json();
    expect(p).toMatch(/^\/uploads\/[0-9a-f-]+\.svg$/);
    expect(fs.readFileSync(path.join(uploadsDir(), path.basename(p)), 'utf8')).toContain('<path');
  });
  it('scripts et handlers retirés du fichier écrit', async () => {
    const dirty = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script><path d="M0 0h1" onclick="x()"/><a href="javascript:evil()"><rect/></a></svg>';
    const res = await upload(svgReq(dirty));
    expect(res.status).toBe(200);
    const { path: p } = await res.json();
    const saved = fs.readFileSync(path.join(uploadsDir(), path.basename(p)), 'utf8');
    expect(saved).not.toMatch(/<script/i);
    expect(saved).not.toMatch(/onload|onclick/i);
    expect(saved).not.toMatch(/javascript:/i);
    expect(saved).toContain('<path');
  });
  it('fichier .svg sans balise svg → 415', async () => {
    expect((await upload(svgReq('pas du svg'))).status).toBe(415);
  });
  it('servi en image/svg+xml avec CSP sans script', async () => {
    const up = await upload(svgReq('<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'));
    const name = path.basename((await up.json()).path);
    const res = await serveUpload(new Request('http://test'), { params: Promise.resolve({ file: [name] }) });
    expect(res.headers.get('content-type')).toBe('image/svg+xml');
    expect(res.headers.get('content-security-policy')).toContain("script-src 'none'");
  });
});
