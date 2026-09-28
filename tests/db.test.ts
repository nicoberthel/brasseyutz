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
