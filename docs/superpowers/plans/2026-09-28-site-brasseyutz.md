# Site brasseyutz.fr — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site public + backoffice Brasse-Yutz : catalogue de bières, fiche recette cible des QR codes imprimés, admin CRUD avec aperçu d'étiquette et planche A4 imprimable.

**Architecture:** Une seule app Next.js (App Router, TypeScript) rendue serveur pour le public, API route handlers pour le backoffice, SQLite (better-sqlite3 + Drizzle) sur volume `/data`, composants du design system portés depuis `design/ds-src/`. Un conteneur Docker.

**Tech Stack:** Next.js 15 · React 19 · TypeScript · better-sqlite3 + drizzle-orm · bcryptjs · sharp · qrcode-generator · lucide-react · Vitest + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-09-28-brasseyutz-site-design.md`

## Global Constraints

- Node ≥ 22. Aucune dépendance hors de la liste du Task 1.
- Tout le texte visible est en **français**, ton artisan : pas de point d'exclamation, pas d'emoji, virgule décimale (« 5,5 % vol. »), espace avant les unités.
- Design : radius 0 partout, transitions 120 ms max, fond `var(--papier-ecran)`, aucune ombre hors `--shadow-print`/`--shadow-lift`.
- Les fichiers tokens (`tokens/*.css` recopiés dans `src/app/globals.css`) ne se modifient pas ; seules les valeurs `--font-*` sont redéfinies vers `next/font`.
- Polices via `next/font/google` uniquement — **jamais** de `<link>` vers fonts.googleapis.com (CNIL).
- URL des QR : `SITE_URL` (défaut `https://www.brasseyutz.fr`) + `/brassin/<n°>`.
- La maquette de référence est `design/Brasse-Yutz Recettes.dc.html` (« le design ») ; les sources composants sont `design/ds-src/*.jsx`. Fidélité visuelle exigée.
- Règles de conversion design → Next.js (valables dans toutes les tâches) :

| Design (dc.html) | Port Next.js |
|---|---|
| `<sc-if value="{{ x }}">…</sc-if>` | `{x && <>…</>}` |
| `<sc-for list="{{ xs }}" as="x">…</sc-for>` | `{xs.map(x => …)}` (avec `key`) |
| `{{ expr }}` | `{expr}` |
| `<x-import component-from-global-scope="…​.Button" variant="outline">` | `import { Button } from '@/components/ds/Button'` puis `<Button variant="outline">` |
| `style="a:b"` | `style={{a:'b'}}` (camelCase) |
| `style-hover="…"` | classe CSS de `globals.css` (`.hov-ink`, `.hov-border`, `.hov-under`) |
| `onChange="{{ f }}"` / `value="{{ v }}"` | `onChange={f}` / `value={v}` (inputs contrôlés) |
| `href="#/biere/x"` / `#/admin` / `#/planche` / `#/` | `/biere/x` / `/admin` / `/admin/planche` / `/` via `next/link` |
| `window.lucide.icons[name]` | map statique `lucide-react` (voir `CuveeIcon`, Task 4) |
| `assets/…` (chemins relatifs) | `/assets/…` (depuis `public/`) |

## Review Focus

Modes de défaillance impliqués par la spec, chacun épinglé par un test dans la tâche propriétaire :

1. Nom d'un seul mot (« Paul ») → `splitName` renvoie une 2e partie vide ; carte, fiche et étiquette rendent sans `<i>` vide ni crash — tests Task 2 (`splitName`) et Task 4 (rendu `BeerLabel` un mot).
2. `/brassin/abc` ou n° inconnu scanné depuis une vieille bouteille → 404 stylée « Bière introuvable », jamais 500 — test Task 11.
3. Upload d'un fichier non-image ou > 10 Mo → 415/413 propre, aucun fichier écrit dans `/data/uploads` — tests Task 8.
4. Création d'un brassin avec un n° déjà pris → 409 avec message clair (un QR imprimé = une URL unique) — test Task 7.
5. Import d'un JSON malformé ou incomplet → 400 et base **inchangée** — test Task 9.

---

## File Structure

```
package.json / tsconfig.json / next.config.ts / vitest.config.ts / .env.example
Dockerfile / docker-compose.yml / README.md
scripts/hash-password.mjs
public/assets/{logo-brasse-yutz.svg, legal/zero-alcool-grossesse-gris.svg, legal/triman-gris.png}   ← copiés de design/
src/app/layout.tsx            en-tête (Signature + nav), footer, polices next/font
src/app/globals.css           tokens (copie colors/typography/spacing/base) + overrides app + classes hover + print
src/app/page.tsx              catalogue (serveur) → src/app/catalogue.tsx (client, recherche)
src/app/fiche.tsx             rendu fiche partagé (serveur) + FicheIntrouvable
src/app/biere/[id]/page.tsx   + not-found.tsx
src/app/brassin/[brew]/page.tsx + not-found.tsx
src/app/connexion/page.tsx    → login-form.tsx (client)
src/app/admin/page.tsx        garde session → admin-app.tsx (client)
src/app/admin/planche/page.tsx → planche-app.tsx (client)
src/app/mentions-legales/page.tsx
src/app/sitemap.ts / src/app/robots.ts
src/app/api/health/route.ts
src/app/api/auth/login/route.ts / logout/route.ts
src/app/api/beers/route.ts / [id]/route.ts
src/app/api/upload/route.ts
src/app/api/export/route.ts / import/route.ts
src/app/uploads/[...file]/route.ts   sert /data/uploads
src/components/ds/{Button,Badge,BeerCard,BeerLabel,CuveeIcon,Gauge,IngredientGrid,LegalMentions,Logo}.tsx
src/lib/domain.ts   num/norm/slug/splitName/rows/lotFor/matches
src/lib/label.ts    labelProps(beer, scale, opts)
src/lib/validate.ts validateBeer
src/lib/schema.ts   table Drizzle `beers` + type Beer
src/lib/db.ts       singleton, CREATE TABLE IF NOT EXISTS, seed
src/lib/seed.ts     les 6 bières réelles
src/lib/session.ts  sign/verify/hasSession/setSession/clearSession/requireSession
src/lib/ratelimit.ts
src/lib/qr.tsx      qrSvgString / QrSvg / QrStyled
tests/…             miroir par domaine
```

---

### Task 1: Scaffold Next.js + tokens + layout

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `tests/setup.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/nav-links.tsx`, `src/app/api/health/route.ts`, `src/app/page.tsx` (provisoire)
- Create: `public/assets/…` (copies), `.env.example`
- Modify: `.gitignore`

**Interfaces:**
- Produces: layout global (header Signature + nav, footer), variables CSS tokens, alias `@/* → src/*`, `npm test` (vitest) et `npm run build` fonctionnels. `GET /api/health` → `{ok:true}`.

- [ ] **Step 1: package.json + configs**

`package.json` :
```json
{
  "name": "brasseyutz",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "better-sqlite3": "^12.2.0",
    "drizzle-orm": "^0.44.2",
    "lucide-react": "^0.544.0",
    "next": "^15.5.0",
    "qrcode-generator": "^1.5.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "sharp": "^0.34.2"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@types/better-sqlite3": "^7.6.12",
    "@types/node": "^22.15.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "@vitejs/plugin-react": "^5.0.0",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.0",
    "vitest": "^3.2.0"
  }
}
```

`tsconfig.json` :
```json
{
  "compilerOptions": {
    "target": "ES2022", "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true, "skipLibCheck": true, "strict": true,
    "noEmit": true, "esModuleInterop": true, "module": "esnext",
    "moduleResolution": "bundler", "resolveJsonModule": true,
    "isolatedModules": true, "jsx": "preserve", "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "design"]
}
```

`next.config.ts` :
```ts
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['better-sqlite3', 'sharp'],
};
export default nextConfig;
```

`vitest.config.ts` :
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  test: { environment: 'node', setupFiles: ['tests/setup.ts'] },
});
```
(Les tests de composants mettent `// @vitest-environment jsdom` en tête de fichier.)

`tests/setup.ts` :
```ts
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { beforeEach } from 'vitest';

process.env.SESSION_SECRET = 'test-secret-0123456789abcdef-0123456789abcdef';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('test-password', 4);
process.env.SITE_URL = 'https://www.brasseyutz.fr';

beforeEach(async () => {
  process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'by-test-'));
  const db = await import('@/lib/db').catch(() => null);
  db?.resetDbForTests?.();
});
```
(`resetDbForTests` n'existe qu'à partir du Task 3 — l'optional chaining couvre l'intervalle.)

`.env.example` :
```
# Obligatoire en production
SESSION_SECRET=changez-moi-32-caracteres-minimum-aleatoires
ADMIN_PASSWORD_HASH=$2b$12$remplacez-par-la-sortie-de-scripts/hash-password.mjs
# Optionnel
SITE_URL=https://www.brasseyutz.fr
DATA_DIR=./data
CONTACT_EMAIL=
HOST_NAME=
HOST_ADDRESS=
HOST_PHONE=
```

`.gitignore` : ajouter `next-env.d.ts`, `.env*.local`, `tsconfig.tsbuildinfo`.

Run: `npm install`

- [ ] **Step 2: assets + globals.css**

Copier :
```bash
mkdir -p public/assets/legal
cp design/assets/logo-brasse-yutz.svg public/assets/
cp design/assets/legal/zero-alcool-grossesse-gris.svg public/assets/legal/
cp design/assets/legal/triman-gris.png public/assets/legal/
```

`src/app/globals.css` — dans cet ordre :
1. Contenu intégral de `design/_ds/brasserie-de-basse-yutz-design-system-49af69b0-4944-46d0-bdbf-ee863827b4a0/tokens/colors.css`
2. Contenu de `tokens/typography.css` **puis** override polices :
```css
:root{
--font-display:var(--nf-serif),Georgia,serif;
--font-text:var(--nf-sans),'Helvetica Neue',Arial,sans-serif;
--font-mono:var(--nf-mono),ui-monospace,Menlo,monospace;
}
```
3. Contenu de `tokens/spacing.css`
4. Règles app (reprend `tokens/base.css` + styles inline du design, lignes 20-26 du dc.html) :
```css
*,*::before,*::after{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;background:var(--papier-ecran)}
body{min-height:100vh;font-family:var(--font-text);color:var(--text-body)}
a{color:var(--encre);text-decoration:none}
a:hover{color:var(--encre-2)}
input,textarea,select,button{font-family:inherit}
.hov-border{transition:border-color 120ms}
.hov-border:hover{border-color:var(--encre)!important}
.hov-ink:hover{color:var(--encre)!important}
.hov-under:hover{text-decoration:underline}
.hov-bottom:hover{border-bottom-color:var(--encre)!important}
@media print{@page{size:A4 landscape;margin:0}html,body{background:#fff!important}header,footer,[data-noprint]{display:none!important}[data-sheet-wrap]{padding:0!important;max-width:none!important}[data-sheet]{zoom:1!important;box-shadow:none!important}}
```

- [ ] **Step 3: layout + nav + health + page provisoire**

`src/app/layout.tsx` :
```tsx
import type { Metadata } from 'next';
import { Instrument_Serif, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import Link from 'next/link';
import { Signature } from '@/components/ds/Logo';
import { NavLinks } from './nav-links';
import './globals.css';

const serif = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--nf-serif' });
const sans = Instrument_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--nf-sans' });
const mono = IBM_Plex_Mono({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--nf-mono' });

export const metadata: Metadata = {
  title: { default: 'Brasse-Yutz · Bières maison', template: '%s · Brasse-Yutz' },
  description: 'Brasserie amateur à Yutz (Moselle). Recettes, chiffres et mentions de chaque brassin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '14px clamp(16px,4vw,48px)', background: 'var(--papier)', borderBottom: '1px solid var(--filet)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--encre)' }}>
            <Signature size={40} />
          </Link>
          <NavLinks />
        </header>
        {children}
        <footer style={{ padding: '28px clamp(16px,4vw,48px)', borderTop: '1px solid var(--filet)', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', font: '400 13px var(--font-text)', color: 'var(--encre-3)' }}>
          <span>Bière maison · Brasse-Yutz, Yutz · <Link href="/mentions-legales" style={{ color: 'var(--encre-3)', textDecoration: 'underline' }}>Mentions légales</Link></span>
          <span>L’abus d’alcool est dangereux pour la santé, à consommer avec modération.</span>
        </footer>
      </body>
    </html>
  );
}
```
NOTE : `Signature` n'existe qu'au Task 4. Pour que ce task compile seul, créer dès maintenant `src/components/ds/Logo.tsx` en copiant `design/ds-src/Logo.jsx` tel quel renommé `.tsx` avec en tête `/* eslint-disable */` et types relâchés — le Task 4 le retypera proprement. Concrètement : copier le fichier, remplacer la signature de chaque export par `(props: any)` destructuré identique.

`src/app/nav-links.tsx` :
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks() {
  const path = usePathname();
  const admin = path.startsWith('/admin');
  const item = (active: boolean) => ({
    color: 'var(--encre)', padding: '6px 0',
    borderBottom: `1px solid ${active ? 'var(--encre)' : 'transparent'}`,
  });
  return (
    <nav style={{ display: 'flex', gap: 24, font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      <Link href="/" style={item(!admin)}>Bières</Link>
      <Link href="/admin" style={item(admin)}>Backoffice</Link>
    </nav>
  );
}
```

`src/app/api/health/route.ts` :
```ts
export function GET() {
  return Response.json({ ok: true });
}
```

`src/app/page.tsx` provisoire :
```tsx
export default function Home() {
  return <main style={{ padding: 48 }}>Catalogue à venir</main>;
}
```

- [ ] **Step 4: vérifier build + test harness**

