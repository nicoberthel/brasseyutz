# Redesign du site + recettes structurées — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Passer le site public au ui-kit « Site Brasse-Yutz » (accueil, cuvées, fiche), structurer recette/dégustation en JSON, refaire la saisie backoffice, convertir l'export existant.

**Architecture:** Les 4 colonnes recette gardent leur nom mais contiennent du JSON ; un module pur `recipe.ts` (types + parse/sérialisation) et un module `recipe-legacy.ts` (ancien texte « a | b | c » → JSON) sont partagés par la validation API, la migration au démarrage et le script de conversion. Le site public est reconstruit à partir de composants `src/components/site/` et de classes CSS reprises du ui-kit dans `globals.css`. Le formulaire admin manipule un état typé et envoie du JSON.

**Tech Stack:** Next.js 15 App Router, React 19, SQLite + Drizzle + better-sqlite3, lucide-react, Vitest + Testing Library (jsdom), Node 22.

**Spec:** `docs/superpowers/specs/2026-10-26-redesign-site-design.md`

## Global Constraints

- URL publiques inchangées : `/`, `/biere/[id]`, `/brassin/[n]`, `/mentions-legales`, `/admin…`, `/connexion`, `/api/…`. Nouvelle route `/cuvees` uniquement.
- Français ; virgule décimale ; espace insécable (` `) avant les unités et dans « n° 34 » ; pas d'emoji, pas de point d'exclamation, angles doux sur le site public (`--radius-web-tile:20px; --radius-web-card:28px; --radius-web-hero:32px`).
- Fond de page blanc `--papier` ; surfaces `--papier-ecran`.
- Le ui-kit (`Brasserie de Basse-Yutz — Design System/ui_kits/site/`) prime sur toute valeur CSS ambiguë.
- Aucune donnée inventée : section/bloc/ligne vide ⇒ omis.
- Étiquette imprimée, planche A4, auth, upload : non touchés.
- `npm test` et `npm run build` verts à la fin de chaque tâche.
- Commits : message conventionnel en français, terminé par `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. Import d'un ancien export (chaînes « | ») après la migration : doit passer sans erreur et produire le même JSON que la migration → test dans Tâche 3.
2. Houblon à quantité non numérique (« 1 bâton », « 5 ») : pas de NaN dans le total, ligne affichée telle quelle → test dans Tâche 1 et Tâche 7.
3. Bière sans aucune donnée recette (brassins 7, 9, 13) : fiche sans section Recette ni Dégustation, pas de crash, pas de « 60 min » inventé → test dans Tâche 2 et Tâche 7.
4. Formulaire admin : une bière legacy chargée puis sauvegardée sans modification doit renvoyer un JSON équivalent (pas de perte) → test dans Tâche 8.
5. Radar partiellement saisi (ex. 7 valeurs) ou hors bornes : refusé en validation (stocké vide), jamais rendu à moitié → test dans Tâche 1 et Tâche 3.

---

### Task 1 : Types et parseurs de recette (`src/lib/recipe.ts`)

**Files:**
- Create: `src/lib/recipe.ts`
- Test: `tests/recipe.test.ts`

**Interfaces (Produces):**
```ts
export type HopStage = 'Ébullition' | 'Hopstand' | 'Dry hop' | 'Épices';
export const HOP_STAGES: HopStage[];
export type Grain = { nom: string; kg: number | null };
export type HopLine = { etape: HopStage; nom: string; qte: string; detail: string };
export type MashStep = { temp: number; min: number | null; label: string };
export type Mash = { eau: string; rincage: string; ebullitionMin: number | null; note: string; paliers: MashStep[] };
export type FermentStep = { temp: number; duree: string; label: string };
export type Ferment = { ensemencement: string; refermentation: string; paliers: FermentStep[] };
export type Radar = [number, number, number, number, number, number, number, number];
export const RADAR_AXES: readonly string[]; // 8 libellés §4.2
export type FamilleKey = 'houblonnee' | 'blonde' | 'belge' | 'blanche' | 'brune';
export const FAMILLES: { key: FamilleKey; label: string }[]; // ordre §4.1
export function familleOf(styleName: string): FamilleKey | '';
export function emptyMash(): Mash; export function emptyFerment(): Ferment;
export function isLegacyText(v: unknown): boolean; // chaîne non vide ne commençant pas par [ ou {
// Chaque parseXxx accepte objet/tableau, chaîne JSON ou '' ; renvoie null si vide ou invalide.
export function parseGrains(v: unknown): Grain[] | null;
export function parseHops(v: unknown): HopLine[] | null;
export function parseMash(v: unknown): Mash | null;   // null si tout vide (aucun palier/eau/rinçage/note/ebullitionMin)
export function parseFerment(v: unknown): Ferment | null;
export function parseRadar(v: unknown): Radar | null; // exactement 8 nombres 0–5, sinon null
export function toCol(v: unknown): string;            // JSON.stringify ou '' si null/undefined
export function grainsTotalKg(g: Grain[]): number | null; // null si aucun kg
export function hopsTotalG(h: HopLine[]): number;     // somme des qte « 40 g » / « 1,5 kg » hors Épices ; ignore le reste
export function mashMinutes(m: Mash): number;         // somme des min non null
export function fr(n: number, max = 1, min = 0): string; // toLocaleString fr-FR
export function nbsp(s: string): string;              // remplace « n° 34 », « 5,5 % », « 20 L », « 60 min », « 67 °C » : espace →  
```

- [ ] **Step 1 : tests** — `tests/recipe.test.ts` :
```ts
it('parseGrains accepte tableau, chaîne JSON, vide', ...)   // '' → null ; '[{"nom":"Pale Ale","kg":3}]' → [{nom:'Pale Ale',kg:3}] ; [{nom:'X'}] → [{nom:'X',kg:null}]
it('parseHops normalise etape inconnue → Ébullition, champs manquants → ""', ...)
it('parseMash : null si tout vide ; paliers typés', ...)   // {paliers:[{temp:'66',min:'60'}]} → temp 66, min 60, label ''
it('parseRadar : 8 nombres 0–5 sinon null', ...)           // [1,2,3,4,5,0,2.5,3] ok ; 7 valeurs → null ; [6,...] → null ; '' → null
it('hopsTotalG : 40 g + 1,5 kg + « 1 bâton » (Épices) = 1540', ...)
it('hopsTotalG ignore « 5 » sans unité', ...)
it('grainsTotalKg null si aucun kg', ...)
it('familleOf : IPA → houblonnee, Munich Dunkel → brune, Bière de Noël → brune, Blanche aux fruits → blanche, Triple Belge → belge, Pils → blonde, Micro IPA → houblonnee, inconnu → ""', ...)
it('nbsp insère l’insécable dans « n° 34 », « 5,5 % vol », « 60 min »', ...)
it('isLegacyText : "a | b" true, "[]" false, "" false', ...)
```
- [ ] **Step 2 : lancer** `npx vitest run tests/recipe.test.ts` → échec (module absent).
- [ ] **Step 3 : implémenter** `src/lib/recipe.ts` selon les signatures. `familleOf` : table de mots-clés §4.1, `norm()` de `domain.ts`, premier mot-clé trouvé dans l'ordre houblonnee → blonde → belge → blanche → brune (« Triple Belge » doit donner belge, « Blanche aux fruits » blanche, « Pale Ale » houblonnee).
- [ ] **Step 4 : lancer** → PASS.
- [ ] **Step 5 : commit** `feat(recette): types, parseurs et totaux de la recette structurée`.

---

### Task 2 : Conversion de l'ancien format (`src/lib/recipe-legacy.ts`)

**Files:**
- Create: `src/lib/recipe-legacy.ts`
- Test: `tests/recipe-legacy.test.ts`

**Interfaces:**
- Consumes: Task 1.
- Produces:
```ts
export type LegacyBeer = { grains?: string; hopSchedule?: string; mash?: string; ferment?: string; yeast?: string; other?: string; styleName?: string; serving?: string };
export function legacyGrains(t: string): Grain[] | null;
export function legacyHops(t: string): HopLine[] | null;
export function legacyMash(t: string, hops: HopLine[] | null): Mash | null;
export function legacyFerment(t: string, yeast: string, other: string): Ferment | null;
export function normalizeServing(s: string): string;      // '6°C.' → '6 °C' ; '8–10 °C' inchangé ; trim du point final
export function legacyToRecipe(b: LegacyBeer): { grains: Grain[] | null; hopSchedule: HopLine[] | null; mash: Mash | null; ferment: Ferment | null; famille: FamilleKey | ''; serving: string };
```

Règles = spec §6, plus : étape absente dans le houblonnage → déduite de la colonne détail (« whirlpool »/« hopstand » → Hopstand, « dry hop » → Dry hop, sinon Ébullition) ; première colonne de `ferment` non numérique (levure du seed) ignorée ; « 20 → 24 °C » → temp 20 ; `ebullitionMin` calculé seulement si le mash a un contenu (palier, eau, rinçage ou note).

- [ ] **Step 1 : tests** sur lignes réelles de `brasseyutz-export.json` :
```ts
it('grains : « Pale Ale | 3,5 Kg  » → 3.5 ; « 0,150 Kg » → 0.15 ; « 0,3 K » → 0.3 ; « Pale Ale | » → kg null', ...)
it('grains : « Seconde Filtration de la Triple Olympique » → [{nom, kg:null}]', ...)
it('hops Xmas 2025 : Gingembre/Clous de girofle/Cannelle/Écorce d’orange → Épices ; « Clous de girofle | 5 | 5 min | Hopstand » → qte "5"', ...)
it('hops : Whirlpool → Hopstand ; « Framboises surgelées | 1,5 kg | J5 | Fermentation » → Épices, detail "en fermentation · J5"', ...)
it('hops seed sans étape : « Citra | 40 g | whirlpool 80 °C » → Hopstand ; « dry hop J4 » → Dry hop', ...)
it('mash Xmas 2025 : « Empâtage | 65 °C | 60 min | 25,5 L » → eau "25,5 L", palier Saccharification 65/60 ; « Rinçage | 80 °C | 11 L » → rincage "11 L à 80 °C"', ...)
it('mash Pils #2 : Protéines → « Palier protéique », Mash-out conservé ; ebullitionMin 60 (Styrian 60 min)', ...)
it('mash Micro IPA : ligne sans température → note ; aucun palier', ...)
it('mash vide + houblons 60 min → null (pas de bloc inventé)', ...)
it('ferment : « 20 °C | 14 jours » → duree "14 j", label "Fermentation principale" ; « 4 °C | 3 jours | Cold Crush » → label "Cold crash" ; « 2 °C | 5 semaines » → "5 sem.", "Garde à froid" ; 2e palier 22 °C sans label → "Fin de fermentation"', ...)
it('ferment : ensemencement "1 sachet · US-05" ; refermentation "Sucre · 2 sem. à 20 °C" si other contient sucre, sinon ""', ...)
it('ferment seed « Verdant IPA | 19 °C | 10 jours » → levure ignorée, temp 19', ...)
it('normalizeServing', ...)
it('legacyToRecipe sur le brassin 13 Hoppy Birthday (recette vide, style Triple) → grains/hopSchedule/mash/ferment null, famille "belge"', ...)
```
- [ ] **Step 2 : lancer** → échec.
- [ ] **Step 3 : implémenter**. Parsing des lignes via `rows()` de `domain.ts` puis `split('|')` brut quand plus de 3 colonnes sont nécessaires.
- [ ] **Step 4 : lancer** → PASS.
- [ ] **Step 5 : commit** `feat(recette): conversion de l'ancien format texte vers le JSON`.

