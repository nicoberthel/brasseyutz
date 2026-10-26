#!/usr/bin/env node
// Convertit un ancien export JSON (recettes en texte) vers le nouveau format (recettes structurées).
// Usage : node scripts/convert-export.mjs [entrée.json] [sortie.json]
import { readFileSync, writeFileSync } from 'node:fs';

// package.json sans "type" : Node avertit en important un .ts. On ignore cet avertissement seul.
const emit = process.emitWarning;
process.emitWarning = (w, ...a) => {
  const code = typeof a[0] === 'object' && a[0] ? a[0].code : a[1];
  if (code === 'MODULE_TYPELESS_PACKAGE_JSON') return;
  return emit.call(process, w, ...a);
};
const { legacyToRecipe } = await import('../src/lib/recipe-legacy.ts');
process.emitWarning = emit;

const [inPath = 'brasseyutz-export.json', outPath = 'brasseyutz-import.json'] = process.argv.slice(2);
const src = JSON.parse(readFileSync(inPath, 'utf8'));
const beers = (src.beers || []).map(b => {
  const { grains, hopSchedule, mash, ferment, famille, serving } = legacyToRecipe(b);
  return { ...b, grains, hopSchedule, mash, ferment, famille, serving, radar: null };
});
const out = { exportedAt: src.exportedAt, convertedAt: new Date().toISOString(), beers };
writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`${beers.length} bières converties → ${outPath}`);