Run: `npm run build`
Expected: build OK (standalone).
Run: `npx vitest run`
Expected: « No test files found » (code 0 avec `--passWithNoTests` ; ajouter ce flag au script `test`).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: scaffold Next.js, tokens, layout, health"
```

---

### Task 2: Domaine — utilitaires purs

**Files:**
- Create: `src/lib/domain.ts`
- Test: `tests/domain.test.ts`

**Interfaces:**
- Produces:
  - `num(v: unknown): number | undefined` — parse « 5,5 » → 5.5
  - `norm(s: unknown): string` — minuscules sans accents
  - `slug(s: string): string` — `'Pils Électrique' → 'pils-electrique'`, fallback `'biere'`
  - `splitName(b: {name?: string; edition?: string}): [string, string]` — édition prioritaire sinon coupe au milieu
  - `rows(t: unknown): {a: string; b: string; c: string}[]` — lignes `a | b | c…`
  - `lotFor(b: {bottledOn?: string; brew?: number | string}): string` — `'L2605-33'` sinon `'L—'`
  - `matches(b: BeerLike, query: string): boolean` — tous les termes, sans accents
  - `abvTxt(abv: unknown): string` — point → virgule

- [ ] **Step 1: Write the failing tests**

`tests/domain.test.ts` :
```ts
import { describe, expect, it } from 'vitest';
import { num, norm, slug, splitName, rows, lotFor, matches, abvTxt } from '@/lib/domain';

describe('num', () => {
  it('parse la virgule décimale', () => expect(num('5,5')).toBe(5.5));
  it('parse le point', () => expect(num('8.2')).toBe(8.2));
  it('undefined si vide ou invalide', () => {
    expect(num('')).toBeUndefined();
    expect(num('abc')).toBeUndefined();
    expect(num(undefined)).toBeUndefined();
  });
});

describe('norm / slug', () => {
  it('retire les accents', () => expect(norm('Pils Électrique')).toBe('pils electrique'));
  it('slug', () => expect(slug('Pils Électrique')).toBe('pils-electrique'));
  it('slug avec édition', () => expect(slug('Paul Eph 5:18')).toBe('paul-eph-5-18'));
  it('slug vide → biere', () => expect(slug('  ')).toBe('biere'));
});

describe('splitName', () => {
  it('édition prioritaire', () =>
    expect(splitName({ name: 'Xmas', edition: '2025' })).toEqual(['Xmas', '2025']));
  it('coupe au milieu', () =>
    expect(splitName({ name: 'Hop Overflow' })).toEqual(['Hop', 'Overflow']));
  it('un seul mot → seconde partie vide', () =>
    expect(splitName({ name: 'Paul' })).toEqual(['Paul', '']));
});

describe('rows', () => {
  it('découpe a | b | c', () =>
    expect(rows('Citra | 50 g | dry hop J3')).toEqual([{ a: 'Citra', b: '50 g', c: 'dry hop J3' }]));
  it('colonnes surnuméraires jointes par ·', () =>
    expect(rows('X | 1 | a | b')[0].c).toBe('a · b'));
  it('ignore lignes vides', () => expect(rows('\n\nA | 1\n')).toHaveLength(1));
  it('colonnes manquantes vides', () => expect(rows('Seul')).toEqual([{ a: 'Seul', b: '', c: '' }]));
});

describe('lotFor', () => {
  it('L + AA + MM + brassin', () =>
    expect(lotFor({ bottledOn: '07/05/2026', brew: 33 })).toBe('L2605-33'));
  it('date invalide → L—', () => expect(lotFor({ bottledOn: 'bientôt', brew: 33 })).toBe('L—'));
});

describe('matches', () => {
  const b = { name: 'Pils Électrique', edition: '', styleName: 'Pils', denomination: 'Bière lager', malts: 'Pilsner', hops: 'Mosaïc', yeast: 'Diamond', other: 'Eau', brew: 30, lot: 'L2504-30' };
  it('sans accents', () => expect(matches(b, 'electrique')).toBe(true));
  it('multi-termes ET', () => {
    expect(matches(b, 'pils mosaic')).toBe(true);
    expect(matches(b, 'pils citra')).toBe(false);
  });
  it('par numéro', () => expect(matches(b, 'n° 30')).toBe(true));
  it('vide → tout passe', () => expect(matches(b, '  ')).toBe(true));
});

describe('abvTxt', () => it('8.2 → 8,2', () => expect(abvTxt('8.2')).toBe('8,2')));
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/domain.test.ts`
Expected: FAIL — module `@/lib/domain` introuvable.

- [ ] **Step 3: Implement**

`src/lib/domain.ts` :
```ts
export function num(v: unknown): number | undefined {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return isNaN(n) ? undefined : n;
}

export function norm(s: unknown): string {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function slug(s: string): string {
  return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'biere';
}

export function splitName(b: { name?: string; edition?: string }): [string, string] {
  if (b.edition) return [b.name || '', b.edition];
  const w = String(b.name || '').split(' ');
  const k = Math.ceil(w.length / 2);
  return [w.slice(0, k).join(' '), w.slice(k).join(' ')];
}

export function rows(t: unknown): { a: string; b: string; c: string }[] {
  return String(t || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const p = l.split('|').map(s => s.trim());
    return { a: p[0] || '', b: p[1] || '', c: p.slice(2).join(' · ') };
  });
}

export function lotFor(b: { bottledOn?: string; brew?: number | string }): string {
  const m = String(b.bottledOn || '').match(/(\d{2})\/(\d{2})\/\d{2}(\d{2})/);
  return m ? 'L' + m[3] + m[2] + '-' + b.brew : 'L—';
}

export interface BeerLike {
  name?: string; edition?: string; styleName?: string; denomination?: string;
  malts?: string; hops?: string; yeast?: string; other?: string;
  brew?: number | string; lot?: string;
}

export function matches(b: BeerLike, query: string): boolean {
  const q = norm(query).trim();
  if (!q) return true;
  const hay = norm([b.name, b.edition, b.styleName, b.denomination, b.malts, b.hops, b.yeast, b.other, 'n° ' + b.brew, b.brew, b.lot].join(' '));
  return q.split(/\s+/).every(t => hay.includes(t));
}

export function abvTxt(abv: unknown): string {
  return String(abv ?? '').replace('.', ',');
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/domain.test.ts`
Expected: PASS (tous).

- [ ] **Step 5: Commit**

```bash
git add src/lib/domain.ts tests/domain.test.ts
git commit -m "feat: utilitaires domaine (slug, lot, recherche, parsing recette)"
```

---

### Task 3: Base de données — schéma, client, seed

**Files:**
- Create: `src/lib/schema.ts`, `src/lib/db.ts`, `src/lib/seed.ts`
- Test: `tests/db.test.ts`

**Interfaces:**
- Consumes: `slug`, `lotFor` (Task 2).
- Produces:
  - `schema.ts` : `beers` (table Drizzle), `type Beer = typeof beers.$inferSelect`, `type NewBeer = typeof beers.$inferInsert`
  - `db.ts` : `getDb()` (singleton, crée table + seed si vide), `dataDir(): string`, `uploadsDir(): string`, `resetDbForTests()`
  - `seed.ts` : `SEED: NewBeer[]` (6 bières)

- [ ] **Step 1: Write the failing tests**

`tests/db.test.ts` :
```ts
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
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/db.test.ts`
Expected: FAIL — modules introuvables.

- [ ] **Step 3: Implement**

`src/lib/schema.ts` :
```ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const beers = sqliteTable('beers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  edition: text('edition').notNull().default(''),
  styleName: text('styleName').notNull(),
  denomination: text('denomination').notNull().default(''),
  brew: integer('brew').notNull().unique(),
  abv: text('abv').notNull(),
  ebc: text('ebc').notNull().default(''),
  ibu: text('ibu').notNull().default(''),
  bottle: text('bottle').notNull().default('75cl'),
  accent: text('accent').notNull().default('var(--cuvee-orange)'),
  icon: text('icon').notNull().default('Hop'),
  malts: text('malts').notNull().default(''),
  hops: text('hops').notNull().default(''),
  yeast: text('yeast').notNull().default(''),
  other: text('other').notNull().default(''),
  bottledOn: text('bottledOn').notNull().default(''),
  bestBefore: text('bestBefore').notNull().default(''),
  lot: text('lot').notNull().default(''),
  volume: text('volume').notNull().default(''),
  og: text('og').notNull().default(''),
  fg: text('fg').notNull().default(''),
  grains: text('grains').notNull().default(''),
  hopSchedule: text('hopSchedule').notNull().default(''),
  mash: text('mash').notNull().default(''),
  ferment: text('ferment').notNull().default(''),
  notes: text('notes').notNull().default(''),
  look: text('look').notNull().default(''),
  nose: text('nose').notNull().default(''),
  mouth: text('mouth').notNull().default(''),
  finish: text('finish').notNull().default(''),
  serving: text('serving').notNull().default(''),
  description: text('description').notNull().default(''),
  labelImage: text('labelImage').notNull().default(''),
  createdAt: integer('createdAt').notNull().default(0),
  updatedAt: integer('updatedAt').notNull().default(0),
});

export type Beer = typeof beers.$inferSelect;
export type NewBeer = typeof beers.$inferInsert;
```

`src/lib/seed.ts` — recopier les 6 objets bières du design (`design/Brasse-Yutz Recettes.dc.html`, lignes 407-435) : les entrées du tableau retourné par `seed()` (lignes 417-434) fusionnées avec le bloc `T` de dégustation (lignes 408-414) et la `description` de Hop Overflow (ligne 415), exactement comme le fait `seed()` du prototype (`{ ...b, ...(T[b.id] || {}) }`). Adapter chaque objet au type `NewBeer` :
- garder tels quels : `id`, `name`, `edition` (sinon `''`), `styleName`, `denomination` (sinon `''`), `brew` (number), `abv`, `ebc`, `ibu`, `bottle`, `accent`, `icon`, `malts`, `hops`, `yeast`, `other`, `bottledOn`, `bestBefore`, `lot`, `volume`, `og`, `fg`, `grains`, `hopSchedule`, `mash`, `ferment`, `notes`, `look`, `nose`, `mouth`, `finish`, `serving`, `description` (sinon `''`)
- apostrophes typographiques « ’ » conservées dans les textes.

```ts
import type { NewBeer } from './schema';
export const SEED: NewBeer[] = [ /* 6 objets, cf. ci-dessus */ ];
```

`src/lib/db.ts` :
```ts
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { SEED } from './seed';

const CREATE_SQL = `CREATE TABLE IF NOT EXISTS beers (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, edition TEXT NOT NULL DEFAULT '',
  styleName TEXT NOT NULL, denomination TEXT NOT NULL DEFAULT '',
  brew INTEGER NOT NULL UNIQUE, abv TEXT NOT NULL,
  ebc TEXT NOT NULL DEFAULT '', ibu TEXT NOT NULL DEFAULT '',
  bottle TEXT NOT NULL DEFAULT '75cl', accent TEXT NOT NULL DEFAULT 'var(--cuvee-orange)',
  icon TEXT NOT NULL DEFAULT 'Hop',
  malts TEXT NOT NULL DEFAULT '', hops TEXT NOT NULL DEFAULT '',
  yeast TEXT NOT NULL DEFAULT '', other TEXT NOT NULL DEFAULT '',
  bottledOn TEXT NOT NULL DEFAULT '', bestBefore TEXT NOT NULL DEFAULT '',
  lot TEXT NOT NULL DEFAULT '', volume TEXT NOT NULL DEFAULT '',
  og TEXT NOT NULL DEFAULT '', fg TEXT NOT NULL DEFAULT '',
  grains TEXT NOT NULL DEFAULT '', hopSchedule TEXT NOT NULL DEFAULT '',
  mash TEXT NOT NULL DEFAULT '', ferment TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '', look TEXT NOT NULL DEFAULT '',
  nose TEXT NOT NULL DEFAULT '', mouth TEXT NOT NULL DEFAULT '',
  finish TEXT NOT NULL DEFAULT '', serving TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '', labelImage TEXT NOT NULL DEFAULT '',
  createdAt INTEGER NOT NULL DEFAULT 0, updatedAt INTEGER NOT NULL DEFAULT 0
)`;

let _db: ReturnType<typeof create> | null = null;

export function dataDir(): string {
  return process.env.DATA_DIR || path.join(process.cwd(), 'data');
}
export function uploadsDir(): string {
  return path.join(dataDir(), 'uploads');
}