---

### Task 3 : Schéma, validation, migration, seed, export/import

**Files:**
- Modify: `src/lib/schema.ts` (ajout `famille`, `radar`), `src/lib/db.ts` (COLUMNS + `migrateRecipes()`), `src/lib/validate.ts`, `src/lib/seed.ts` (nouveau format), `src/app/api/export/route.ts`, `src/lib/domain.ts` (`matches` étendu)
- Test: `tests/db.test.ts`, `tests/export-import.test.ts`, `tests/beers-api.test.ts`, `tests/domain.test.ts`

**Interfaces:**
- Consumes: Tasks 1–2.
- Produces: `Beer` avec `famille: string`, `radar: string` ; `validateBeer` stocke JSON normalisé ; `export` renvoie objets ; `matches(b, q)` cherche aussi dans les noms de grains/houblons JSON ; `export function migrateRecipes(sqlite): void` dans `db.ts` (exportée pour test).

- [ ] **Step 1 : tests**
  - `db.test.ts` : `ajoute famille et radar à une base existante` ; `migration : base v1 avec grains/hopSchedule/mash/ferment en texte « | » → JSON valide et famille déduite, user_version = 2, second démarrage sans changement` (créer la base à la main avec le `CREATE TABLE` v1 + une ligne legacy Xmas 2025, puis `getDb()`) ; `seed : grains JSON parseable, famille renseignée`.
  - `export-import.test.ts` : `export : grains est un tableau, radar vide → ''` ; `import de l'ancien format (chaînes |) → même JSON que legacyToRecipe` ; `cycle export → import identique`.
  - `beers-api.test.ts` : `POST avec radar de 7 valeurs → stocké ''` ; `POST avec famille inconnue → ''` ; `PUT conserve le JSON envoyé comme objet`.
  - `domain.test.ts` : `matches trouve « nelson » via hopSchedule JSON`.
