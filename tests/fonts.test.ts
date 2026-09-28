import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const FONTS = [
  'instrument-serif-400.woff2',
  'instrument-serif-400-italic.woff2',
  'instrument-sans-variable.woff2',
  'ibm-plex-mono-400.woff2',
  'ibm-plex-mono-500.woff2',
  'ibm-plex-mono-600.woff2',
];

describe('polices auto-hébergées (aucun téléchargement au build)', () => {
  it('les fichiers woff2 sont dans le repo', () => {
    for (const f of FONTS) {
      const p = path.join(process.cwd(), 'src/fonts', f);
      expect(fs.existsSync(p), `${f} manquant`).toBe(true);
      expect(fs.statSync(p).size).toBeGreaterThan(1000);
    }
  });
  it('le layout utilise next/font/local, plus next/font/google', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
    expect(src).toContain("next/font/local");
    expect(src).not.toContain('next/font/google');
  });
});
