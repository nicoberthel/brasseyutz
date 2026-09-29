import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { SEED } from './seed';

/* Spec unique des colonnes : sert au CREATE TABLE et à la migration
   (toute colonne absente d'une base existante est ajoutée avec son défaut). */
const COLUMNS: [name: string, ddl: string][] = [
  ['id', 'TEXT PRIMARY KEY'],
  ['name', 'TEXT NOT NULL'],
  ['edition', "TEXT NOT NULL DEFAULT ''"],
  ['styleName', 'TEXT NOT NULL'],
  ['denomination', "TEXT NOT NULL DEFAULT ''"],
  ['brew', 'INTEGER NOT NULL UNIQUE'],
  ['abv', 'TEXT NOT NULL'],
  ['ebc', "TEXT NOT NULL DEFAULT ''"],
  ['ibu', "TEXT NOT NULL DEFAULT ''"],
  ['bottle', "TEXT NOT NULL DEFAULT '75cl'"],
  ['accent', "TEXT NOT NULL DEFAULT 'var(--cuvee-orange)'"],
  ['icon', "TEXT NOT NULL DEFAULT 'Hop'"],
  ['malts', "TEXT NOT NULL DEFAULT ''"],
  ['hops', "TEXT NOT NULL DEFAULT ''"],
  ['yeast', "TEXT NOT NULL DEFAULT ''"],
  ['other', "TEXT NOT NULL DEFAULT ''"],
  ['bottledOn', "TEXT NOT NULL DEFAULT ''"],
  ['bestBefore', "TEXT NOT NULL DEFAULT ''"],
  ['lot', "TEXT NOT NULL DEFAULT ''"],
  ['volume', "TEXT NOT NULL DEFAULT ''"],
  ['og', "TEXT NOT NULL DEFAULT ''"],
  ['fg', "TEXT NOT NULL DEFAULT ''"],
  ['grains', "TEXT NOT NULL DEFAULT ''"],
  ['hopSchedule', "TEXT NOT NULL DEFAULT ''"],
  ['mash', "TEXT NOT NULL DEFAULT ''"],
  ['ferment', "TEXT NOT NULL DEFAULT ''"],
  ['notes', "TEXT NOT NULL DEFAULT ''"],
  ['look', "TEXT NOT NULL DEFAULT ''"],
  ['nose', "TEXT NOT NULL DEFAULT ''"],
  ['mouth', "TEXT NOT NULL DEFAULT ''"],
  ['finish', "TEXT NOT NULL DEFAULT ''"],
  ['serving', "TEXT NOT NULL DEFAULT ''"],
  ['description', "TEXT NOT NULL DEFAULT ''"],
  ['labelImage', "TEXT NOT NULL DEFAULT ''"],
  ['artwork', "TEXT NOT NULL DEFAULT ''"],
  ['favorite', 'INTEGER NOT NULL DEFAULT 0'],
  ['createdAt', 'INTEGER NOT NULL DEFAULT 0'],
  ['updatedAt', 'INTEGER NOT NULL DEFAULT 0'],
];

const CREATE_SQL = `CREATE TABLE IF NOT EXISTS beers (${COLUMNS.map(([n, d]) => `${n} ${d}`).join(', ')})`;

let _db: ReturnType<typeof create> | null = null;

export function dataDir(): string {
  return process.env.DATA_DIR || path.join(process.cwd(), 'data');
}

export function uploadsDir(): string {
  return path.join(dataDir(), 'uploads');
}

function migrate(sqlite: Database.Database) {
  const existing = new Set((sqlite.pragma('table_info(beers)') as { name: string }[]).map(c => c.name));
  for (const [name, ddl] of COLUMNS) {
    if (existing.has(name)) continue;
    // ALTER ADD n'accepte ni PRIMARY KEY ni UNIQUE ; ces colonnes existent depuis la v1.
    const safe = ddl.replace(' PRIMARY KEY', '').replace(' UNIQUE', '');
    sqlite.exec(`ALTER TABLE beers ADD COLUMN ${name} ${safe}`);
  }
}

function create() {
  fs.mkdirSync(uploadsDir(), { recursive: true });
  const sqlite = new Database(path.join(dataDir(), 'brasseyutz.sqlite'));
  sqlite.pragma('journal_mode = WAL');
  sqlite.exec(CREATE_SQL);
  migrate(sqlite);
  const db = drizzle(sqlite, { schema });
  const count = sqlite.prepare('SELECT COUNT(*) AS n FROM beers').get() as { n: number };
  if (count.n === 0) {
    const now = Date.now();
    for (const b of SEED) db.insert(schema.beers).values({ ...b, createdAt: now, updatedAt: now }).run();
  }
  return db;
}

export function getDb() {
  if (!_db) _db = create();
  return _db;
}

export function resetDbForTests() {
  _db = null;
}
