import qrcode from 'qrcode-generator';
import { Hop } from 'lucide-react';

export function brewUrl(siteUrl: string, brew: number | string): string {
  return siteUrl.replace(/\/$/, '') + '/brassin/' + brew;
}

function matrix(url: string, level: 'M' | 'H') {
  const q = qrcode(0, level);
  q.addData(url);
  q.make();
  return q;
}

function modulesPath(q: ReturnType<typeof qrcode>, m: number, skip?: (r: number, c: number) => boolean): string {
  const n = q.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (q.isDark(r, c) && !(skip && skip(r, c))) d += `M${c + m} ${r + m}h1v1h-1z`;
  return d;
}

export function qrSvgString(url: string): string {
  const q = matrix(url, 'M');
  const n = q.getModuleCount(), m = 2;
  const d = modulesPath(q, m);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n + 2 * m} ${n + 2 * m}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#161616"/></svg>`;
}

export function QrSvg({ url }: { url: string }) {
  const q = matrix(url, 'M');
  const n = q.getModuleCount(), m = 2;
  return (
    <svg viewBox={`0 0 ${n + 2 * m} ${n + 2 * m}`} width="100%" height="100%" shapeRendering="crispEdges" style={{ display: 'block' }}>
      <path d={modulesPath(q, m)} fill="var(--encre)" />
    </svg>
  );
}

/* Port de qrDesign du prototype : niveau H, trou central pour l'icône, œils redessinés.
   L'icône houblon est superposée en HTML (lucide-react). */
export function QrStyled({ url, accent }: { url: string; accent: string }) {
  const q = matrix(url, 'H');
  const n = q.getModuleCount(), m = 0.6, S = n + 2 * m;
  const inFinder = (r: number, c: number) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const hole = Math.round(n * 0.26) | 1, h0 = (n - hole) / 2;
  const inHole = (r: number, c: number) => r >= h0 - 0.5 && r < h0 + hole && c >= h0 - 0.5 && c < h0 + hole;
  const d = modulesPath(q, m, (r, c) => inFinder(r, c) || inHole(r, c));
  const eye = (x: number, y: number, k: string) => [
    <rect key={k + 'o'} x={x + 0.5} y={y + 0.5} width={6} height={6} fill="none" stroke={accent} strokeWidth={1} />,
    <rect key={k + 'i'} x={x + 2} y={y + 2} width={3} height={3} fill="var(--encre)" />,
  ];
  const iconPct = ((hole - 1) / S) * 100;
  return (
    <div style={{ position: 'relative', height: '100%', aspectRatio: '1' }}>
      <svg viewBox={`0 0 ${S} ${S}`} shapeRendering="crispEdges" style={{ display: 'block', height: '100%', width: '100%' }}>
        <path d={d} fill="var(--encre)" />
        {eye(m, m, 'a')}{eye(m + n - 7, m, 'b')}{eye(m, m + n - 7, 'c')}
      </svg>
      <Hop aria-hidden color={accent} strokeWidth={2.2}
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: iconPct + '%', height: iconPct + '%' }} />
    </div>
  );
}
