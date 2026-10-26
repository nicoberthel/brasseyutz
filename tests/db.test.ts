import { describe, expect, it } from 'vitest';
import { desc } from 'drizzle-orm';

describe('db', () => {
  it('seed 6 bières si base vide, idempotent', async () => {
    const { getDb, resetDbForTests } = await import('@/lib/db');
    const { beers } = await import('@/lib/schema');
    const db = getDb();
    const all = db.select().from(beers).all();
    expect(all).toHaveLength(6);
    resetDbForTests();
    expect(getDb().select().from(beers).all()).toHaveLength(6); // même DATA_DIR → pas de re-seed
  });

  it('seed : contenu attendu', async () => {
    const { getDb } = await import('@/lib/db');
    const { beers } = await import('@/lib/schema');
    const all = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
    expect(all[0].name).toBe('Dark Mode');
    expect(all[0].brew).toBe(34);
    const hop = all.find(b => b.id === 'hop-overflow')!;
    expect(hop.lot).toBe('L2605-33');
    expect(hop.description).toContain('brassin 33');
    expect(hop.look).toContain('Jaune paille');
    const paul = all.find(b => b.id === 'paul')!;
    expect(paul.edition).toBe('Eph 5:18');
  });

  it('brew unique', async () => {
    const { getDb } = await import('@/lib/db');
    const { beers } = await import('@/lib/schema');
    const db = getDb();
    expect(() => db.insert(beers).values({ id: 'dup', name: 'Dup', styleName: 'Pils', brew: 34, abv: '5' }).run()).toThrow();
  });
});

describe('migration artwork', () => {
  it('ajoute la colonne artwork à une base existante qui ne l’a pas', async () => {
    const path = await import('node:path');
    const Database = (await import('better-sqlite3')).default;
    const { dataDir, getDb, resetDbForTests } = await import('@/lib/db');
    // simule une base créée avant la colonne artwork
    const old = new Database(path.join(dataDir(), 'brasseyutz.sqlite'));
    old.exec("CREATE TABLE beers (id TEXT PRIMARY KEY, name TEXT NOT NULL, styleName TEXT NOT NULL, brew INTEGER NOT NULL UNIQUE, abv TEXT NOT NULL)");
    old.prepare("INSERT INTO beers (id, name, styleName, brew, abv) VALUES ('x', 'X', 'Pils', 1, '5')").run();
    old.close();
    resetDbForTests();
    const { beers } = await import('@/lib/schema');
    const db = getDb();
    const row = db.select().from(beers).all().find(b => b.id === 'x')!;
    expect(row.artwork).toBe('');
  });
});

const V1_COLUMNS = `id TEXT PRIMARY KEY, name TEXT NOT NULL, edition TEXT NOT NULL DEFAULT '', styleName TEXT NOT NULL,
  denomination TEXT NOT NULL DEFAULT '', brew INTEGER NOT NULL UNIQUE, abv TEXT NOT NULL, ebc TEXT NOT NULL DEFAULT '',
  ibu TEXT NOT NULL DEFAULT '', bottle TEXT NOT NULL DEFAULT '75cl', accent TEXT NOT NULL DEFAULT 'var(--cuvee-orange)',
  icon TEXT NOT NULL DEFAULT 'Hop', malts TEXT NOT NULL DEFAULT '', hops TEXT NOT NULL DEFAULT '', yeast TEXT NOT NULL DEFAULT '',
  other TEXT NOT NULL DEFAULT '', bottledOn TEXT NOT NULL DEFAULT '', bestBefore TEXT NOT NULL DEFAULT '', lot TEXT NOT NULL DEFAULT '',
  volume TEXT NOT NULL DEFAULT '', og TEXT NOT NULL DEFAULT '', fg TEXT NOT NULL DEFAULT '', grains TEXT NOT NULL DEFAULT '',
  hopSchedule TEXT NOT NULL DEFAULT '', mash TEXT NOT NULL DEFAULT '', ferment TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
  look TEXT NOT NULL DEFAULT '', nose TEXT NOT NULL DEFAULT '', mouth TEXT NOT NULL DEFAULT '', finish TEXT NOT NULL DEFAULT '',
  serving TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '', labelImage TEXT NOT NULL DEFAULT '',
  artwork TEXT NOT NULL DEFAULT '', favorite INTEGER NOT NULL DEFAULT 0, createdAt INTEGER NOT NULL DEFAULT 0,
  updatedAt INTEGER NOT NULL DEFAULT 0`;

