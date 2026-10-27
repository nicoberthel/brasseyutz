import { RADAR_AXES, fr, type Radar as RadarValues } from '@/lib/recipe';

/* Spider chart 8 axes (0–5), aire en couleur de cuvée — port de ui_kits/site/Radar.jsx. */
export function Radar({ values, accent, size = 340 }: { values: RadarValues; accent: string; size?: number }) {
  const axes = RADAR_AXES;
  const c = size / 2, R = size / 2 - 64, n = axes.length;
  const pt = (i: number, v: number): [number, number] => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    return [c + Math.cos(a) * R * v / 5, c + Math.sin(a) * R * v / 5];
  };
  const poly = (v: readonly number[]) => v.map((x, i) => pt(i, x).join(',')).join(' ');
  const label = 'Profil : ' + axes.map((a, i) => `${a} ${fr(values[i], 1)}/5`).join(', ');
  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}
      style={{ width: '100%', maxWidth: size, height: 'auto', display: 'block', overflow: 'visible' }}>
      {[1, 2, 3, 4, 5].map(l => (
        <polygon key={l} data-radar-grid points={poly(Array(n).fill(l))} fill="none" stroke="var(--filet)" strokeWidth={l === 5 ? 1.4 : 1} />
      ))}
      {axes.map((_, i) => { const [x, y] = pt(i, 5); return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="var(--filet)" />; })}
      <polygon data-radar-area points={poly(values)} fill={accent} fillOpacity=".2" stroke={accent} strokeWidth="2.4" strokeLinejoin="round" />
      {values.map((v, i) => { const [x, y] = pt(i, v); return <circle key={i} data-radar-point cx={x} cy={y} r="4" fill="var(--papier)" stroke={accent} strokeWidth="2.4" />; })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 6.05);
        const anc = Math.abs(x - c) < 4 ? 'middle' : x > c ? 'start' : 'end';
        return (
          <text key={a} x={x} y={y} textAnchor={anc} dominantBaseline="middle" style={{ font: '500 12.5px var(--font-text)', fill: 'var(--text-body)' }}>
            {a}<tspan x={x} dy="15" style={{ font: '500 11.5px var(--font-mono)', fill: 'var(--encre)' }}>{fr(values[i], 1)}/5</tspan>
          </text>
        );
      })}
    </svg>
  );
}