- [ ] **Step 2 : lancer** → échec.
- [ ] **Step 3 : implémenter** : `schema.ts` + `COLUMNS` ; `migrateRecipes` = si `PRAGMA user_version < 2` : pour chaque ligne, convertir les colonnes `isLegacyText` via Task 2, déduire `famille` si vide, normaliser `serving`, puis `PRAGMA user_version = 2`. `validateBeer` : pour chaque colonne recette, `isLegacyText` → `legacyXxx`, sinon `parseXxx` ; stocker `toCol(...)` ; `radar` via `parseRadar` ; `famille` filtrée par `FAMILLES`. Seed : réécrire les 6 bières au format JSON (`JSON.stringify` d'objets typés) avec `famille`. Export : map des lignes avec `JSON.parse` des 5 colonnes (ou `null`).
- [ ] **Step 4 : lancer** toute la suite → PASS (certains tests UI cassent encore : c'est attendu pour `fiche`, `admin`, `catalogue` qui seront réécrits ; les noter, ne pas les corriger ici).
- [ ] **Step 5 : commit** `feat(données): colonnes famille/radar, recette JSON, migration et import compatibles`.

---

### Task 4 : Script de conversion et fichier d'import

**Files:**
- Create: `scripts/convert-export.mjs`, `brasseyutz-import.json` (généré, commité)
- Modify: `src/lib/recipe.ts`, `src/lib/recipe-legacy.ts` (imports relatifs avec extension `.ts` pour Node strip-types), `tsconfig.json` (`"allowImportingTsExtensions": true`), `README.md` (section Données)
- Test: `tests/convert-script.test.ts`

- [ ] **Step 1 : test** : exécute `node scripts/convert-export.mjs brasseyutz-export.json <tmp>/out.json` via `child_process.execFileSync`, puis : 29 bières, `beers[0].grains` tableau de 5, Xmas 2025 a 4 lignes Épices, brassin 13 a `mash === null`, `radar === null` partout, `famille` renseignée pour les 29.
- [ ] **Step 2 : lancer** → échec.
- [ ] **Step 3 : implémenter** : script Node ESM, `import { legacyToRecipe } from '../src/lib/recipe-legacy.ts'` (Node 22 strip-types natif, pas de flag), lit l'entrée, écrit `{ exportedAt, convertedAt, beers }` avec les 5 colonnes en objets/null. Puis générer `brasseyutz-import.json` à la racine et le commiter. README : « Import : `brasseyutz-import.json` (nouveau format) ; les anciens exports restent importables. »
- [ ] **Step 4 : lancer** `npx vitest run tests/convert-script.test.ts` et `npm run build` → PASS.
- [ ] **Step 5 : commit** `feat: script de conversion de l'export et fichier d'import au nouveau format`.

---

### Task 5 : Gabarit commun — tokens, header, nav mobile, shell

**Files:**
- Modify: `src/app/globals.css` (tokens web, fond blanc, classes ui-kit : `.shell .top .navlink .bottom .page .hero .pill .h2 .link .tabs .tab .rail .tile .news .cards .card .mini .panel .search .cmd .photo-grid .photo .story .eyebrow .spec .figs .fig .gauges .gz .lbl .rec .blk .rows .row .bar .stage .steps .degus .notes .note .ni .serve .iconbtn` + media queries, copiées de `ui_kits/site/index.html`), `src/app/layout.tsx`, `src/app/nav-links.tsx` → remplacé par `src/components/site/Nav.tsx`
- Modify: `src/components/ds/CuveeIcon.tsx` (ajouter `Eye, Hourglass, Hash, Percent, Tag, House, ArrowRight, ChevronLeft, X, SlidersHorizontal, Thermometer`)
- Test: `tests/nav.test.tsx`, `tests/ds.test.tsx` (icônes)

**Interfaces (Produces):**
```tsx
// src/components/site/Nav.tsx ('use client')
export function TopNav(): JSX.Element;    // pastilles Accueil (/) et Cuvées (/cuvees) ; actif par usePathname : '/'→Accueil ; /cuvees, /biere/*, /brassin/* → Cuvées ; admin/connexion → aucun
export function BottomNav(): JSX.Element | null; // null sur /admin* et /connexion ; sinon <nav class="bottom"> 2 liens icône House/Beer + libellé
export function Shell({ children }): JSX.Element; // <div class="shell"> seulement si pathname public (ni /admin ni /connexion), sinon children tels quels
```
Layout : `<header class="top"><Link href="/"><SignatureH size={44}/></Link><TopNav/></header>` puis `<Shell>{children}</Shell>` puis footer existant puis `<BottomNav/>`. Supprimer le `borderBottom` orange.

- [ ] **Step 1 : tests** : `TopNav sur /biere/x : Cuvées actif (classe on)` ; `BottomNav null sur /admin` ; `Shell n'enveloppe pas /admin/planche` ; `CuveeIcon rend Eye, Hourglass, ArrowRight`.
- [ ] **Step 2 : lancer** → échec.
- [ ] **Step 3 : implémenter** (mock `next/navigation` `usePathname` dans les tests).
- [ ] **Step 4 : lancer** la suite + `npm run build` → PASS (hors tests UI en attente).
- [ ] **Step 5 : commit** `feat(site): gabarit ui-kit — tokens web, header pastilles, barre mobile`.

---

### Task 6 : Briques du site (`src/components/site/`)

**Files:**
- Create: `src/components/site/LabelThumb.tsx` ('use client'), `Search.tsx` ('use client'), `Tabs.tsx` ('use client'), `Cards.tsx` (CuveeTile, CuveeCard, CodeLink, PhotoCard, Empty, Stat), `Radar.tsx`, `Blk.tsx` (Blk, Steps, StageBadge)
- Delete: `src/app/label-zoom.tsx`, `tests/label-zoom.test.tsx`
- Test: `tests/site-parts.test.tsx`, `tests/radar.test.tsx`

**Interfaces (Produces):**
```tsx
export function soft(accent: string): string;                 // 'var(--cuvee-orange)' → 'var(--cuvee-orange-soft)'
export function LabelThumb({ beer, tilt = 0 }: { beer: Beer; tilt?: number }); // §5.4 ; img si beer.labelImage
export function Search({ value, onChange, onEnter, autoFocus }: {...});       // placeholder « Une bière, un style, un houblon… (Citra, NEIPA) », bouton X
export function Tabs({ value, onChange }: { value: FamilleKey | 'toutes'; onChange(v): void }); // « Toutes » + FAMILLES, role tablist/tab, aria-selected
export function CuveeTile({ beer }), CuveeCard({ beer }), PhotoCard({ beer }), CodeLink({ beer }), Empty({ q }), Stat({ icon, children })
export function Radar({ values, accent, size = 340 }: { values: Radar; accent: string; size?: number }); // SVG §5.3-5, axes = RADAR_AXES
export function Blk({ icon, title, meta, accent, children }), Steps({ rows: {temp:number; label:string; right:string}[]; accent }), StageBadge({ stage })
```
Liens : tuiles/cartes → `/biere/${id}` (`<Link>`), bouton CodeLink → `/biere/${id}`.

- [ ] **Step 1 : tests** :
  - `radar.test.tsx` : `rend 5 polygones de grille + 1 polygone rempli + 8 points` ; `aria-label contient « Amertume 2,5/5 »` ; `libellés et notes « 4,5/5 » présents`.
  - `site-parts.test.tsx` : `CuveeTile : nom, édition en <i>, « 5,5 % », style, lien /biere/hop-overflow` ; `CuveeCard : stats « 40 IBU », « Brassin 33 », bouton « Fiche de brassin », mini Couleur/Amertume omises si ebc/ibu vides` ; `LabelThumb avec labelImage rend <img>` ; `Tabs : 6 onglets, aria-selected sur l'actif` ; `Empty affiche « 404 — bière introuvable » et la requête` ; `StageBadge Dry hop fond encre`.
- [ ] **Step 2 : lancer** → échec.
- [ ] **Step 3 : implémenter** en reprenant `Parts.jsx`, `Cuvees.jsx`, `Home.jsx`, `Radar.jsx`, `Fiche.jsx` (Blk/Steps/STAGE). `LabelThumb` : `ResizeObserver` (guard `typeof ResizeObserver`), état initial 0.45, `BeerLabel {...labelProps(beer, scale)}` sans ombre print (`style` = ombre `--shadow-web`).
- [ ] **Step 4 : lancer** → PASS.
- [ ] **Step 5 : commit** `feat(site): briques ui-kit — étiquette fluide, recherche, onglets, cartes, radar, blocs`.

---

### Task 7 : Pages Accueil `/`, Cuvées `/cuvees`, Fiche

**Files:**
- Modify: `src/app/page.tsx`, `src/app/catalogue.tsx` → renommer `src/app/home.tsx` (`Home`), `src/app/fiche.tsx`, `src/app/fiche-data.ts` (others → 4), `src/app/sitemap.ts` (+ `/cuvees`), `src/app/biere/[id]/not-found.tsx`, `src/app/brassin/[brew]/not-found.tsx`, `src/app/mentions-legales/page.tsx`, `src/app/connexion/page.tsx` (conteneur 760 / inchangé)
- Create: `src/app/cuvees/page.tsx` (SSR, lit `searchParams.q`), `src/app/cuvees/cuvees.tsx` ('use client', `Cuvees({ beers, initialQuery })`)
- Test: `tests/home.test.tsx` (remplace `catalogue.test.tsx`), `tests/cuvees.test.tsx`, `tests/fiche.test.tsx` (réécrit), `tests/legal-seo.test.tsx` (sitemap `/cuvees`)

**Interfaces:**
- Consumes: Task 6, `parseXxx`/totaux Task 1, `nbsp`, `fr`.
- Produces: `Home({ beers })`, `Cuvees({ beers, initialQuery })`, `Fiche({ beer, others })`.

- [ ] **Step 1 : tests**
  - `home.test.tsx` : `hero : h1 « Des bières houblonnées, brassées », bouton « Voir les cuvées » → /cuvees` ; `rail : 6 tuiles, onglet Brunes & fêtes → 2 (Dark Mode, Xmas)` ; `recherche « electrique » filtre le rail à 1` ; `carte Dernier brassin · n° 34 → /biere/dark-mode avec « Mise en bouteille le 27/09/2026 »` ; `cœur conservé sur la tuile coup de cœur` (title « Coup de cœur »).
  - `cuvees.test.tsx` : `initialQuery « xyz » → « 404 — bière introuvable »` ; `6 cartes avec bouton « Fiche de brassin »` ; `liens /biere/<id>`.
  - `fiche.test.tsx` : `/biere/hop-overflow : nom, « NEIPA · brassin n° 33 », Alcool, Densité initiale « 1,050 », Volume « 20 L », Mise en bouteille, Malts & grains total « x,xx kg », badge Hopstand, palier « Saccharification », Fermentation meta « Verdant IPA », Aspect/Nez/Bouche/Finale, « Servir à », Les autres cuvées = 4` ; `/brassin/33 idem` ; `bière nue (sans recette, sans dégustation, sans histoire) : aucune section Recette/Dégustation/Histoire, pas de crash` ; `radar vide, notes présentes : pas de <svg role="img">, notes rendues` ; `radar présent : svg role img` ; `houblon « 1 bâton » affiché, total ne contient pas NaN` ; `notFound inchangé (404)` ; `description seule → carte mot omise ; notes seules → paragraphe omis`.
  - `legal-seo` : sitemap contient `/cuvees`.
- [ ] **Step 2 : lancer** → échec.
- [ ] **Step 3 : implémenter** selon spec §5.1–5.3 (classes CSS de Task 5, composants de Task 6). Fiche : parser les colonnes en haut (`parseGrains(beer.grains)` …), construire les figs filtrées, omettre blocs/sections vides ; citation `« {notes} »` avec insécables ; logo noir : copier `logo-brasse-yutz-noir.svg` du DS dans `public/assets/`. `cuvees/page.tsx` : `export const dynamic = 'force-dynamic'`, `searchParams` est une Promise en Next 15.
- [ ] **Step 4 : lancer** la suite + `npm run build` → PASS.
- [ ] **Step 5 : commit** `feat(site): accueil, cuvées et fiche au design ui-kit`.

---

### Task 8 : Formulaire backoffice restructuré

**Files:**
- Modify: `src/app/admin/biere/[id]/edit-form.tsx`
- Create: `src/app/admin/biere/[id]/recipe-fields.tsx` (`Rows` générique + 4 sous-blocs + `RadarFields`)
- Test: `tests/admin.test.tsx` (section EditForm réécrite), `tests/recipe-fields.test.tsx`

**Interfaces:**
```ts
type FormState = { /* champs texte existants sauf grains/hopSchedule/mash/ferment */ ; famille: string; grains: Grain[]; hopSchedule: HopLine[]; mash: Mash; ferment: Ferment; radar: Radar | null; noRadar: boolean };
export function Rows<T>({ rows, onChange, columns, blank }: { rows: T[]; onChange(rows: T[]): void; columns: { key: keyof T; label: string; type?: 'text'|'number'|'select'; options?: string[]; width?: string }[]; blank(): T }); // + Ajouter, supprimer, monter, descendre ; aria-label « Supprimer la ligne n », « Monter », « Descendre »
export function RadarFields({ value, onChange }: { value: Radar | null; onChange(v: Radar | null): void }); // 8 <input type=range min=0 max=5 step=0.5 aria-label=axe> + checkbox « Pas de radar »
```
Sérialisation à l'envoi : `{ ...texts, grains, hopSchedule, mash, ferment, radar: noRadar ? '' : radar }` (objets, l'API les accepte). `toForm(beer)` parse les colonnes (`parseXxx`, défauts `[]`/`emptyMash()`/`emptyFerment()`), `noRadar = radar === null`. `blank()` : recette par défaut spec §7 au nouveau format.

- [ ] **Step 1 : tests**
  - `recipe-fields.test.tsx` : `Rows : Ajouter crée une ligne blanche, Supprimer la retire, Descendre échange l'ordre` ; `RadarFields : cocher « Pas de radar » envoie null, décocher envoie [0×8]`.
  - `admin.test.tsx` : `nouvelle bière : 4 lignes de malts et 3 de houblons pré-remplies` (compter les inputs `aria-label="Nom du grain"` etc.) ; `édition d'une bière seed : select Famille = brune pour Dark Mode, curseurs radar absents si radar vide (case cochée)` ; `enregistrer envoie grains en tableau JSON` (inspecter `JSON.parse(fetchMock.mock.calls[0][1].body).grains`) ; `erreur client` et `Enregistré` conservés ; `bière legacy chargée puis sauvegardée sans modification → body.mash égal à parseMash(beer.mash)` (review focus 4).
- [ ] **Step 2 : lancer** → échec.
- [ ] **Step 3 : implémenter**. Garder styles de champs actuels (angles vifs). Ordre des sections : Étiquette (+ Famille) · Ancienne étiquette · Histoire & mot du brasseur · Recette · Dégustation (+ Radar).
- [ ] **Step 4 : lancer** la suite + `npm run build` → PASS.
- [ ] **Step 5 : commit** `feat(backoffice): saisie de la recette en lignes éditables, famille et radar`.

---

### Task 9 : Finitions, docs, vérification visuelle

**Files:**
- Modify: `README.md` (routes `/cuvees`, nouveau format, script), `docs/superpowers/specs/2026-09-28-brasseyutz-site-design.md` (note d'en-tête « remplacée par la spec du 2026-10-26 pour le site public et le modèle recette »)
- Vérifier : aucun import restant de `LabelZoom`/`Catalogue`/`nav-links`.

- [ ] **Step 1 :** `grep -rn "LabelZoom\|label-zoom\|catalogue\|nav-links" src tests` → vide.
- [ ] **Step 2 :** `npm test` → tout vert ; `npm run build` → OK.
- [ ] **Step 3 :** lancer `npm run dev` et vérifier à l'œil (desktop 1280 et mobile 390 via devtools, ou captures par le skill `run`) : `/`, `/cuvees?q=citra`, `/biere/hop-overflow`, `/brassin/32`, `/admin/biere/xmas-2025`. Points à contrôler : barre mobile visible, hero coin étiré, figs 2 colonnes mobile avec « Mise en bouteille » pleine largeur, badges d'étapes, radar, pas de scroll horizontal.
- [ ] **Step 4 :** corriger les écarts visuels constatés (CSS uniquement), relancer tests.
- [ ] **Step 5 : commit** `docs: README et spec à jour après le redesign`.
