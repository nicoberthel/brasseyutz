import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('globals.css', () => {
  it('les 4 nouvelles couleurs de cuvée existent (contraste ≥ 3:1 sur blanc)', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    for (const v of ['--cuvee-rouge', '--cuvee-ciel', '--cuvee-acide', '--cuvee-jaune'])
      expect(css, v + ' absent').toContain(v);
  });
  it('les champs de formulaire ont un indicateur de focus (WCAG 2.4.7)', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const rule = css.split('}').find(r => r.includes(':focus') && r.includes('input'));
    expect(rule, 'règle input:focus absente de globals.css').toBeTruthy();
    expect(rule).toContain('textarea:focus');
    expect(rule).toContain('select:focus');
    expect(rule).toContain('border-color:var(--encre)');
  });
});