function create() {
  fs.mkdirSync(uploadsDir(), { recursive: true });
  const sqlite = new Database(path.join(dataDir(), 'brasseyutz.sqlite'));
  sqlite.pragma('journal_mode = WAL');
  sqlite.exec(CREATE_SQL);
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
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/db.test.ts && npx vitest run tests/domain.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/schema.ts src/lib/db.ts src/lib/seed.ts tests/db.test.ts
git commit -m "feat: schéma SQLite/Drizzle, client singleton, seed des 6 bières"
```

---
### Task 4: Composants du design system

**Files:**
- Create: `src/components/ds/CuveeIcon.tsx`, `Gauge.tsx`, `IngredientGrid.tsx`, `LegalMentions.tsx`, `Logo.tsx` (retypage), `Button.tsx`, `Badge.tsx`, `BeerCard.tsx`, `BeerLabel.tsx`
- Create: `src/lib/label.ts`
- Test: `tests/ds.test.tsx`

**Interfaces:**
- Consumes: `abvTxt`, `num`, `lotFor`, `splitName` (Task 2).
- Produces (signatures identiques aux sources `design/ds-src/*.jsx`, sauf CuveeIcon) :
  - `CuveeIcon({name, size?, color?, stroke?, unit?, src?, style?})`
  - `Gauge({kind, value, max?, unit?, accent?, variant?, showLabel?, style?})`, `describe(kind, v)`, `level(kind, v)`
  - `IngredientGrid`, `LegalMentions` + `PictoSlot`, `LogoMark`, `Signature`, `Logo`, `Button`, `Badge`, `BeerCard`
  - `BeerLabel(props: LabelProps)` — étiquette 140×75 mm
  - `label.ts` : `labelProps(b: Partial<Beer>, scale?: number, opts?: {print?: boolean; monochrome?: boolean}): LabelProps` (équivalent de `labelBase`/`label` du prototype, chemins `/assets/…`)

- [ ] **Step 1: Port des composants**

Règle générale : copier chaque `design/ds-src/X.jsx` vers `src/components/ds/X.tsx`, ajouter les types de props (interface exportée), et :
- `Button.tsx`, `BeerCard.tsx` : ajouter `'use client'` en première ligne (hooks `useState`).
- `Gauge.tsx`, `IngredientGrid.tsx`, `LegalMentions.tsx`, `Logo.tsx`, `BeerLabel.tsx` : purs, pas de directive.
- `Logo.tsx` : remplacer la version provisoire du Task 1 par la version typée.
- `BeerLabel.tsx` : props typées `LabelProps` (exporter l'interface) ; `ebc`/`ibu` de type `number | undefined` ; le reste identique à la source.

`CuveeIcon.tsx` — seule réécriture réelle (CDN → lucide-react) :
```tsx
import type { CSSProperties } from 'react';
import {
  Hop, Citrus, Zap, Cherry, Orbit, Leaf, Snowflake, SunMoon, Wheat,
  Terminal, Bug, Crown, FlaskConical, Droplets, Thermometer, Search,
  ArrowLeft, Printer, type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Hop, Citrus, Zap, Cherry, Orbit, Leaf, Snowflake, SunMoon, Wheat,
  Terminal, Bug, Crown, FlaskConical, Droplets, Thermometer, Search,
  ArrowLeft, Printer,
};
export const ICON_NAMES = Object.keys(ICONS);

export interface CuveeIconProps {
  name?: string; size?: number; color?: string; stroke?: number;
  unit?: 'px' | 'mm'; src?: string; style?: CSSProperties;
}

/* Icône Lucide au trait fin — illustration « simple » de cuvée. */
export function CuveeIcon({ name = 'Hop', size = 24, color = 'currentColor', stroke = 1.25, unit = 'px', src, style }: CuveeIconProps) {
  const s = size + unit;
  if (src) return <img src={src} alt="" style={{ height: s, width: 'auto', display: 'block', ...style }} />;
  const Icon = ICONS[name];
  if (!Icon) return <span style={{ display: 'inline-block', width: s, height: s, border: '1px dashed var(--encre-3)', boxSizing: 'border-box', ...style }} title={'Icône ' + name} />;
  return <Icon aria-hidden color={color} strokeWidth={stroke} style={{ display: 'block', width: s, height: s, ...style }} />;
}
```

`src/lib/label.ts` :
```ts
import { abvTxt, lotFor, num } from './domain';
import type { LabelProps } from '@/components/ds/BeerLabel';

type BeerFields = {
  bottle?: string; name?: string; edition?: string; styleName?: string;
  denomination?: string; brew?: number | string; abv?: string; ebc?: string;
  ibu?: string; malts?: string; hops?: string; yeast?: string; other?: string;
  bottledOn?: string; bestBefore?: string; lot?: string; accent?: string; icon?: string;
};

export function labelProps(b: BeerFields, scale = 1, opts: { print?: boolean; monochrome?: boolean } = {}): LabelProps {
  return {
    bottle: b.bottle === '33cl' ? '33cl' : '75cl',
    name: b.name || 'Nom de la bière',
    edition: b.edition || undefined,
    styleName: b.styleName || 'Style',
    denomination: b.denomination || undefined,
    brew: b.brew, abv: num(b.abv) ?? 0, ebc: num(b.ebc), ibu: num(b.ibu),
    malts: b.malts, hops: b.hops, yeast: b.yeast, other: b.other,
    bottledOn: b.bottledOn || 'JJ/MM/AAAA',
    bestBefore: b.bestBefore || 'MM/AAAA',
    lot: b.lot || lotFor(b),
    accent: b.accent, icon: b.icon,
    monochrome: !!opts.monochrome, scale,
    logoSrc: '/assets/logo-brasse-yutz.svg',
    pregnancySrc: '/assets/legal/zero-alcool-grossesse-gris.svg',
    trimanSrc: '/assets/legal/triman-gris.png',
    style: opts.print ? {} : { boxShadow: 'var(--shadow-print)' },
  };
}
export { abvTxt };
```

- [ ] **Step 2: Write the failing tests**

`tests/ds.test.tsx` :
```tsx
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { describe as gaugeDescribe, level } from '@/components/ds/Gauge';
import { labelProps } from '@/lib/label';

describe('Gauge', () => {
  it('describe ebc/ibu', () => {
    expect(gaugeDescribe('ebc', 11)).toBe('Dorée');
    expect(gaugeDescribe('ebc', 80)).toBe('Noire');
    expect(gaugeDescribe('ibu', 40)).toBe('Marquée');
  });
  it('level bornes', () => {
    expect(level('ebc', 10)).toBe(1);
    expect(level('ibu', 100)).toBe(5);
  });
});

describe('CuveeIcon', () => {
  it('rend un svg pour un nom connu', () => {
    const { container } = render(<CuveeIcon name="Hop" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
  it('placeholder pour un nom inconnu', () => {
    const { container } = render(<CuveeIcon name="Inexistant" />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('span')).toBeTruthy();
  });
});

describe('BeerLabel', () => {
  const base = labelProps({
    name: 'Hop Overflow', styleName: 'NEIPA', brew: 33, abv: '5', ebc: '11', ibu: '40',
    bottle: '75cl', accent: 'var(--cuvee-orange)', icon: 'Hop',
    malts: '*Orge* : Pale Ale', hops: 'Citra', yeast: 'Verdant IPA', other: 'Eau, sucre',
    bottledOn: '07/05/2026', bestBefore: '05/2027', lot: '',
  });
  it('rend dénomination, TAV, volume, lot auto', () => {
    render(<BeerLabel {...base} />);
    expect(screen.getByText(/Bière NEIPA · 5 % vol\./)).toBeTruthy();
    expect(screen.getByText('75 cl')).toBeTruthy();
    expect(screen.getByText('L2605-33')).toBeTruthy();
    expect(screen.getByText('Dorée')).toBeTruthy(); // qualificatif EBC 11
  });
  it('allergène en gras capitales', () => {
    render(<BeerLabel {...base} />);
    const b = screen.getAllByText('Orge').find(e => e.tagName === 'B');
    expect(b).toBeTruthy();
  });
  it('nom un seul mot : pas de <i> vide, pas de crash', () => {
    const { container } = render(<BeerLabel {...labelProps({ name: 'Paul', styleName: 'Triple', brew: 31, abv: '8,2' })} />);
    const italics = [...container.querySelectorAll('i')].filter(i => !i.textContent);
    expect(italics).toHaveLength(0);
  });
  it('monochrome : accent devient encre', () => {
    const { container } = render(<BeerLabel {...labelProps({ name: 'X Y', styleName: 'Pils', brew: 1, abv: '5', accent: 'var(--cuvee-bleu)' }, 1, { monochrome: true })} />);
    expect(container.innerHTML).not.toContain('var(--cuvee-bleu)');
  });
});
```
- [ ] **Step 3: Run tests, verify failure then implement fixes**

Run: `npx vitest run tests/ds.test.tsx`
Expected: FAIL avant port complet, PASS après. Point d'attention : dans `BeerLabel`, `{second && <i>…</i>}` protège déjà du `<i>` vide — vérifier que le port le conserve.

- [ ] **Step 4: Vérifier le build**

Run: `npm run build`
Expected: OK (le layout importe désormais le `Logo.tsx` typé).

- [ ] **Step 5: Commit**

```bash
git add src/components/ds src/lib/label.ts tests/ds.test.tsx
git commit -m "feat: port des composants du design system (BeerLabel, Gauge, Signature…)"
```

---

### Task 5: QR codes

**Files:**
- Create: `src/lib/qr.tsx`
- Test: `tests/qr.test.tsx`

**Interfaces:**
- Consumes: rien.
- Produces:
  - `brewUrl(siteUrl: string, brew: number | string): string` — `siteUrl` sans slash final + `/brassin/` + brew
  - `qrSvgString(url: string): string` — SVG autonome (niveau M, marge 2, fond blanc, modules `#161616`)
  - `QrSvg({url}: {url: string})` — React, remplit son conteneur
  - `QrStyled({url, accent}: {url: string; accent: string})` — port de `qrDesign` du design (lignes 481-499) : niveau H, trou central ~26 %, œils stylés (cadre accent + cœur encre), icône houblon lucide-react superposée au centre

- [ ] **Step 1: Write the failing tests**

`tests/qr.test.tsx` :
```tsx
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { brewUrl, qrSvgString, QrSvg, QrStyled } from '@/lib/qr';

describe('brewUrl', () => {
  it('compose l’URL', () => expect(brewUrl('https://www.brasseyutz.fr', 33)).toBe('https://www.brasseyutz.fr/brassin/33'));
  it('tolère le slash final', () => expect(brewUrl('https://www.brasseyutz.fr/', 33)).toBe('https://www.brasseyutz.fr/brassin/33'));
});

describe('qrSvgString', () => {
  it('SVG scannable minimal', () => {
    const s = qrSvgString('https://www.brasseyutz.fr/brassin/33');
    expect(s).toContain('<svg');
    expect(s).toContain('#161616');
    expect(s).toContain('fill="#fff"');
  });
});

describe('QrSvg / QrStyled', () => {
  it('QrSvg rend un path de modules', () => {
    const { container } = render(<QrSvg url="https://www.brasseyutz.fr/brassin/33" />);
    expect(container.querySelector('svg path')).toBeTruthy();
  });
  it('QrStyled rend œils accent + icône centrale', () => {
    const { container } = render(<QrStyled url="https://www.brasseyutz.fr/brassin/33" accent="var(--cuvee-orange)" />);
    const rects = container.querySelectorAll('rect[stroke="var(--cuvee-orange)"]');
    expect(rects.length).toBe(3);
    expect(container.querySelectorAll('svg').length).toBeGreaterThanOrEqual(2); // QR + houblon
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/qr.test.tsx`
Expected: FAIL — module absent.

- [ ] **Step 3: Implement**

`src/lib/qr.tsx` :
```tsx
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

/* Port de qrDesign (design lignes 481-499) : niveau H, trou central pour l'icône,
   œils redessinés. L'icône houblon est superposée en HTML (lucide-react). */
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
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/qr.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/qr.tsx tests/qr.test.tsx
git commit -m "feat: génération QR (simple, stylisé houblon, export SVG)"
```

---

### Task 6: Auth — session, rate-limit, login/logout, script de hash

**Files:**
- Create: `src/lib/session.ts`, `src/lib/ratelimit.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts`, `scripts/hash-password.mjs`
- Test: `tests/auth.test.ts`

**Interfaces:**
- Consumes: rien.
- Produces:
  - `session.ts` : `sign(exp: number): string`, `verify(token?: string): boolean`, `hasSession(): Promise<boolean>`, `setSession(): Promise<void>`, `clearSession(): Promise<void>`, `requireSession(): Promise<Response | null>` (401 JSON `{error:'Non autorisé.'}` ou null), `SESSION_COOKIE = 'by_session'`
  - `ratelimit.ts` : `allowLogin(ip: string): boolean` (5 essais / 15 min), `resetRateLimitForTests(): void`
  - `POST /api/auth/login` body `{password}` → 200 + cookie | 401 | 429 | 500 si env absent
  - `POST /api/auth/logout` → 200, cookie effacé

- [ ] **Step 1: Write the failing tests**

`tests/auth.test.ts` :
```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { sign, verify } from '@/lib/session';
import { allowLogin, resetRateLimitForTests } from '@/lib/ratelimit';
import { POST as login } from '@/app/api/auth/login/route';

const req = (body: unknown, ip = '1.2.3.4') =>
  new Request('http://test/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

describe('session', () => {
  it('signe et vérifie', () => expect(verify(sign(Date.now() + 60000))).toBe(true));
  it('rejette token expiré', () => expect(verify(sign(Date.now() - 1))).toBe(false));
  it('rejette signature falsifiée', () => {
    const t = sign(Date.now() + 60000);
    expect(verify(t.slice(0, -2) + 'xx')).toBe(false);
    expect(verify('abc')).toBe(false);
    expect(verify(undefined)).toBe(false);
  });
});

describe('ratelimit', () => {
  beforeEach(resetRateLimitForTests);
  it('5 essais puis blocage, IP indépendantes', () => {
    for (let i = 0; i < 5; i++) expect(allowLogin('a')).toBe(true);
    expect(allowLogin('a')).toBe(false);
    expect(allowLogin('b')).toBe(true);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(resetRateLimitForTests);
  it('mot de passe correct → 200 + Set-Cookie', async () => {
    const res = await login(req({ password: 'test-password' }));
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toContain('by_session=');
  });
  it('mot de passe faux → 401', async () => {
    const res = await login(req({ password: 'nope' }));
    expect(res.status).toBe(401);
    const j = await res.json();
    expect(j.error).toBe('Mot de passe incorrect.');
  });
  it('6e essai → 429', async () => {
    for (let i = 0; i < 5; i++) await login(req({ password: 'nope' }, '9.9.9.9'));
    const res = await login(req({ password: 'test-password' }, '9.9.9.9'));
    expect(res.status).toBe(429);
  });
  it('body invalide → 401 sans crash', async () => {
    const res = await login(new Request('http://test', { method: 'POST', headers: { 'x-forwarded-for': 'z' }, body: '{' }));
    expect(res.status).toBe(401);
  });
});
```
Note : `setSession()` utilise `cookies()` de Next, indisponible hors requête. Dans la route login, construire la réponse avec l'en-tête `Set-Cookie` manuellement (voir Step 3) pour rester testable en Vitest.

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/auth.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/lib/session.ts` :
```ts
import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'by_session';
const DAYS = 30;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET manquant ou trop court (32 caractères minimum).');
  return s;
}

export function sign(exp: number): string {
  const p = String(exp);
  const sig = crypto.createHmac('sha256', secret()).update(p).digest('base64url');
  return p + '.' + sig;
}

export function verify(token?: string): boolean {
  if (!token) return false;
  const i = token.lastIndexOf('.');
  if (i < 1) return false;
  const p = token.slice(0, i), sig = token.slice(i + 1);
  const good = crypto.createHmac('sha256', secret()).update(p).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(good);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(p) > Date.now();
}

export function sessionCookieHeader(): string {
  const exp = Date.now() + DAYS * 864e5;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${sign(exp)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${DAYS * 86400}${secure}`;
}

export function clearCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export async function hasSession(): Promise<boolean> {
  const c = await cookies();
  return verify(c.get(SESSION_COOKIE)?.value);
}

/* Garde des API : lit l'en-tête cookie de la requête (testable hors contexte Next). */
export function requireSession(req: Request): Response | null {
  const raw = req.headers.get('cookie') || '';
  const token = raw.split(/;\s*/).find(p => p.startsWith(SESSION_COOKIE + '='))?.slice(SESSION_COOKIE.length + 1);
  if (verify(token)) return null;
  return Response.json({ error: 'Non autorisé.' }, { status: 401 });
}
```
(`hasSession()` via `cookies()` sert aux pages serveur ; `requireSession(req)` aux route handlers.)

`src/lib/ratelimit.ts` :
```ts
const WINDOW = 15 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

export function allowLogin(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW });
    return true;
  }
  h.count += 1;
  return h.count <= MAX;
}

export function resetRateLimitForTests(): void {
  hits.clear();
}
```

`src/app/api/auth/login/route.ts` :
```ts
import bcrypt from 'bcryptjs';
import { allowLogin } from '@/lib/ratelimit';
import { sessionCookieHeader } from '@/lib/session';

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!allowLogin(ip)) return Response.json({ error: 'Trop d’essais, réessayez dans 15 minutes.' }, { status: 429 });
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return Response.json({ error: 'ADMIN_PASSWORD_HASH non configuré.' }, { status: 500 });
  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!password || !(await bcrypt.compare(password, hash)))
    return Response.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': sessionCookieHeader() } });
}
```

`src/app/api/auth/logout/route.ts` :
```ts
import { clearCookieHeader } from '@/lib/session';
export async function POST(): Promise<Response> {
  return Response.json({ ok: true }, { headers: { 'Set-Cookie': clearCookieHeader() } });
}
```

`scripts/hash-password.mjs` :
```js
import bcrypt from 'bcryptjs';
const pw = process.argv[2];
if (!pw) {
  console.error('Usage : node scripts/hash-password.mjs <mot-de-passe>');
  process.exit(1);
}
console.log(bcrypt.hashSync(pw, 12));
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/auth.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/session.ts src/lib/ratelimit.ts src/app/api/auth scripts/hash-password.mjs tests/auth.test.ts
git commit -m "feat: auth admin (session signée, rate-limit, login/logout, hash CLI)"
```

---

### Task 7: Validation + API beers (CRUD)

**Files:**
- Create: `src/lib/validate.ts`, `src/app/api/beers/route.ts`, `src/app/api/beers/[id]/route.ts`
- Test: `tests/beers-api.test.ts`

**Interfaces:**
- Consumes: `getDb`, `beers`, `Beer`, `NewBeer` (Task 3) ; `slug`, `lotFor` (Task 2) ; `requireSession` (Task 6).
- Produces:
  - `validateBeer(input: unknown, opts?: {id?: string}): {ok: true; beer: NewBeer} | {ok: false; error: string}`
  - `GET /api/beers` → `Beer[]` trié brew desc (public)
  - `POST /api/beers` (auth) → 201 `Beer` | 400 | 409
  - `PUT /api/beers/[id]` (auth) → 200 `Beer` | 400 | 404 | 409
  - `DELETE /api/beers/[id]` (auth) → 200 `{ok:true}` | 404
  - Handlers `[id]` : signature Next 15 `(req: Request, ctx: {params: Promise<{id: string}>})`

- [ ] **Step 1: Write the failing tests**

`tests/beers-api.test.ts` :
```ts
import { describe, expect, it } from 'vitest';
import { validateBeer } from '@/lib/validate';
import { GET as listBeers, POST as createBeer } from '@/app/api/beers/route';
import { PUT as updateBeer, DELETE as deleteBeer } from '@/app/api/beers/[id]/route';
import { sign, SESSION_COOKIE } from '@/lib/session';

const cookie = () => `${SESSION_COOKIE}=${sign(Date.now() + 60000)}`;
const jreq = (method: string, body?: unknown, auth = true) =>
  new Request('http://test/api/beers', {
    method,
    headers: { 'content-type': 'application/json', ...(auth ? { cookie: cookie() } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const valid = { name: 'Comet Ale', styleName: 'Pale Ale', brew: 35, abv: '5,2' };

describe('validateBeer', () => {
  it('champs requis manquants → message exact', () => {
    const r = validateBeer({ name: 'X' });
    expect(r).toEqual({ ok: false, error: 'Nom, style, n° de brassin et alcool sont obligatoires.' });
  });
  it('complète id, lot, défauts', () => {
    const r = validateBeer({ ...valid, bottledOn: '01/06/2026' });
    if (!r.ok) throw new Error(r.error);
    expect(r.beer.id).toBe('comet-ale');
    expect(r.beer.lot).toBe('L2606-35');
    expect(r.beer.bottle).toBe('75cl');
    expect(r.beer.accent).toBe('var(--cuvee-orange)');
  });
  it('brew non entier → erreur', () => {
    expect(validateBeer({ ...valid, brew: 'abc' }).ok).toBe(false);
  });
});

describe('API beers', () => {
  it('GET liste triée brew desc, public', async () => {
    const res = await listBeers();
    const list = await res.json();
    expect(list).toHaveLength(6);
    expect(list[0].brew).toBe(34);
  });
  it('POST sans session → 401', async () => {
    expect((await createBeer(jreq('POST', valid, false))).status).toBe(401);
  });
  it('POST crée → 201, GET en contient 7', async () => {
    const res = await createBeer(jreq('POST', valid));
    expect(res.status).toBe(201);
    expect((await (await listBeers()).json())).toHaveLength(7);
  });
  it('POST brew en double → 409 message clair', async () => {
    const res = await createBeer(jreq('POST', { ...valid, name: 'Autre Nom', brew: 33 }));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe('Le brassin N° 33 existe déjà.');
  });
  it('POST id en double → 409', async () => {
    const res = await createBeer(jreq('POST', { name: 'Hop Overflow', styleName: 'NEIPA', brew: 99, abv: '5' }));
    expect(res.status).toBe(409);
  });
  it('PUT modifie', async () => {
    const res = await updateBeer(jreq('PUT', { ...valid, name: 'Hop Overflow', brew: 33, abv: '5,1' }), ctx('hop-overflow'));
    expect(res.status).toBe(200);
    expect((await res.json()).abv).toBe('5,1');
  });
  it('PUT inconnu → 404 ; DELETE inconnu → 404', async () => {
    expect((await updateBeer(jreq('PUT', valid), ctx('nexiste-pas'))).status).toBe(404);
    expect((await deleteBeer(jreq('DELETE'), ctx('nexiste-pas'))).status).toBe(404);
  });
  it('DELETE supprime', async () => {
    expect((await deleteBeer(jreq('DELETE'), ctx('paul'))).status).toBe(200);
    expect((await (await listBeers()).json()).find((b: { id: string }) => b.id === 'paul')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/beers-api.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/lib/validate.ts` :
```ts
import { lotFor, slug } from './domain';
import type { NewBeer } from './schema';

const OPTIONAL_TEXT = ['edition', 'denomination', 'ebc', 'ibu', 'malts', 'hops', 'yeast', 'other',
  'bottledOn', 'bestBefore', 'lot', 'volume', 'og', 'fg', 'grains', 'hopSchedule', 'mash',
  'ferment', 'notes', 'look', 'nose', 'mouth', 'finish', 'serving', 'description', 'labelImage'] as const;

const REQUIRED_MSG = 'Nom, style, n° de brassin et alcool sont obligatoires.';

export function validateBeer(input: unknown, opts: { id?: string } = {}):
  { ok: true; beer: NewBeer } | { ok: false; error: string } {
  if (typeof input !== 'object' || input === null) return { ok: false, error: REQUIRED_MSG };
  const o = input as Record<string, unknown>;
  const s = (k: string) => String(o[k] ?? '').trim();
  const name = s('name'), styleName = s('styleName'), abv = s('abv');
  const brew = Number(o.brew);
  if (!name || !styleName || !abv || !Number.isInteger(brew) || brew <= 0)
    return { ok: false, error: REQUIRED_MSG };
  const edition = s('edition');
  const bottle = s('bottle') === '33cl' ? '33cl' : '75cl';
  const beer: NewBeer = {
    id: opts.id || (typeof o.id === 'string' && o.id.trim()) || slug(name + (edition ? ' ' + edition : '')),
    name, styleName, abv, brew, bottle,
    accent: s('accent') || 'var(--cuvee-orange)',
    icon: s('icon') || 'Hop',
  };
  for (const k of OPTIONAL_TEXT) (beer as Record<string, unknown>)[k] = String(o[k] ?? '').replace(/^\s+|\s+$/g, '');
  if (!beer.lot) beer.lot = lotFor({ bottledOn: beer.bottledOn, brew });
  return { ok: true, beer };
}
```

`src/app/api/beers/route.ts` :
```ts
import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { validateBeer } from '@/lib/validate';
import { requireSession } from '@/lib/session';

export async function GET(): Promise<Response> {
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return Response.json(list);
}

export async function POST(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const v = validateBeer(body);
  if (!v.ok) return Response.json({ error: v.error }, { status: 400 });
  const db = getDb();
  if (db.select().from(beers).where(eq(beers.id, v.beer.id)).get())
    return Response.json({ error: 'Une bière avec cet identifiant existe déjà.' }, { status: 409 });
  if (db.select().from(beers).where(eq(beers.brew, v.beer.brew)).get())
    return Response.json({ error: `Le brassin N° ${v.beer.brew} existe déjà.` }, { status: 409 });
  const now = Date.now();
  db.insert(beers).values({ ...v.beer, createdAt: now, updatedAt: now }).run();
  const created = db.select().from(beers).where(eq(beers.id, v.beer.id)).get();
  return Response.json(created, { status: 201 });
}
```

`src/app/api/beers/[id]/route.ts` :
```ts
import { and, eq, ne } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { validateBeer } from '@/lib/validate';
import { requireSession } from '@/lib/session';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const db = getDb();
  const existing = db.select().from(beers).where(eq(beers.id, id)).get();
  if (!existing) return Response.json({ error: 'Bière introuvable.' }, { status: 404 });
  const body = await req.json().catch(() => null);
  const v = validateBeer(body, { id });
  if (!v.ok) return Response.json({ error: v.error }, { status: 400 });
  if (db.select().from(beers).where(and(eq(beers.brew, v.beer.brew), ne(beers.id, id))).get())
    return Response.json({ error: `Le brassin N° ${v.beer.brew} existe déjà.` }, { status: 409 });
  db.update(beers).set({ ...v.beer, id, createdAt: existing.createdAt, updatedAt: Date.now() }).where(eq(beers.id, id)).run();
  return Response.json(db.select().from(beers).where(eq(beers.id, id)).get());
}

export async function DELETE(req: Request, ctx: Ctx): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const { id } = await ctx.params;
  const db = getDb();
  if (!db.select().from(beers).where(eq(beers.id, id)).get())
    return Response.json({ error: 'Bière introuvable.' }, { status: 404 });
  db.delete(beers).where(eq(beers.id, id)).run();
  return Response.json({ ok: true });
}
```
- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/beers-api.test.ts tests/auth.test.ts`
Expected: PASS (les deux fichiers).

- [ ] **Step 5: Commit**

```bash
git add src/lib/validate.ts src/lib/session.ts src/app/api/beers tests/beers-api.test.ts
git commit -m "feat: validation et API CRUD des brassins"
```

---
### Task 8: Upload d'image + service des fichiers

**Files:**
- Create: `src/app/api/upload/route.ts`, `src/app/uploads/[...file]/route.ts`
- Test: `tests/upload.test.ts`

**Interfaces:**
- Consumes: `uploadsDir` (Task 3), `requireSession` (Task 6/7).
- Produces:
  - `POST /api/upload` (auth, multipart champ `file`) → 200 `{path: '/uploads/<uuid>.jpg'}` | 400 (pas de fichier) | 413 (> 10 Mo) | 415 (`{error:'Image illisible.'}`)
  - Traitement : rotation EXIF, max 1600 px, fond blanc aplati, JPEG qualité 85 (comportement du prototype, design lignes 524-535)
  - `GET /uploads/<fichier>` → image `image/jpeg`, cache immutable, 404 sinon ; refuse toute traversée de chemin

- [ ] **Step 1: Write the failing tests**

`tests/upload.test.ts` :
```ts
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { POST as upload } from '@/app/api/upload/route';
import { GET as serveUpload } from '@/app/uploads/[...file]/route';
import { uploadsDir } from '@/lib/db';
import { sign, SESSION_COOKIE } from '@/lib/session';

const cookie = () => `${SESSION_COOKIE}=${sign(Date.now() + 60000)}`;
async function makeReq(bytes: Uint8Array, name = 'photo.png', type = 'image/png') {
  const fd = new FormData();
  fd.set('file', new File([bytes], name, { type }));
  return new Request('http://test/api/upload', { method: 'POST', headers: { cookie: cookie() }, body: fd });
}
const png = () => sharp({ create: { width: 2000, height: 1000, channels: 3, background: '#336699' } }).png().toBuffer();

describe('POST /api/upload', () => {
  it('sans session → 401', async () => {
    const fd = new FormData();
    fd.set('file', new File([new Uint8Array([1])], 'x.png'));
    const res = await upload(new Request('http://test', { method: 'POST', body: fd }));
    expect(res.status).toBe(401);
  });
  it('image valide → jpg ≤ 1600 px écrit dans uploads', async () => {
    const res = await upload(await makeReq(new Uint8Array(await png())));
    expect(res.status).toBe(200);
    const { path: p } = await res.json();
    expect(p).toMatch(/^\/uploads\/[0-9a-f-]+\.jpg$/);
    const file = path.join(uploadsDir(), path.basename(p));
    const meta = await sharp(file).metadata();
    expect(meta.width).toBe(1600);
    expect(meta.format).toBe('jpeg');
  });
  it('non-image → 415, rien d’écrit', async () => {
    fs.mkdirSync(uploadsDir(), { recursive: true });
    const before = fs.readdirSync(uploadsDir()).length;
    const res = await upload(await makeReq(new TextEncoder().encode('pas une image'), 'x.txt', 'text/plain'));
    expect(res.status).toBe(415);
    expect((await res.json()).error).toBe('Image illisible.');
    expect(fs.readdirSync(uploadsDir()).length).toBe(before);
  });
  it('> 10 Mo → 413, rien d’écrit', async () => {
    fs.mkdirSync(uploadsDir(), { recursive: true });
    const before = fs.readdirSync(uploadsDir()).length;
    const res = await upload(await makeReq(new Uint8Array(11 * 1024 * 1024)));
    expect(res.status).toBe(413);
    expect(fs.readdirSync(uploadsDir()).length).toBe(before);
  });
});

describe('GET /uploads/…', () => {
  it('sert le fichier, bloque la traversée', async () => {
    const up = await upload(await makeReq(new Uint8Array(await png())));
    const name = path.basename((await up.json()).path);
    const ok = await serveUpload(new Request('http://test'), { params: Promise.resolve({ file: [name] }) });
    expect(ok.status).toBe(200);
    expect(ok.headers.get('content-type')).toBe('image/jpeg');
    const evil = await serveUpload(new Request('http://test'), { params: Promise.resolve({ file: ['..', 'brasseyutz.sqlite'] }) });
    expect(evil.status).toBe(404);
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/upload.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/api/upload/route.ts` :
```ts
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { uploadsDir } from '@/lib/db';
import { requireSession } from '@/lib/session';

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const fd = await req.formData().catch(() => null);
  const file = fd?.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Aucun fichier reçu.' }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: 'Image trop lourde (10 Mo maximum).' }, { status: 413 });
  const buf = Buffer.from(await file.arrayBuffer());
  let out: Buffer;
  try {
    out = await sharp(buf).rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch {
    return Response.json({ error: 'Image illisible.' }, { status: 415 });
  }
  fs.mkdirSync(uploadsDir(), { recursive: true });
  const name = crypto.randomUUID() + '.jpg';
  fs.writeFileSync(path.join(uploadsDir(), name), out);
  return Response.json({ path: '/uploads/' + name });
}
```

`src/app/uploads/[...file]/route.ts` :
```ts
import fs from 'node:fs';
import path from 'node:path';
import { uploadsDir } from '@/lib/db';

export async function GET(_req: Request, ctx: { params: Promise<{ file: string[] }> }): Promise<Response> {
  const { file } = await ctx.params;
  const base = uploadsDir();
  const p = path.normalize(path.join(base, ...file));
  if (!p.startsWith(base + path.sep) || !fs.existsSync(p) || !fs.statSync(p).isFile())
    return new Response('Introuvable', { status: 404 });
  return new Response(new Uint8Array(fs.readFileSync(p)), {
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/upload.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/upload src/app/uploads tests/upload.test.ts
git commit -m "feat: upload d'ancienne étiquette (sharp) et service des fichiers"
```

---

### Task 9: Export / import JSON

**Files:**
- Create: `src/app/api/export/route.ts`, `src/app/api/import/route.ts`
- Test: `tests/export-import.test.ts`

**Interfaces:**
- Consumes: `getDb`, `beers` (Task 3), `validateBeer` (Task 7), `requireSession` (Task 6/7).
- Produces:
  - `GET /api/export` (auth) → `{exportedAt: string, beers: Beer[]}` avec `Content-Disposition: attachment; filename="brasseyutz-export.json"`
  - `POST /api/import` (auth) body `{beers: unknown[]}` → 200 `{ok: true, count}` remplace **tout** | 400 si structure invalide, une bière invalide, ou doublon id/brew — base inchangée

- [ ] **Step 1: Write the failing tests**

`tests/export-import.test.ts` :
```ts
import { describe, expect, it } from 'vitest';
import { GET as exportBeers } from '@/app/api/export/route';
import { POST as importBeers } from '@/app/api/import/route';
import { GET as listBeers } from '@/app/api/beers/route';
import { sign, SESSION_COOKIE } from '@/lib/session';

const cookie = () => `${SESSION_COOKIE}=${sign(Date.now() + 60000)}`;
const req = (body?: unknown) => new Request('http://test', {
  method: body === undefined ? 'GET' : 'POST',
  headers: { 'content-type': 'application/json', cookie: cookie() },
  body: body === undefined ? undefined : JSON.stringify(body),
});

describe('export/import', () => {
  it('export → 6 bières + en-tête téléchargement', async () => {
    const res = await exportBeers(req());
    expect(res.status).toBe(200);
    expect(res.headers.get('content-disposition')).toContain('brasseyutz-export.json');
    expect((await res.json()).beers).toHaveLength(6);
  });
  it('cycle export → import identique', async () => {
    const dump = await (await exportBeers(req())).json();
    const res = await importBeers(req({ beers: dump.beers }));
    expect(res.status).toBe(200);
    expect((await res.json()).count).toBe(6);
    expect(await (await listBeers()).json()).toHaveLength(6);
  });
  it('import remplace tout', async () => {
    const one = { name: 'Seule Bière', styleName: 'Pils', brew: 1, abv: '5' };
    await importBeers(req({ beers: [one] }));
    expect(await (await listBeers()).json()).toHaveLength(1);
  });
  it('JSON invalide → 400, base inchangée', async () => {
    expect((await importBeers(req({ pas: 'bon' }))).status).toBe(400);
    const bad = [{ name: 'Ok', styleName: 'Pils', brew: 1, abv: '5' }, { name: 'Sans style', brew: 2 }];
    expect((await importBeers(req({ beers: bad }))).status).toBe(400);
    expect(await (await listBeers()).json()).toHaveLength(6);
  });
  it('doublon de brassin dans l’import → 400', async () => {
    const dup = [
      { name: 'A', styleName: 'Pils', brew: 1, abv: '5' },
      { name: 'B', styleName: 'Pils', brew: 1, abv: '5' },
    ];
    expect((await importBeers(req({ beers: dup }))).status).toBe(400);
  });
  it('sans session → 401', async () => {
    expect((await exportBeers(new Request('http://test'))).status).toBe(401);
    expect((await importBeers(new Request('http://test', { method: 'POST', body: '{}' }))).status).toBe(401);
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/export-import.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/api/export/route.ts` :
```ts
import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { requireSession } from '@/lib/session';

export async function GET(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return Response.json({ exportedAt: new Date().toISOString(), beers: list }, {
    headers: { 'Content-Disposition': 'attachment; filename="brasseyutz-export.json"' },
  });
}
```

`src/app/api/import/route.ts` :
```ts
import { getDb } from '@/lib/db';
import { beers, type NewBeer } from '@/lib/schema';
import { validateBeer } from '@/lib/validate';
import { requireSession } from '@/lib/session';

export async function POST(req: Request): Promise<Response> {
  const denied = requireSession(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null) as { beers?: unknown[] } | null;
  if (!body || !Array.isArray(body.beers) || body.beers.length === 0)
    return Response.json({ error: 'Fichier d’import invalide : tableau « beers » attendu.' }, { status: 400 });
  const validated: NewBeer[] = [];
  const ids = new Set<string>(), brews = new Set<number>();
  for (let i = 0; i < body.beers.length; i++) {
    const v = validateBeer(body.beers[i]);
    if (!v.ok) return Response.json({ error: `Bière ${i + 1} : ${v.error}` }, { status: 400 });
    if (ids.has(v.beer.id) || brews.has(v.beer.brew))
      return Response.json({ error: `Bière ${i + 1} : identifiant ou n° de brassin en double.` }, { status: 400 });
    ids.add(v.beer.id); brews.add(v.beer.brew);
    validated.push(v.beer);
  }
  const db = getDb();
  const now = Date.now();
  db.transaction(tx => {
    tx.delete(beers).run();
    for (const b of validated) tx.insert(beers).values({ ...b, createdAt: now, updatedAt: now }).run();
  });
  return Response.json({ ok: true, count: validated.length });
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/export-import.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/export src/app/api/import tests/export-import.test.ts
git commit -m "feat: export et import JSON des brassins"
```

---

### Task 10: Catalogue public

**Files:**
- Modify: `src/app/page.tsx` (remplace le provisoire)
- Create: `src/app/catalogue.tsx`
- Test: `tests/catalogue.test.tsx`

**Interfaces:**
- Consumes: `getDb`, `beers`, `Beer` (Task 3) ; `matches`, `splitName`, `abvTxt` (Task 2) ; `labelProps` (Task 4) ; `BeerLabel`, `CuveeIcon` (Task 4).
- Produces: `Catalogue({beers}: {beers: Beer[]})` client component ; page `/` SSR (`export const dynamic = 'force-dynamic'`).

- [ ] **Step 1: Write the failing tests**

`tests/catalogue.test.tsx` :
```tsx
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Catalogue } from '@/app/catalogue';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', ...b })) as Beer[];

describe('Catalogue', () => {
  it('affiche titre, compteur et toutes les cartes', () => {
    render(<Catalogue beers={beers} />);
    expect(screen.getByText('bières', { selector: 'i' })).toBeTruthy();
    expect(screen.getByText('6 bières')).toBeTruthy();
    expect(screen.getByText('Overflow')).toBeTruthy(); // 2e partie du nom en italique
  });
  it('recherche filtre sans accents', () => {
    render(<Catalogue beers={beers} />);
    fireEvent.change(screen.getByPlaceholderText(/Nom, style, houblon/), { target: { value: 'electrique' } });
    expect(screen.getByText('1 bière')).toBeTruthy();
  });
  it('aucun résultat → message avec la requête', () => {
    render(<Catalogue beers={beers} />);
    fireEvent.change(screen.getByPlaceholderText(/Nom, style, houblon/), { target: { value: 'xyz' } });
    expect(screen.getByText(/Aucune bière ne correspond à « xyz »/)).toBeTruthy();
  });
  it('les cartes pointent vers /biere/<id>', () => {
    render(<Catalogue beers={beers} />);
    const link = screen.getAllByRole('link').find(a => a.getAttribute('href') === '/biere/hop-overflow');
    expect(link).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/catalogue.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/page.tsx` :
```tsx
import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { Catalogue } from './catalogue';

export const dynamic = 'force-dynamic';

export default function Home() {
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return <Catalogue beers={list} />;
}
```

`src/app/catalogue.tsx` — transcription fidèle du design lignes 41-77 (règles de conversion des Global Constraints) :
```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Beer } from '@/lib/schema';
import { abvTxt, matches, splitName } from '@/lib/domain';
import { labelProps } from '@/lib/label';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { CuveeIcon } from '@/components/ds/CuveeIcon';

const CARD_ZOOM = 0.58;

export function Catalogue({ beers }: { beers: Beer[] }) {
  const [query, setQuery] = useState('');
  const filtered = beers.filter(b => matches(b, query));
  const countTxt = filtered.length + (filtered.length > 1 ? ' bières' : ' bière');
  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(32px,6vw,72px) clamp(16px,4vw,48px) 96px' }}>
      <div style={{ font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>Bières maison · Yutz</div>
      <h1 style={{ margin: '12px 0 0', font: '400 clamp(52px,8vw,104px)/0.92 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
        Toutes les <i style={{ color: 'var(--accent)' }}>bières</i>
      </h1>
      <p style={{ margin: '20px 0 0', maxWidth: 560, fontSize: 'var(--fs-lead)', lineHeight: 1.5, color: 'var(--encre-2)', textWrap: 'pretty' }}>
        Chaque étiquette porte un QR code qui mène ici : la recette, les chiffres et les mentions de la cuvée.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', margin: '40px 0 24px', paddingTop: 24, borderTop: '1px solid var(--encre)' }}>
        <label style={{ flex: '1 1 320px', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 48, background: 'var(--papier)', border: '1px solid var(--filet)' }}>
          <CuveeIcon name="Search" size={18} color="var(--encre-3)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nom, style, houblon, malt, n° de brassin…"
            style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', font: '400 16px var(--font-text)', color: 'var(--encre)' }} />
        </label>
        <span style={{ font: '500 13px var(--font-mono)', color: 'var(--encre-3)' }}>{countTxt}</span>
      </div>
      {filtered.length === 0 && (
        <p style={{ padding: '48px 0', font: 'italic 400 28px var(--font-display)', color: 'var(--encre-2)' }}>
          Aucune bière ne correspond à « {query} ».
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,340px),1fr))', gap: 20 }}>
        {filtered.map(b => {
          const [first, second] = splitName(b);
          return (
            <Link key={b.id} href={`/biere/${b.id}`} className="hov-border"
              style={{ display: 'flex', flexDirection: 'column', background: 'var(--papier)', border: '1px solid var(--filet)', color: 'var(--encre)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--filet)' }}>
                <span style={{ font: '600 11px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: b.accent }}>{b.styleName}</span>
                <span style={{ font: '500 12px var(--font-mono)', color: 'var(--encre)' }}>N° {b.brew}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '22px 12px', background: 'var(--papier-2)', overflow: 'hidden' }}>
                {b.labelImage
                  ? <img src={b.labelImage} alt={`Étiquette ${b.name}`} style={{ display: 'block', maxWidth: '100%', height: Math.round(283 * CARD_ZOOM), objectFit: 'contain', boxShadow: 'var(--shadow-print)' }} />
                  : <BeerLabel {...labelProps(b, CARD_ZOOM)} />}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: 14, borderTop: '1px solid var(--filet)' }}>
                <span style={{ font: '400 26px/1 var(--font-display)', color: 'var(--encre)' }}>{first} {second && <i style={{ color: b.accent }}>{second}</i>}</span>
                <span style={{ font: '500 12px var(--font-mono)', color: 'var(--encre-2)', whiteSpace: 'nowrap' }}>{abvTxt(b.abv)} % · {b.bottle === '33cl' ? '33 cl' : '75 cl'}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/catalogue.test.tsx && npm run build`
Expected: PASS + build OK.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/catalogue.tsx tests/catalogue.test.tsx
git commit -m "feat: catalogue public avec recherche et cartes étiquettes"
```

---

### Task 11: Fiche recette + route QR

**Files:**
- Create: `src/app/fiche.tsx`, `src/app/biere/[id]/page.tsx`, `src/app/biere/[id]/not-found.tsx`, `src/app/brassin/[brew]/page.tsx`, `src/app/brassin/[brew]/not-found.tsx`
- Test: `tests/fiche.test.tsx`

**Interfaces:**
- Consumes: Tasks 2, 3, 4.
- Produces:
  - `Fiche({beer, others}: {beer: Beer; others: Beer[]})` — serveur, transcription design lignes 81-180
  - `FicheIntrouvable()` — design lignes 85-88 (h1 « Bière *introuvable* », lien retour)
  - pages `/biere/[id]` et `/brassin/[brew]` : chargent la bière + 3 autres (brew desc, hors courante), `generateMetadata` (titre `<name>`, description = style + n°), `notFound()` si absente ; `/brassin` accepte uniquement un entier, sinon `notFound()`
  - `export const dynamic = 'force-dynamic'` sur les deux pages

- [ ] **Step 1: Write the failing tests**

`tests/fiche.test.tsx` :
```tsx
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('fiche', () => {
  it('/biere/hop-overflow rend stats, recette, dégustation, autres bières', async () => {
    const Page = (await import('@/app/biere/[id]/page')).default;
    render(await Page({ params: Promise.resolve({ id: 'hop-overflow' }) }));
    expect(screen.getByText('Overflow')).toBeTruthy();
    expect(screen.getByText('Alcool')).toBeTruthy();
    expect(screen.getByText('Amertume')).toBeTruthy();
    expect(screen.getByText('Densité initiale')).toBeTruthy();
    expect(screen.getByText(/L’histoire du brassin/i)).toBeTruthy();
    expect(screen.getByText('Malts & grains')).toBeTruthy();
    expect(screen.getByText(/Fermentation · Verdant IPA/)).toBeTruthy();
    expect(screen.getByText('Pour 20 litres')).toBeTruthy();
    expect(screen.getByText('Le mot du brasseur')).toBeTruthy();
    expect(screen.getByText('Nez')).toBeTruthy();
    expect(screen.getByText('Autres bières')).toBeTruthy();
  });
  it('/brassin/33 rend la même bière', async () => {
    const Page = (await import('@/app/brassin/[brew]/page')).default;
    render(await Page({ params: Promise.resolve({ brew: '33' }) }));
    expect(screen.getByText('Overflow')).toBeTruthy();
  });
  it('bière sans dégustation ni histoire : sections omises', async () => {
    const { getDb } = await import('@/lib/db');
    const { beers } = await import('@/lib/schema');
    getDb().insert(beers).values({ id: 'nue', name: 'Nue', styleName: 'Pils', brew: 90, abv: '5' }).run();
    const Page = (await import('@/app/biere/[id]/page')).default;
    render(await Page({ params: Promise.resolve({ id: 'nue' }) }));
    expect(screen.getByText('recette', { selector: 'i' })).toBeTruthy(); // « La recette » toujours là
    expect(screen.queryByText('Le mot du brasseur')).toBeNull();
    expect(screen.queryByText(/L’histoire du brassin/)).toBeNull();
  });
  it('id inconnu → notFound() ; brassin non numérique → notFound()', async () => {
    const PageId = (await import('@/app/biere/[id]/page')).default;
    await expect(PageId({ params: Promise.resolve({ id: 'nexiste-pas' }) })).rejects.toThrowError();
    const PageBrew = (await import('@/app/brassin/[brew]/page')).default;
    await expect(PageBrew({ params: Promise.resolve({ brew: 'abc' }) })).rejects.toThrowError();
    await expect(PageBrew({ params: Promise.resolve({ brew: '9999' }) })).rejects.toThrowError();
  });
});
```
(`notFound()` de Next lève une erreur `NEXT_HTTP_ERROR_FALLBACK;404` — `rejects.toThrowError()` suffit.)

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/fiche.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/fiche.tsx` — transcription design lignes 81-180. Squelette complet :
```tsx
import Link from 'next/link';
import type { Beer } from '@/lib/schema';
import { abvTxt, num, rows, splitName } from '@/lib/domain';
import { labelProps } from '@/lib/label';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { Gauge } from '@/components/ds/Gauge';

const BACK = (
  <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--encre-2)' }}>
    <CuveeIcon name="ArrowLeft" size={16} />Toutes les bières
  </Link>
);

export function FicheIntrouvable() {
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,32px) 96px' }}>
      {BACK}
      <h1 style={{ margin: '48px 0 0', font: '400 56px/1 var(--font-display)', color: 'var(--encre)' }}>
        Bière <i style={{ color: 'var(--accent)' }}>introuvable</i>
      </h1>
      <p style={{ fontSize: 'var(--fs-lead)', color: 'var(--encre-2)' }}>Ce brassin n’est pas (ou plus) en ligne.</p>
    </main>
  );
}

export function Fiche({ beer, others }: { beer: Beer; others: Beer[] }) {
  const [first, second] = splitName(beer);
  const ac = beer.accent;
  const stats = [
    { label: 'Alcool', value: abvTxt(beer.abv), unit: '% vol.' },
    beer.ebc && { label: 'Couleur', value: beer.ebc, unit: 'EBC', gauge: <Gauge kind="ebc" value={num(beer.ebc) ?? 0} showLabel={false} /> },
    beer.ibu && { label: 'Amertume', value: beer.ibu, unit: 'IBU', gauge: <Gauge kind="ibu" value={num(beer.ibu) ?? 0} accent={ac} showLabel={false} /> },
    beer.og && { label: 'Densité initiale', value: beer.og, unit: 'DI' },
    beer.fg && { label: 'Densité finale', value: beer.fg, unit: 'DF' },
  ].filter(Boolean) as { label: string; value: string; unit: string; gauge?: React.ReactNode }[];
  const blocks = [
    { title: 'Malts & grains', icon: 'Wheat', rows: rows(beer.grains) },
    { title: 'Houblonnage', icon: 'Hop', rows: rows(beer.hopSchedule) },
    { title: 'Empâtage', icon: 'Thermometer', rows: rows(beer.mash) },
    { title: 'Fermentation · ' + (beer.yeast || 'levure'), icon: 'FlaskConical', rows: rows(beer.ferment) },
  ].filter(b => b.rows.length);
  const tasting = ([['Aspect', beer.look], ['Nez', beer.nose], ['Bouche', beer.mouth], ['Finale', beer.finish], ['Service', beer.serving]] as const)
    .filter(t => t[1] && t[1].trim());
  const descParas = beer.description.split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean);
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(20px,4vw,40px) clamp(16px,4vw,32px) 96px' }}>
      {BACK}
      {/* En-tête, h1, étiquette : design lignes 90-102 */}
      {/* Stats : lignes 104-114 — grille auto-fit minmax(130px,1fr), s.gauge rendu si présent */}
      {/* Histoire : lignes 116-123 si descParas.length */}
      {/* Recette : lignes 125-147 — volumeTxt = beer.volume ? `Pour ${beer.volume} litres` : '' */}
      {/* Mot du brasseur : lignes 149-154 si beer.notes */}
      {/* Dégustation : lignes 156-168 si tasting.length */}
      {/* Autres bières : lignes 170-178 avec others */}
    </main>
  );
}
```
Compléter les blocs commentés par la transcription 1:1 du design (mêmes styles inline, `hov-bottom` pour les liens « Autres bières », étiquette : `beer.labelImage` → `<img …>` sinon `<BeerLabel {...labelProps(beer, zoom)} />` avec `zoom = 1` dans un conteneur `overflow:hidden` — le `clamp` de zoom du prototype dépendait de `window`, en SSR on fixe `scale=1` et le conteneur centre/écrête comme lignes 95-102).

`src/app/biere/[id]/page.tsx` :
```tsx
import { notFound } from 'next/navigation';
import { desc, eq, ne } from 'drizzle-orm';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { Fiche } from '@/app/fiche';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ id: string }> };

function load(id: string) {
  const db = getDb();
  const beer = db.select().from(beers).where(eq(beers.id, id)).get();
  if (!beer) return null;
  const others = db.select().from(beers).where(ne(beers.id, id)).orderBy(desc(beers.brew)).limit(3).all();
  return { beer, others };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = load(id);
  if (!data) return { title: 'Bière introuvable' };
  const b = data.beer;
  const title = `${b.name}${b.edition ? ' ' + b.edition : ''}`;
  const description = `${b.styleName} · Brassin N° ${b.brew} · recette et fiche de dégustation.`;
  return { title, description, openGraph: { title, description } };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const data = load(id);
  if (!data) notFound();
  return <Fiche beer={data.beer} others={data.others} />;
}
```

`src/app/brassin/[brew]/page.tsx` — identique avec :
```tsx
const { brew } = await params;
if (!/^\d+$/.test(brew)) notFound();
const beer = db.select().from(beers).where(eq(beers.brew, Number(brew))).get();
```
(et `generateMetadata` équivalent ; factoriser le chargement dans `fiche.tsx` est permis : `loadByBrew`/`loadById` exportées depuis un petit `src/app/fiche-data.ts` si plus lisible.)

`not-found.tsx` (les deux segments) :
```tsx
import { FicheIntrouvable } from '@/app/fiche';
export default function NotFound() { return <FicheIntrouvable />; }
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/fiche.test.tsx && npm run build`
Expected: PASS + build OK.

- [ ] **Step 5: Commit**

```bash
git add src/app/fiche.tsx src/app/biere src/app/brassin tests/fiche.test.tsx
git commit -m "feat: fiche recette publique et route QR /brassin/<n°>"
```

---

### Task 12: Page de connexion + garde admin

**Files:**
- Create: `src/app/connexion/page.tsx`, `src/app/connexion/login-form.tsx`, `src/app/admin/layout.tsx`
- Test: `tests/connexion.test.tsx`

**Interfaces:**
- Consumes: `hasSession` (Task 6), `Button` (Task 4).
- Produces:
  - `/connexion` : si déjà connecté → `redirect('/admin')` ; sinon formulaire mot de passe (client) qui `POST /api/auth/login` puis `location.href = '/admin'` ; erreurs 401/429 affichées sous le champ en `var(--danger)`
  - `src/app/admin/layout.tsx` : serveur — `if (!(await hasSession())) redirect('/connexion')` ; enveloppe `/admin` et `/admin/planche`

- [ ] **Step 1: Write the failing test**

`tests/connexion.test.tsx` :
```tsx
// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from '@/app/connexion/login-form';

describe('LoginForm', () => {
  it('affiche l’erreur renvoyée par l’API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ error: 'Mot de passe incorrect.' }) }));
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'x' } });
    fireEvent.submit(screen.getByRole('button', { name: /Se connecter/i }).closest('form')!);
    await waitFor(() => expect(screen.getByText('Mot de passe incorrect.')).toBeTruthy());
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run test, verify failure**

Run: `npx vitest run tests/connexion.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/connexion/login-form.tsx` :
```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ds/Button';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { location.href = '/admin'; return; }
    const j = await res.json().catch(() => ({ error: 'Erreur inattendue.' }));
    setError(j.error || 'Erreur inattendue.');
    setBusy(false);
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ font: '600 11px var(--font-text)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--encre-2)' }}>Mot de passe</span>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus
          style={{ height: 42, padding: '0 12px', border: '1px solid var(--filet)', background: 'var(--papier)', font: '400 15px var(--font-text)', color: 'var(--encre)', outline: 0, borderRadius: 0 }} />
      </label>
      <div><Button variant="primary" disabled={busy}>Se connecter</Button></div>
      {error && <p style={{ margin: 0, font: '500 14px var(--font-text)', color: 'var(--danger)' }}>{error}</p>}
    </form>
  );
}
```

`src/app/connexion/page.tsx` :
```tsx
import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/session';
import { LoginForm } from './login-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Connexion' };

export default async function Connexion() {
  if (await hasSession()) redirect('/admin');
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,48px) 96px' }}>
      <div style={{ font: '600 12px var(--font-text)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>Backoffice</div>
      <h1 style={{ margin: '8px 0 24px', font: '400 clamp(44px,6vw,72px)/0.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
        Se <i style={{ color: 'var(--accent)' }}>connecter</i>
      </h1>
      <LoginForm />
    </main>
  );
}
```

`src/app/admin/layout.tsx` :
```tsx
import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasSession())) redirect('/connexion');
  return <>{children}</>;
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run tests/connexion.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/connexion src/app/admin/layout.tsx tests/connexion.test.tsx
git commit -m "feat: page de connexion et garde de session sur /admin"
```

---
### Task 13: Backoffice — table, formulaire, aperçu, QR

**Files:**
- Create: `src/app/admin/page.tsx`, `src/app/admin/admin-app.tsx`
- Test: `tests/admin.test.tsx`

**Interfaces:**
- Consumes: Tasks 2-7 ; `QrSvg`, `qrSvgString`, `brewUrl` (Task 5) ; `Button`, `BeerLabel` (Task 4).
- Produces: `AdminApp({initial, siteUrl}: {initial: Beer[]; siteUrl: string})` client component. Page serveur :
```tsx
import { desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';
import { AdminApp } from './admin-app';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Backoffice' };
export default function AdminPage() {
  const list = getDb().select().from(beers).orderBy(desc(beers.brew)).all();
  return <AdminApp initial={list} siteUrl={process.env.SITE_URL || 'https://www.brasseyutz.fr'} />;
}
```

- [ ] **Step 1: Write the failing tests**

`tests/admin.test.tsx` :
```tsx
// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AdminApp } from '@/app/admin/admin-app';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', ...b })) as Beer[];
const app = () => render(<AdminApp initial={beers} siteUrl="https://www.brasseyutz.fr" />);

describe('AdminApp', () => {
  it('table des brassins triée + formulaire « Nouvelle bière » avec brew = max+1', () => {
    app();
    expect(screen.getByText('Les', { exact: false })).toBeTruthy();
    const rows = screen.getAllByText(/^Voir$/);
    expect(rows).toHaveLength(6);
    expect((screen.getByLabelText(/N° de brassin/i) as HTMLInputElement).value).toBe('35');
  });
  it('Modifier pré-remplit le formulaire', () => {
    app();
    fireEvent.click(screen.getAllByText('Modifier')[0]);
    expect((screen.getByLabelText(/^Nom$/i) as HTMLInputElement).value).toBe('Dark Mode');
    expect(screen.getByText(/Modifier « Dark Mode »/)).toBeTruthy();
  });
  it('l’URL du QR suit le n° de brassin', () => {
    app();
    expect(screen.getByText('https://www.brasseyutz.fr/brassin/35')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/N° de brassin/i), { target: { value: '42' } });
    expect(screen.getByText('https://www.brasseyutz.fr/brassin/42')).toBeTruthy();
  });
  it('erreur client si champs requis vides', async () => {
    app();
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.getByText('Nom, style, n° de brassin et alcool sont obligatoires.')).toBeTruthy());
  });
  it('enregistre via POST et affiche « Enregistré »', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ ...beers[0], id: 'comet-ale', name: 'Comet Ale', brew: 35 }) });
    vi.stubGlobal('fetch', fetchMock);
    app();
    fireEvent.change(screen.getByLabelText(/^Nom$/i), { target: { value: 'Comet Ale' } });
    fireEvent.change(screen.getByLabelText(/^Style$/i), { target: { value: 'Pale Ale' } });
    fireEvent.change(screen.getByLabelText(/Alcool/i), { target: { value: '5,2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
    await waitFor(() => expect(screen.getByText(/Enregistré ·/)).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith('/api/beers', expect.objectContaining({ method: 'POST' }));
    vi.unstubAllGlobals();
  });
});
```
(Pour `getByLabelText`, chaque champ du formulaire est un `<label>` contenant le `<span>` intitulé et l'`<input>` — c'est déjà la structure du design.)

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/admin.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement `admin-app.tsx`**

Transcription du design lignes 184-338 + logique du prototype (lignes 440-664). Structure complète — le JSX détaillé de chaque section suit le design 1:1 :

```tsx
'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Beer } from '@/lib/schema';
import { abvTxt, lotFor, slug, splitName } from '@/lib/domain';
import { labelProps } from '@/lib/label';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { Button } from '@/components/ds/Button';
import { brewUrl, QrSvg, qrSvgString } from '@/lib/qr';

const ACCENTS: [string, string][] = [['Orange', 'var(--cuvee-orange)'], ['Houblon', 'var(--cuvee-houblon)'], ['Ocre', 'var(--cuvee-ocre)'], ['Framboise', 'var(--cuvee-framboise)'], ['Bleu', 'var(--cuvee-bleu)'], ['Violet', 'var(--cuvee-violet)'], ['Bordeaux', 'var(--cuvee-bordeaux)'], ['Malt', 'var(--cuvee-malt)']];
const ICONS: [string, string][] = [['Hop', 'Houblon'], ['Citrus', 'Agrume'], ['Zap', 'Éclair'], ['Cherry', 'Cerise'], ['Orbit', 'Orbite'], ['Leaf', 'Feuille'], ['Snowflake', 'Flocon'], ['SunMoon', 'Mode sombre'], ['Wheat', 'Épi'], ['Terminal', 'Terminal'], ['Bug', 'Bug'], ['Crown', 'Couronne']];

type Form = Record<FormKey, string>;
type FormKey = 'name' | 'edition' | 'styleName' | 'denomination' | 'brew' | 'abv' | 'ebc' | 'ibu' | 'bottle' | 'accent' | 'icon' | 'malts' | 'hops' | 'yeast' | 'other' | 'bottledOn' | 'bestBefore' | 'lot' | 'volume' | 'og' | 'fg' | 'grains' | 'hopSchedule' | 'mash' | 'ferment' | 'notes' | 'look' | 'nose' | 'mouth' | 'finish' | 'serving' | 'description' | 'labelImage';

function blank(beers: Beer[]): Form {
  const n = Math.max(0, ...beers.map(b => b.brew)) + 1;
  return { name: '', edition: '', styleName: '', denomination: '', brew: String(n), abv: '', ebc: '', ibu: '', bottle: '75cl', accent: 'var(--cuvee-orange)', icon: 'Hop', malts: '', hops: '', yeast: '', other: 'Eau, sucre', bottledOn: '', bestBefore: '', lot: '', volume: '20', og: '', fg: '', grains: '', hopSchedule: '', mash: '', ferment: '', notes: '', look: '', nose: '', mouth: '', finish: '', serving: '', description: '', labelImage: '' };
}
const toForm = (b: Beer): Form => ({ ...blank([]), ...Object.fromEntries(Object.entries(b).filter(([k]) => k in blank([])).map(([k, v]) => [k, String(v ?? '')])) as Partial<Form>, brew: String(b.brew) } as Form);

export function AdminApp({ initial, siteUrl }: { initial: Beer[]; siteUrl: string }) {
  const router = useRouter();
  const [beers, setBeers] = useState(initial);
  const [form, setForm] = useState<Form>(() => blank(initial));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [formError, setFormError] = useState('');
  const sorted = useMemo(() => [...beers].sort((a, b) => b.brew - a.brew), [beers]);
  const set = (k: FormKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value })); setSavedMsg('');
  };
  const previewId = editingId || slug(form.name + (form.edition ? ' ' + form.edition : ''));
  const previewUrl = brewUrl(siteUrl, form.brew || '');

  async function save() { /* … */ }
  async function del(b: Beer) { /* … */ }
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) { /* … */ }
  function startEdit(b: Beer) { setForm(toForm(b)); setEditingId(b.id); setSavedMsg(''); setFormError(''); }
  function startNew() { setForm(blank(beers)); setEditingId(null); setSavedMsg(''); setFormError(''); }
  function downloadQr() {
    const s = qrSvgString(previewUrl);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' }));
    a.download = 'qr-' + previewId + '.svg';
    document.body.appendChild(a); a.click(); a.remove();
  }
  /* … JSX : design lignes 184-338 … */
}
```

Corps des fonctions :
```tsx
async function save() {
  if (!form.name.trim() || !form.styleName.trim() || !form.brew.trim() || !form.abv.trim()) {
    setFormError('Nom, style, n° de brassin et alcool sont obligatoires.'); return;
  }
  const res = await fetch(editingId ? `/api/beers/${editingId}` : '/api/beers', {
    method: editingId ? 'PUT' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (res.status === 401) { location.href = '/connexion'; return; }
  const data = await res.json().catch(() => ({ error: 'Erreur inattendue.' }));
  if (!res.ok) { setFormError(data.error || 'Erreur inattendue.'); return; }
  setBeers(bs => bs.filter(b => b.id !== data.id).concat(data));
  setEditingId(data.id); setForm(toForm(data)); setFormError('');
  setSavedMsg('Enregistré · ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
  router.refresh();
}

async function del(b: Beer) {
  if (!confirm(`Supprimer « ${b.name} » ?`)) return;
  const res = await fetch(`/api/beers/${b.id}`, { method: 'DELETE' });
  if (res.status === 401) { location.href = '/connexion'; return; }
  if (!res.ok) return;
  setBeers(bs => bs.filter(x => x.id !== b.id));
  if (editingId === b.id) startNew();
  router.refresh();
}

async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const f = e.target.files?.[0]; e.target.value = '';
  if (!f) return;
  const fd = new FormData(); fd.set('file', f);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (res.status === 401) { location.href = '/connexion'; return; }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { setFormError(data.error || 'Image illisible.'); return; }
  setForm(fm => ({ ...fm, labelImage: data.path })); setSavedMsg('');
}
```

JSX — points de fidélité (le reste est la transcription directe) :
- En-tête : titre « Les *brassins* », boutons `Planche A4` (→ `<Link href="/admin/planche">` autour d'un `Button variant="outline"`) et `Nouvelle bière` (`onClick={startNew}`), plus deux petits boutons `Exporter` (`<a href="/api/export" download>` stylé outline sm) et `Importer` (input file caché acceptant `.json` : lit le fichier avec `FileReader`, `POST /api/import`, puis `location.reload()` si ok, sinon `setFormError`).
- Table : colonnes N° / Nom (`splitName`, 2e partie en `<i style={{color: r.accent}}>`) / Style / Embout. / actions `Voir` (`<Link href={'/biere/' + b.id}>`) · `Modifier` · `Suppr.` (couleur `var(--danger)`) ; ligne en cours d'édition sur fond `var(--papier-2)`.
- Formulaire : champs texte `labelInputs` = Nom, 2e ligne (option), Style, Dénomination (option), N° de brassin, Alcool % vol., EBC, IBU, Embouteillée le, DDM, Lot (placeholder `lotFor(form)`) ; selects Bouteille (75 cl / 33 cl long neck), Couleur de cuvée (ACCENTS), Icône (ICONS) ; textareas `labelTexts` = Malts (allergènes entre *astérisques*), Houblons, Levure, Autres ; section image (aperçu 96 px si `form.labelImage`, bouton « Charger une image » / « Remplacer l’image », « Retirer ») ; section Dégustation & histoire (Aspect/Nez/Bouche/Finale/Service + Histoire du brassin rows 5) ; section Recette (Volume (L), Densité initiale, Densité finale + textareas Malts & grains, Houblonnage, Empâtage, Fermentation, Le mot du brasseur) avec la phrase d'aide « Une ligne par élément, colonnes séparées par “|”. Exemple : Citra | 50 g | dry hop J3 ».
- Boutons bas : `Enregistrer` (primary, `onClick={save}`) / `Annuler` (outline, `onClick={startNew}`) ; `formError` en dessous.
- Aside sticky : aperçu `<BeerLabel {...labelProps(form, 0.9)} />` sur fond `var(--papier-2)` ; carte QR : `<div style={{width:148,height:148}}><QrSvg url={previewUrl}/></div>`, l'URL en mono cassable, boutons « Télécharger SVG » (`downloadQr`), « Planche A4 » (Link), « Voir la page » (`<Link href={'/biere/' + previewId}>` ghost).

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/admin.test.tsx && npm run build`
Expected: PASS + build OK.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin tests/admin.test.tsx
git commit -m "feat: backoffice complet (table, formulaire, aperçu étiquette, QR, export/import)"
```

---

### Task 14: Planche A4

**Files:**
- Create: `src/app/admin/planche/page.tsx`, `src/app/admin/planche/planche-app.tsx`
- Test: `tests/planche.test.tsx`

**Interfaces:**
- Consumes: Tasks 3, 4, 5.
- Produces: `PlancheApp({beers, siteUrl})` client. Page serveur identique au pattern du Task 13 (`dynamic`, metadata `Planche A4`), sous la garde `admin/layout.tsx`.

- [ ] **Step 1: Write the failing tests**

`tests/planche.test.tsx` :
```tsx
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PlancheApp } from '@/app/admin/planche/planche-app';
import { SEED } from '@/lib/seed';
import type { Beer } from '@/lib/schema';

const beers = SEED.map(b => ({ createdAt: 0, updatedAt: 0, edition: '', denomination: '', labelImage: '', ...b })) as Beer[];
const app = () => render(<PlancheApp beers={beers} siteUrl="https://www.brasseyutz.fr" />);

describe('PlancheApp', () => {
  it('4 emplacements pré-remplis avec le dernier brassin', () => {
    app();
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(4);
    selects.forEach(s => expect((s as HTMLSelectElement).value).toBe('dark-mode'));
  });
  it('un emplacement vide ne rend pas d’étiquette', () => {
    app();
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '' } });
    const sheet = document.querySelector('[data-sheet]')!;
    expect(sheet.querySelectorAll('[data-slot]')).toHaveLength(4);
  });
  it('cases Repères de coupe / QR / 100 % noir présentes et actives', () => {
    app();
    expect((screen.getByLabelText(/Repères de coupe/) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText(/QR code/) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText(/100 % noir/) as HTMLInputElement).checked).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/planche.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`planche-app.tsx` — transcription design lignes 342-394 + logique `measure`/`sheetSlots` (prototype lignes 470-479, 620-632). Structure :
```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Beer } from '@/lib/schema';
import { labelProps } from '@/lib/label';
import { BeerLabel } from '@/components/ds/BeerLabel';
import { Button } from '@/components/ds/Button';
import { CuveeIcon } from '@/components/ds/CuveeIcon';
import { brewUrl, QrStyled } from '@/lib/qr';

type Box = { l: number; t: number; w: number; h: number };

export function PlancheApp({ beers, siteUrl }: { beers: Beer[]; siteUrl: string }) {
  const sorted = [...beers].sort((a, b) => b.brew - a.brew);
  const first = sorted[0]?.id || '';
  const [slots, setSlots] = useState<string[]>(Array(4).fill(first));
  const [cut, setCut] = useState(true);
  const [qr, setQr] = useState(true);
  const [mono, setMono] = useState(false);
  const [qrBox, setQrBox] = useState<Box>({ l: 0, t: 7.3, w: 14, h: 11 });
  const [zoom, setZoom] = useState(1);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setZoom(Math.min(1, (Math.min(window.innerWidth, 1320) - 64) / 1123));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Mesure la cellule « Alc. » de la première étiquette pour y poser le QR (prototype lignes 471-479)
  useEffect(() => {
    const slot = sheetRef.current?.querySelector('[data-slot]');
    if (!slot) return;
    const cap = [...slot.querySelectorAll('div')].find(d => d.textContent === 'Alc.');
    if (!cap?.parentElement) return;
    const s = slot.getBoundingClientRect(), c = cap.parentElement.getBoundingClientRect();
    if (!s.width) return;
    const k = 140 / s.width, r = (v: number) => Math.round(v * k * 20) / 20;
    const box = { l: r(c.left - s.left), t: r(c.top - s.top), w: r(c.width), h: r(c.height) };
    if ((['l', 't', 'w', 'h'] as const).some(p => Math.abs(qrBox[p] - box[p]) > 0.06)) setQrBox(box);
  }, [slots, mono, qr, zoom, qrBox]);

  /* … JSX design lignes 342-394 … */
}
```
JSX — fidélité :
- Bloc `data-noprint` : retour `<Link href="/admin">` avec `ArrowLeft`, h1 « Planche *A4* », bouton `Imprimer` (`onClick={() => window.print()}`), phrase « A4 paysage, 4 étiquettes 140 × 75 mm. Imprimez à 100 % (taille réelle), sans marges. », 4 selects « Emplacement n » (option « Vide » + `N° <brew> · <name> <edition>`), 3 cases à cocher (`<label>` englobant pour `getByLabelText`).
- Feuille : `<div ref={sheetRef} data-sheet="1" style={{zoom, position:'relative', width:'297mm', height:'210mm', background:'var(--papier)', boxShadow:'var(--shadow-print)', display:'grid', gridTemplateColumns:'140mm 140mm', gridTemplateRows:'75mm 75mm', justifyContent:'center', alignContent:'center', margin:'0 auto'}}>`.
- Chaque slot : `<div data-slot="1" style={{position:'relative',width:'140mm',height:'75mm',overflow:'hidden'}}>` ; si bière : `<BeerLabel {...labelProps(b, 1, {print: true, monochrome: mono})} />` ; si `qr` : `<div style={{position:'absolute', left: qrBox.l+'mm', top: qrBox.t+'mm', width: qrBox.w+'mm', height: qrBox.h+'mm', background:'var(--papier)', display:'flex', alignItems:'center', justifyContent:'center', padding:'0.1mm'}}><QrStyled url={brewUrl(siteUrl, b.brew)} accent={mono ? 'var(--encre)' : b.accent} /></div>`.
- Repères de coupe si `cut` : le SVG du design lignes 388-390 tel quel.

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/planche.test.tsx && npm run build`
Expected: PASS + build OK.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/planche tests/planche.test.tsx
git commit -m "feat: planche A4 imprimable (4 étiquettes, repères, QR, 100 % noir)"
```

---

### Task 15: Mentions légales, sitemap, robots

**Files:**
- Create: `src/app/mentions-legales/page.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Test: `tests/legal-seo.test.tsx`

**Interfaces:**
- Consumes: Task 3.
- Produces: page `/mentions-legales` (spec §5, contenu LCEN) ; `sitemap.xml` (/, /mentions-legales, /biere/*, /brassin/*) ; `robots.txt` (tout autorisé sauf /admin et /connexion).

- [ ] **Step 1: Write the failing tests**

`tests/legal-seo.test.tsx` :
```tsx
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('mentions légales + seo', () => {
  it('page mentions légales : sections LCEN', async () => {
    const Page = (await import('@/app/mentions-legales/page')).default;
    render(<Page />);
    expect(screen.getByText('Éditeur')).toBeTruthy();
    expect(screen.getByText('Hébergeur')).toBeTruthy();
    expect(screen.getByText('Propriété intellectuelle')).toBeTruthy();
    expect(screen.getByText('Données personnelles')).toBeTruthy();
    expect(screen.getByText(/à titre non professionnel/)).toBeTruthy();
    expect(screen.getByText(/aucun traceur/i)).toBeTruthy();
    expect(screen.getByText(/à venir/)).toBeTruthy(); // hébergeur non renseigné
  });
  it('sitemap : accueil + fiches + brassins', async () => {
    const sitemap = (await import('@/app/sitemap')).default;
    const entries = await sitemap();
    const urls = entries.map(e => e.url);
    expect(urls).toContain('https://www.brasseyutz.fr');
    expect(urls).toContain('https://www.brasseyutz.fr/biere/hop-overflow');
    expect(urls).toContain('https://www.brasseyutz.fr/brassin/33');
    expect(urls).toContain('https://www.brasseyutz.fr/mentions-legales');
  });
  it('robots : /admin interdit', async () => {
    const robots = (await import('@/app/robots')).default;
    const r = robots();
    expect(JSON.stringify(r.rules)).toContain('/admin');
  });
});
```

- [ ] **Step 2: Run tests, verify failure**

Run: `npx vitest run tests/legal-seo.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement**

`src/app/mentions-legales/page.tsx` — serveur, contenu de la spec §5. Gabarit :
```tsx
export const metadata = { title: 'Mentions légales' };
const S = ({ t, children }: { t: string; children: React.ReactNode }) => (
  <section style={{ marginTop: 40 }}>
    <h2 style={{ margin: 0, paddingBottom: 10, borderBottom: '1px solid var(--encre)', font: '400 var(--fs-h3)/1.1 var(--font-display)', color: 'var(--encre)' }}>{t}</h2>
    <div style={{ marginTop: 14, maxWidth: 680, fontSize: 15, lineHeight: 1.6, color: 'var(--encre-2)' }}>{children}</div>
  </section>
);
export default function MentionsLegales() {
  const contact = process.env.CONTACT_EMAIL;
  const host = process.env.HOST_NAME;
  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,48px) 96px' }}>
      <h1 style={{ margin: 0, font: '400 clamp(44px,6vw,72px)/0.95 var(--font-display)', letterSpacing: '-0.02em', color: 'var(--encre)' }}>
        Mentions <i style={{ color: 'var(--accent)' }}>légales</i>
      </h1>
      <S t="Éditeur">
        <p>Site personnel édité à titre non professionnel (article 6-III-2 de la loi n° 2004-575 du 21 juin 2004, LCEN) — Brasse-Yutz, Yutz (Moselle). Directeur de la publication : l’éditeur du site.{contact ? <> Contact : {contact}.</> : null}</p>
      </S>
      <S t="Hébergeur">
        <p>{host ? `${host} — ${process.env.HOST_ADDRESS || ''} — ${process.env.HOST_PHONE || ''}` : 'Informations d’hébergement à venir.'}</p>
      </S>
      <S t="Propriété intellectuelle">
        <p>Les contenus de ce site — textes, recettes, identité visuelle, étiquettes — sont la propriété de Brasse-Yutz. Toute reproduction est soumise à accord préalable.</p>
      </S>
      <S t="Données personnelles">
        <p>Ce site ne collecte aucune donnée sur ses visiteurs : aucun traceur, aucune mesure d’audience, aucun compte visiteur. L’unique cookie est un cookie de session technique réservé à l’administration du site, exempté de consentement (délibération CNIL « cookies et autres traceurs »).</p>
      </S>
      <S t="Alcool">
        <p>L’abus d’alcool est dangereux pour la santé, à consommer avec modération. Ce site est purement informatif : les bières présentées sont brassées à titre amateur et ne sont pas destinées à la vente.</p>
      </S>
    </main>
  );
}
```

`src/app/sitemap.ts` :
```ts
import type { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { beers } from '@/lib/schema';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.SITE_URL || 'https://www.brasseyutz.fr').replace(/\/$/, '');
  const list = getDb().select().from(beers).all();
  return [
    { url: site },
    { url: site + '/mentions-legales' },
    ...list.flatMap(b => [{ url: `${site}/biere/${b.id}` }, { url: `${site}/brassin/${b.brew}` }]),
  ];
}
```

`src/app/robots.ts` :
```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = (process.env.SITE_URL || 'https://www.brasseyutz.fr').replace(/\/$/, '');
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/connexion', '/api'] }],
    sitemap: site + '/sitemap.xml',
  };
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run tests/legal-seo.test.tsx && npm run build`
Expected: PASS + build OK.

- [ ] **Step 5: Commit**

```bash
git add src/app/mentions-legales src/app/sitemap.ts src/app/robots.ts tests/legal-seo.test.tsx
git commit -m "feat: mentions légales LCEN, sitemap, robots"
```

---

### Task 16: Docker, README, vérification finale

**Files:**
- Create: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `README.md`

**Interfaces:**
- Consumes: tout.
- Produces: image conteneur autonome, documentation d'exploitation.

- [ ] **Step 1: Dockerfile + compose**

`Dockerfile` (Debian slim — better-sqlite3 et sharp ont des binaires précompilés glibc) :
```dockerfile
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 DATA_DIR=/data PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN mkdir -p /data && chown -R node:node /data /app
USER node
VOLUME /data
EXPOSE 3000
CMD ["node", "server.js"]
```

`.dockerignore` :
```
node_modules
.next
data
design
docs
.git
.env*
```

`docker-compose.yml` :
```yaml
services:
  brasseyutz:
    build: .
    ports:
      - "3000:3000"
    environment:
      SITE_URL: https://www.brasseyutz.fr
      SESSION_SECRET: ${SESSION_SECRET:?definir SESSION_SECRET dans .env}
      ADMIN_PASSWORD_HASH: ${ADMIN_PASSWORD_HASH:?definir ADMIN_PASSWORD_HASH dans .env}
      CONTACT_EMAIL: ${CONTACT_EMAIL:-}
      HOST_NAME: ${HOST_NAME:-}
      HOST_ADDRESS: ${HOST_ADDRESS:-}
      HOST_PHONE: ${HOST_PHONE:-}
    volumes:
      - brasseyutz-data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 3
volumes:
  brasseyutz-data:
```

- [ ] **Step 2: README.md**

Sections (en français) :
- **Brasse-Yutz — brasseyutz.fr** : une phrase, lien spec + design.
- **Développement** : `npm install`, `cp .env.example .env` (générer `SESSION_SECRET` : `openssl rand -hex 32` ; `ADMIN_PASSWORD_HASH` : `node scripts/hash-password.mjs 'mot-de-passe'`), `npm run dev`, `npm test`.
- **Données** : SQLite + uploads dans `DATA_DIR` (défaut `./data`), seed automatique, sauvegarde = copier le dossier (ou bouton Exporter du backoffice).
- **Docker** : `docker compose up -d --build` avec `.env` ; le volume `brasseyutz-data` porte tout l'état.
- **Mise en production** : derrière un reverse proxy TLS (Caddy/Traefik/nginx) qui transmet `X-Forwarded-For` (rate-limit login) ; cookie `Secure` activé par `NODE_ENV=production` → serveur exposé en HTTPS obligatoire ; `SITE_URL=https://www.brasseyutz.fr` détermine l'URL encodée dans les QR — **ne pas changer après impression d'étiquettes**.
- **Impression** : backoffice → Planche A4, imprimer à 100 % sans marges.

- [ ] **Step 3: Vérification complète**

Run: `npx vitest run && npm run build`
Expected: tous les tests PASS, build OK.
Run: `docker build -t brasseyutz . && docker run --rm -d -p 3001:3000 -e SESSION_SECRET=$(openssl rand -hex 32) -e ADMIN_PASSWORD_HASH='$2b$12$K9nRr…' --name by-test brasseyutz && sleep 3 && curl -sf http://localhost:3001/api/health && curl -sf http://localhost:3001/ | grep -q 'Toutes les' && curl -sf http://localhost:3001/brassin/33 | grep -qi 'overflow' && docker rm -f by-test`
(générer un vrai hash de test avec `node scripts/hash-password.mjs test`)
Expected: health OK, catalogue rendu, fiche QR rendue.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile docker-compose.yml .dockerignore README.md
git commit -m "feat: image Docker, compose et documentation d'exploitation"
```

---

## Ordre d'exécution et dépendances

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16.
Parallélisables si besoin : (5, 6) après 4 ; (8, 9) après 7 ; (10, 11) après 4+3 ; (13, 14) après 5+7+12.

## Vérifications visuelles (manuelles, après Task 16)

`npm run dev` puis comparer au prototype (`design/Brasse-Yutz Recettes.dc.html` ouvert dans un navigateur, il fonctionne en localStorage) :
- `/` : grille de cartes, étiquettes miniatures, recherche.
- `/biere/hop-overflow` : stats + jauges, blocs recette, dégustation.
- `/admin` : formulaire complet, aperçu étiquette qui suit la saisie, QR.
- `/admin/planche` : aperçu impression (Ctrl+P) — 4 étiquettes à taille réelle, QR posé sur la cellule « Alc. ».