/* Xmas 2025 telle qu’exportée de l’ancien site (brasseyutz-export.json). */
const XMAS_2025 = {
  id: 'xmas-2025', name: 'Xmas', edition: '2025', styleName: 'Bière de Noël', brew: 32, abv: '5,5',
  yeast: 'S-33', other: 'Eau, sucre, orange, clou de girofle, gingembre, cannelle', serving: '8°C.',
  grains: 'Pale Ale | 3,5 kg\nMunich | 2 kg\nCaraMunich II | 0,5 kg\nChocolat | 0,3 kg\nCaraBelge | 0,2 kg',
  hopSchedule: 'Centennial | 15 g | 60 min | Ébullition\nMosaic | 5 g | 60 min | Ébullition\nCentennial | 20 g | 20 min | Hopstand\nMosaic | 10 g | 20 min | Hopstand\nGingembre | 15 g | 10 min | Hopstand\nClous de girofle | 5 | 5 min | Hopstand\nCannelle | 1 bâton | 5 min | Hopstand\nÉcorce d\'orange | 15 g | 5 min | Hopstand',
  mash: 'Empâtage | 65 °C | 60 min | 25,5 L\nMash-out | 78 °C | 10 min\nRinçage | 80 °C | 11 L',
  ferment: '20 °C | 14 jours\n4 °C | 3 jours | Cold Crush',
};

