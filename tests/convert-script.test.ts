import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const root = resolve(__dirname, '..');
const script = join(root, 'scripts', 'convert-export.mjs');
const input = join(root, 'brasseyutz-export.json');

type B = Record<string, any>;
let out: { exportedAt: string; convertedAt: string; beers: B[] };
let stderr = '';

describe('scripts/convert-export.mjs', () => {
  beforeAll(() => {
    const dest = join(mkdtempSync(join(tmpdir(), 'convert-')), 'out.json');
    const r = spawnSync(process.execPath, [script, input, dest], { encoding: 'utf8' });
    expect(r.status).toBe(0);
    stderr = r.stderr;
    out = JSON.parse(readFileSync(dest, 'utf8'));
  }, 60000);

  it('convertit les 29 bières', () => {
    expect(out.beers).toHaveLength(29);
    expect(out.convertedAt).toBeTruthy();
  });
  it('brassin 35 : 5 grains', () => {
    expect(out.beers[0].grains).toHaveLength(5);
  });
  it('Xmas 2025 : 4 lignes Épices', () => {
    const b = out.beers.find(x => x.id === 'xmas-2025')!;
    expect(b.hopSchedule.filter((h: B) => h.etape === 'Épices')).toHaveLength(4);
  });
  it('hoppy-birthday : recette vide -> null', () => {
    const b = out.beers.find(x => x.id === 'hoppy-birthday')!;
    expect([b.mash, b.grains, b.hopSchedule, b.ferment]).toEqual([null, null, null, null]);
  });
  it('radar null et famille renseignée partout', () => {
    for (const b of out.beers) {
      expect(b.radar).toBeNull();
      expect(b.famille).toBeTruthy();
    }
  });
  it('aucun avertissement sur stderr', () => {
    expect(stderr).toBe('');
  });
});