describe('recette JSON : colonnes famille/radar et migration', () => {
  it('ajoute famille et radar à une base existante', async () => {
    const path = await import('node:path');
    const Database = (await import('better-sqlite3')).default;
    const { dataDir, getDb, resetDbForTests } = await import('@/lib/db');
    const old = new Database(path.join(dataDir(), 'brasseyutz.sqlite'));
    old.exec(`CREATE TABLE beers (${V1_COLUMNS})`);
    old.prepare("INSERT INTO beers (id, name, styleName, brew, abv) VALUES ('x', 'X', 'Pils', 1, '5')").run();
    old.close();
    resetDbForTests();
    const { beers } = await import('@/lib/schema');
    const row = getDb().select().from(beers).all().find(b => b.id === 'x')!;
    expect(row.radar).toBe('');
    expect(row.famille).toBe('blonde');
  });

  it('migration : base v1 avec grains/hopSchedule/mash/ferment en texte « | » → JSON valide et famille déduite, user_version = 2, second démarrage sans changement', async () => {
    const path = await import('node:path');
    const Database = (await import('better-sqlite3')).default;
    const { dataDir, getDb, resetDbForTests } = await import('@/lib/db');
    const { legacyToRecipe } = await import('@/lib/recipe-legacy');
    const { parseGrains, parseHops, parseMash, parseFerment } = await import('@/lib/recipe');
    const file = path.join(dataDir(), 'brasseyutz.sqlite');
    const old = new Database(file);
    old.exec(`CREATE TABLE beers (${V1_COLUMNS})`);
    const cols = Object.keys(XMAS_2025);
    old.prepare(`INSERT INTO beers (${cols.join(', ')}) VALUES (${cols.map(c => '@' + c).join(', ')})`).run(XMAS_2025);
    // ligne dont grains est déjà en JSON : cette colonne ne doit pas bouger
    old.prepare("INSERT INTO beers (id, name, styleName, brew, abv, grains, hopSchedule) VALUES ('j', 'J', 'Pils', 2, '5', ?, ?)")
      .run('[{"nom": "Pilsner", "kg": 4}]', 'Saaz | 30 g | 60 min');
    old.close();
    resetDbForTests();

    const { beers } = await import('@/lib/schema');
    const all = getDb().select().from(beers).all();
    expect(all).toHaveLength(2); // aucune ligne perdue, pas de seed
    const x = all.find(b => b.id === 'xmas-2025')!;
    const expected = legacyToRecipe(XMAS_2025);
    expect(JSON.parse(x.grains)).toEqual(expected.grains);
    expect(JSON.parse(x.hopSchedule)).toEqual(expected.hopSchedule);
    expect(JSON.parse(x.mash)).toEqual(expected.mash);
    expect(JSON.parse(x.ferment)).toEqual(expected.ferment);
    expect(parseGrains(x.grains)![0]).toEqual({ nom: 'Pale Ale', kg: 3.5 });
    expect(parseHops(x.hopSchedule)!.filter(h => h.etape === 'Épices')).toHaveLength(4);
    expect(parseMash(x.mash)!.eau).toBe('25,5 L');
    expect(parseFerment(x.ferment)!.paliers[1]).toEqual({ temp: 4, duree: '3 j', label: 'Cold crash' });
    expect(x.famille).toBe('brune');
    expect(x.serving).toBe('8 °C');
    const j = all.find(b => b.id === 'j')!;
    expect(j.grains).toBe('[{"nom": "Pilsner", "kg": 4}]');
    expect(parseHops(j.hopSchedule)).toEqual([{ etape: 'Ébullition', nom: 'Saaz', qte: '30 g', detail: '60 min' }]);
    expect(j.famille).toBe('blonde');

    const raw = () => {
      const c = new Database(file);
      const r = { rows: c.prepare('SELECT * FROM beers ORDER BY id').all(), v: c.pragma('user_version', { simple: true }) };
      c.close();
      return r;
    };
    const first = raw();
    expect(first.v).toBe(2);
    resetDbForTests();
    getDb();
    expect(raw()).toEqual(first);
  });

  it('la déduction de famille ne tourne qu’une fois (choix « — » conservé)', async () => {
    const { getDb, resetDbForTests } = await import('@/lib/db');
    const { beers } = await import('@/lib/schema');
    const { eq } = await import('drizzle-orm');
    getDb().update(beers).set({ famille: '' }).where(eq(beers.id, 'paul')).run();
    resetDbForTests();
    expect(getDb().select().from(beers).where(eq(beers.id, 'paul')).get()!.famille).toBe('');
  });

  it('seed : grains JSON parseable, famille renseignée', async () => {
    const path = await import('node:path');
    const Database = (await import('better-sqlite3')).default;
    const { dataDir, getDb } = await import('@/lib/db');
    const { beers } = await import('@/lib/schema');
    const { parseGrains, parseHops, parseMash, parseFerment, isLegacyText } = await import('@/lib/recipe');
    const all = getDb().select().from(beers).all();
    for (const b of all) {
      expect(parseGrains(b.grains)!.length).toBeGreaterThan(0);
      expect(parseHops(b.hopSchedule)!.length).toBeGreaterThan(0);
      expect(parseMash(b.mash)!.paliers.length).toBeGreaterThan(0);
      expect(parseFerment(b.ferment)!.paliers.length).toBeGreaterThan(0);
      for (const k of ['grains', 'hopSchedule', 'mash', 'ferment'] as const) expect(isLegacyText(b[k])).toBe(false);
      expect(b.radar).toBe('');
      expect(b.serving.endsWith('.')).toBe(false);
    }
    expect(Object.fromEntries(all.map(b => [b.id, b.famille]))).toEqual({
      'dark-mode': 'brune', 'hop-overflow': 'houblonnee', 'xmas-2025': 'brune',
      paul: 'belge', 'pils-electrique': 'blonde', 'citra-xtra': 'houblonnee',
    });
    const hop = all.find(b => b.id === 'hop-overflow')!;
    const h = parseHops(hop.hopSchedule)!;
    expect(new Set(h.map(l => l.etape))).toEqual(new Set(['Ébullition', 'Hopstand', 'Dry hop']));
    expect(h.filter(l => l.etape === 'Hopstand').map(l => l.detail)).toEqual(['20 min à 80 °C', '20 min à 80 °C']);
    expect(parseMash(hop.mash)).toEqual({
      eau: '', rincage: '', ebullitionMin: 60, note: '',
      paliers: [{ temp: 67, min: 60, label: 'Saccharification' }, { temp: 78, min: 10, label: 'Mash-out' }],
    });
    expect(parseFerment(hop.ferment)).toEqual({
      ensemencement: '1 sachet · Verdant IPA', refermentation: 'Sucre · 2 sem. à 20 °C',
      paliers: [{ temp: 19, duree: '10 j', label: 'Fermentation principale' }, { temp: 2, duree: '2 j', label: 'Cold crash' }],
    });
    const xmas = all.find(b => b.id === 'xmas-2025')!;
    expect(parseHops(xmas.hopSchedule)).toContainEqual(
      { etape: 'Épices', nom: 'Zeste d’orange, girofle, gingembre, cannelle', qte: '', detail: '5 min' });
    expect(all.find(b => b.id === 'dark-mode')!.serving).toBe('8–10 °C, verre à pied');
    const c = new Database(path.join(dataDir(), 'brasseyutz.sqlite'));
    expect(c.pragma('user_version', { simple: true })).toBe(2);
    c.close();
  });
});
