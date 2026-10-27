# Brasse-Yutz — redesign du site (accueil, cuvées, fiche) + recettes structurées

Date : 2026-10-26 · Statut : validé par Nicolas le 2026-10-26 (conversation + builder-check)

## 1. Objet et pourquoi

Le site public passe au vocabulaire de forme « écran » du design system
(`Brasserie de Basse-Yutz — Design System/ui_kits/site/`) : coins doux, cartes
sur teinte douce de cuvée, nav en pastilles, barre flottante mobile. La fiche de
brassin gagne une recette lisible (barres de proportion, badges d'étape,
paliers en pastilles) et une dégustation avec graphique en toile d'araignée.

Pour cela, la recette passe d'un texte « a | b | c » à des données structurées.
La saisie backoffice est refaite en conséquence (lignes éditables).

Les étiquettes imprimées, la planche A4, l'auth, l'export/import, l'upload ne
changent pas de fonction. **Les URL ne changent pas** (QR imprimés) :
`/`, `/biere/[id]`, `/brassin/[n]`, `/mentions-legales`, `/admin…`,
`/connexion`, `/api/…`. Une route est ajoutée : `/cuvees`.

Source de vérité visuelle : `ui_kits/site/index.html` + `Parts.jsx`,
`Home.jsx`, `Cuvees.jsx`, `Fiche.jsx`, `Radar.jsx`. Les valeurs CSS ci-dessous
en sont tirées ; en cas de doute, le ui-kit prime.

## 2. Goals · non-goals · anti-goals

**Goals**
- Rendu fidèle au ui-kit « Site Brasse-Yutz » sur desktop (1280) et mobile (390).
- Fiche de brassin selon la spec en 6 points (§5.3).
- Recette et dégustation structurées, saisies ligne par ligne au backoffice.
- Fichier d'import converti depuis `brasseyutz-export.json` (29 brassins), avec
  déductions proposées pour ce que l'ancien format n'avait pas.
- Base existante migrée automatiquement au démarrage (pas de ré-import
  obligatoire en prod).

**Non-goals**
- Étiquette imprimée, planche A4, éditeur : inchangés.
- Pas de nouvelle fonctionnalité (pas d'accords mets-bières, pas de verre,
  pas de commentaires, pas de photos).
- Pas de refonte du backoffice au-delà du formulaire de saisie (la liste
  `/admin` garde sa structure ; elle hérite du nouveau header/footer).

**Anti-goals (échec même si « ça marche »)**
- Une URL de QR qui casse ou redirige.
- Une donnée de recette perdue à la migration (chaque ligne de l'ancien texte
  doit se retrouver quelque part dans la structure, au pire dans un champ
  texte libre).
- Un radar ou une dégustation inventés affichés comme vrais : si vide, masqué.
- Angles vifs / ton marketing / emoji / point d'exclamation.

## 3. Contraintes

- Stack inchangée : Next.js 15 App Router, React 19, SQLite + Drizzle,
  `lucide-react`, polices locales (`src/fonts`), tests Vitest + Testing Library.
- Tokens : ceux de `src/app/globals.css`, auxquels on ajoute
  `--radius-web-tile:20px; --radius-web-card:28px; --radius-web-hero:32px;
  --shadow-web:0 18px 40px -24px rgba(22,22,22,.18);
  --shadow-web-float:0 10px 30px -10px rgba(22,22,22,.22)`.
- Français, virgule décimale, espace insécable avant les unités et dans « n° 34 ».
- Icônes Lucide via `CuveeIcon` ; ajouter à son registre les icônes d'interface
  manquantes (`Eye`, `Hourglass`, `Hash`, `Percent`, `Tag`, `House`,
  `ArrowRight`, `ChevronLeft`, `X`, `SlidersHorizontal`…).

## 4. Modèle de données

Table `beers`, colonnes **inchangées** : identité, étiquette, `volume`, `og`,
`fg`, `look`, `nose`, `mouth`, `finish`, `serving`, `description` (histoire),
`notes` (mot du brasseur), `labelImage`, `artwork`, `favorite`, timestamps.

Colonnes dont le **contenu change** (même nom, texte → JSON) :

| Colonne | Contenu JSON |
|---|---|
| `grains` | `[{ nom: string, kg: number \| null }]` |
| `hopSchedule` | `[{ etape: 'Ébullition' \| 'Hopstand' \| 'Dry hop' \| 'Épices', nom: string, qte: string, detail: string }]` — `qte` texte libre (« 40 g », « 1 bâton », « 1,5 kg ») |
| `mash` | `{ eau: string, rincage: string, ebullitionMin: number \| null, note: string, paliers: [{ temp: number, min: number \| null, label: string }] }` |
| `ferment` | `{ ensemencement: string, refermentation: string, paliers: [{ temp: number, duree: string, label: string }] }` — `duree` texte (« 14 j », « 5 sem. ») |

Colonnes **nouvelles** :

| Colonne | Type | Contenu |
|---|---|---|
| `famille` | TEXT NOT NULL DEFAULT '' | une clé de la liste fermée §4.1, ou vide |
| `radar` | TEXT NOT NULL DEFAULT '' | JSON `[n×8]`, notes 0–5 (pas 0,5), ou vide = pas de radar |

La levure reste dans `yeast` (champ étiquette) ; la fiche l'affiche en meta du
bloc Fermentation.

### 4.1 Familles (liste fermée)

| Clé | Libellé | Styles rattachés à la conversion |
|---|---|---|
| `houblonnee` | Houblonnées | IPA, NEIPA, APA / American Pale Ale, Micro IPA, Pale Ale |
| `blonde` | Blondes | Pils, Lager, Blonde, Blond Ale, Golden |
| `belge` | Belges | Triple, Double, Belge |
| `blanche` | Blanches & fruits | Blanche, Blé / Wheat, fruits, Sour |
| `brune` | Brunes & fêtes | Dunkel, Brown, Noël, Stout, Porter, Ambrée |

Onglets : « Toutes » puis les 5 dans cet ordre. Une bière sans famille
n'apparaît que sous « Toutes ».

### 4.2 Axes du radar (constante partagée)

`Amertume, Épicé / floral, Fruité, Acidité, Corps, Douceur / sucré, Malté, Torréfié`,
dans l'ordre d'affichage : Amertume en haut, puis sens horaire. Les notes
stockées sont positionnelles (révision du 27/10/2026 : Épicé et Floral
fusionnés, Acidité ajoutée, Douceur renommée).

### 4.3 Validation (`validateBeer`)

- Les 4 colonnes recette acceptent : un objet/tableau JSON (formulaire, export
  nouveau format), une chaîne JSON, ou une chaîne « a | b | c » **legacy**
  (convertie via §6). Résultat stocké = chaîne JSON normalisée, ou `''` si vide.
- `radar` : tableau de 8 nombres 0–5, sinon `''`.
- `famille` : clé de la liste, sinon `''`.
- Obligatoires inchangés : nom, style, n° de brassin, alcool.

### 4.4 Export / import

- Export : les 4 colonnes recette + `radar` sortent en **objets JSON** (pas en
  chaînes). Format `{ exportedAt, beers: [...] }` inchangé.
- Import : accepte ce nouveau format et l'ancien (chaînes « | »), grâce à §4.3.

### 4.5 Migration de la base au démarrage

Dans `db.ts`, après l'ajout des colonnes manquantes : pour chaque bière dont
`grains`/`hopSchedule`/`mash`/`ferment` est non vide et ne commence pas par `[`
ou `{`, convertir via §6 et réécrire. La déduction de `famille` depuis le
style ne tourne qu'**une fois** (garde `PRAGMA user_version = 2`), pour que
le choix « — » du brasseur ne soit pas écrasé au redémarrage. Idempotent. Couvert par un test (base peuplée en ancien format →
démarrage → JSON valide, aucune ligne perdue).

Le seed (`seed.ts`) passe au nouveau format.

## 5. Site public

### 5.0 Gabarit commun (`layout.tsx`)

- Header et footer communs à tout le site (public, admin, connexion). Le
  `.shell` (largeur max 1120 px, padding `0 20px 120px`, mobile
  `0 16px 110px`) n'enveloppe que les **pages publiques** ; les pages admin
  (formulaire 1320 px, planche A4 297 mm) et la connexion gardent leur propre
  conteneur.
- **Header** : signature horizontale actuelle `SignatureH` (44 px, logo +
  BRASSE/filet/YUTZ, décision de Nicolas) à gauche, nav pastilles à droite
  (`Accueil`, `Cuvées` ; active = fond encre, texte papier ; survol
  `--papier-ecran`). Pas de filet orange sous le header (retiré). Sur
  `/biere/*` et `/brassin/*`, « Cuvées » est l'onglet actif. Sur `/admin*`
  et `/connexion`, aucun actif.
- **Barre flottante mobile** (≤ 760 px) : carte blanche fixée en bas
  (`left/right/bottom: 12px`, `--radius-web-card`, `--shadow-web-float`),
  deux boutons icône + libellé 11 px (`House` Accueil, `Beer` Cuvées), actif
  en `--accent` trait 2,2. Masquée sur `/admin*` et `/connexion`. La nav du
  header est masquée à cette largeur.
- **Footer** : inchangé (mentions légales, backoffice, modération). Marge basse
  suffisante pour ne pas passer sous la barre flottante.
- Fond de page **blanc** `--papier` (comme le ui-kit : ses surfaces sont en
  `--papier-ecran` et doivent se détacher), texte `--text-strong`. S'applique
  aussi aux pages admin et connexion.

### 5.1 Accueil `/`

Dans l'ordre, gap 32 px :

1. **Hero** orange plein (`--accent`), texte blanc, radius
   `32px 32px 120px 32px / 32px 32px 48px 32px` (coin bas-droit étiré),
   grille `1fr auto`, padding `22px 32px`. Colonne texte : surtitre capitales
   espacées « Brasserie maison · Yutz », h1 serif `clamp(32px,4.2vw,48px)`
   « Des bières houblonnées, brassées *à la maison.* », paragraphe 16 px
   « Petits brassins, essais, ratés et belles réussites : chaque cuvée a sa
   fiche technique complète. », bouton pastille blanche « Voir les cuvées »
   + `ArrowRight` → `/cuvees`. Colonne droite : rond blanc 180 px avec le logo
   Saint-Nicolas à 62 %. Mobile : une colonne, rond 120 px aligné à droite.
2. **Recherche** : champ doux (`--papier-ecran`, radius tile, hauteur 56,
   icône `Search`, placeholder « Une bière, un style, un houblon… (Citra,
   NEIPA) », bouton `X` pour vider). Entrée → `/cuvees?q=<texte>`. Le filtre
   s'applique aussi en direct au rail.
3. **Les cuvées** : titre h2 serif 40 px + lien « Tout voir » → `/cuvees` ;
   onglets de familles (texte 17 px, actif 600 + tiret arrondi noir 22×4
   sous le texte) ; **rail** horizontal (colonnes 300 px, gap 16, scroll
   sans barre) de tuiles `CuveeTile` : fond teinte douce de la cuvée, radius
   card, étiquette inclinée −2°, nom serif 30 px (édition en italique couleur),
   stats `Percent` « 5,5 % » et `Tag` style. Survol : translateY(−3px). Tri
   n° décroissant. Vide → bloc « 404 — bière introuvable » (§5.2).
4. **Dernier brassin** : carte horizontale sur teinte douce de la bière au n°
   le plus élevé : pastille blanche 56 px avec l'icône de cuvée, surtitre
   « Dernier brassin · n° 35 », nom serif 30 px + « — style » en italique
   couleur, « Mise en bouteille le JJ/MM/AAAA », bouton rond `ArrowRight`.
   Toute la carte est un lien vers la fiche.

### 5.2 Cuvées `/cuvees`

- Ligne de titre : chevron retour (→ `/`), « Cuvées » centré 18 px/600.
- Recherche (préremplie depuis `?q=`), onglets de familles, puis **grille**
  `repeat(auto-fill, minmax(min(100%,440px),1fr))` gap 18 de `CuveeCard` :
  fond teinte douce, radius card, padding 20. En-tête : pastille blanche 72 px
  (radius tile) avec icône de cuvée 36 px ; nom serif 30 px ; « style ·
  dénomination » 15 px ; stats `Percent` % vol · `Hop` IBU · `Hash` Brassin n.
  Puis l'étiquette à la largeur, puis deux `mini` (fond papier, radius tile) :
  « Couleur · 11 EBC » + `Gauge ebc`, « Amertume · 40 IBU » + `Gauge ibu`
  couleur de cuvée (mini omise si valeur vide). Puis, centré, le bouton
  `CodeLink` : pastille noire « Fiche de brassin » + rond de la couleur de
  cuvée avec `Beer` blanc (rotation −20° au survol).
- Vide : panneau `--papier-ecran` centré, mono « 404 — bière introuvable »,
  « Rien pour « q ». Essaie un houblon : Citra, Mosaïc, Fuggle… ».
- Recherche : `matches()` existant (nom, édition, style, dénomination,
  malts, houblons, levure, n°, lot, insensible aux accents) **+ les noms de
  grains et de houblons de la recette structurée**.

### 5.3 Fiche `/biere/[id]` et `/brassin/[n]`

Même composant `Fiche`. Ligne de retour (chevron → `/cuvees`). Puis, gap 32 :

1. **En-tête** centré : bloc `couleur_douce` radius hero, `min(100%,620px)`,
   padding `28px 20px`, contenant l'étiquette à la largeur (`LabelThumb`, ou
   `labelImage` si une image est chargée, même largeur max). Nom serif
   `clamp(44px,7vw,64px)` avec l'édition en italique couleur de cuvée ;
   dessous, 17 px `--text-body` : « Style · Dénomination · brassin n° 34 »
   (dénomination omise si vide ; `n°&nbsp;34`).
2. **Histoire + mot** (`.story`, grille 1.5fr/1fr, max 960 px, 1 colonne
   ≤ 760) : surtitre « L'histoire du brassin » + paragraphes 19 px/1.6
   (`description`, paragraphes séparés par ligne vide ou saut) ; carte
   « Le mot du brasseur » : `--papier-ecran`, radius card, `border-top: 4px`
   couleur de cuvée, citation serif italique 28 px entre « guillemets
   français », signature : petit logo noir (`/assets/logo-brasse-yutz-noir.svg`,
   22 px) + « Nicolas ». Si `description` vide : la carte seule ; si `notes`
   vide : le paragraphe seul ; les deux vides : section omise.
3. **Caractéristiques** (`.spec`, `--papier-ecran`, radius card) : rangée
   `.figs` de 5 colonnes séparées par filets verticaux, chaque `fig` =
   libellé 13 px + valeur serif `clamp(24px,2.6vw,34px)` + unité `small`.
   Alcool « 5,5 % vol » · Densité initiale « 1,050 » · Densité finale
   « 1,012 » (3 décimales, virgule) · Volume « 20 L » · Mise en bouteille
   « 27/09/2026 ». Une fig vide est omise (la grille se resserre). Sous un
   filet, `.gauges` : « Couleur **35 EBC** » + `Gauge ebc`, « Amertume
   **25 IBU** » + `Gauge ibu` couleur de cuvée (jauge omise si vide).
   Mobile (≤ 760) : figs sur 2 colonnes, « Mise en bouteille » sur toute la
   largeur, filets horizontaux.
4. **La recette** : h2 serif 40 px, puis grille 2×2 (1 colonne ≤ 900) de
   blocs `Blk` (`--papier-ecran`, radius card, padding 22) : en-tête icône
   dans pastille blanche 44 px (radius 14) + titre serif 28 px + meta mono
   13 px à droite.
   - **Malts & grains** (`Wheat`, meta = total kg « 4,80 kg ») : une `row.g`
     par grain : nom, barre de proportion (fond papier, remplissage couleur de
     cuvée, largeur = kg/total), « 3,00 kg » mono, « 62 % » mono gris. Grain
     sans kg : nom seul, pas de barre ni %. Total omis si aucun kg.
   - **Houblonnage** (`Hop`, meta = total g hors Épices « 245 g » ; somme des
     `qte` se terminant en g/kg) : une `row.h` par ligne : badge d'étape, nom
     + `detail` en dessous (mono 13 gris), `qte` mono à droite. Badges :
     Ébullition = blanc + filet ; Hopstand = `--papier-2` ; Dry hop = encre
     texte papier ; Épices = blanc + pointillé `--encre-3`.
   - **Empâtage** (`Thermometer`, meta = somme des `min` « 70 min ») :
     `row.kv` « Eau d'empâtage » / `eau` ; liste `.steps` de pastilles blanches
     (radius 14) « **67 °C** · Saccharification · 60 min » (température mono 17
     en couleur de cuvée, durée mono 14 à droite) ; `row.kv` « Rinçage » /
     `rincage` ; `row.kv` « Ébullition » / « 60 min » ; `row.kv` « Note » /
     `note`. Chaque ligne vide est omise.
   - **Fermentation** (`FlaskConical`, meta = `yeast`) : `row.kv`
     « Ensemencement » ; `.steps` « **18 °C** · Fermentation principale ·
     7 j » ; `row.kv` « Refermentation ». Lignes vides omises.
   - Un bloc sans aucune donnée est omis ; si les 4 sont vides, la section
     entière (titre compris) est omise.
5. **Dégustation** : h2, grille `1fr / 1.15fr` (1 colonne ≤ 900).
   - Gauche : bloc `--papier-ecran` centré avec `Radar` (SVG 340, 8 axes,
     notes 0–5) : 5 polygones concentrés trait `--filet` (le 5e à 1,4), 8
     rayons, polygone rempli couleur de cuvée à 20 %, contour 2,4, points
     r 4 blancs cerclés couleur. Libellés à l'extérieur (sans 12,5 px
     `--text-body`) avec « 4,5/5 » mono 11,5 dessous. `aria-label` qui
     énumère les notes.
   - Droite : bloc notes : 4 lignes `Eye` Aspect, `Flower2` Nez, `Droplets`
     Bouche, `Hourglass` Finale (icône dans pastille blanche 44, titre serif
     24, texte 15/1.5), séparées par filets ; lignes vides omises. Puis la
     pastille « `Thermometer` Servir à 6 °C » (depuis `serving`, omise si
     vide).
   - Radar vide → colonne radar omise, notes sur toute la largeur. Notes et
     service vides → colonne notes omise. Tout vide → section omise.
   - Pas d'accords mets-bières, pas de type de verre.
6. **Les autres cuvées** : h2, grille `auto-fill minmax(200px,1fr)` de 4
   cartes `.photo` (hauteur 230, radius 24, fond teinte douce) : étiquette
   inclinée −2° centrée, légende en bas : nom 18/600, `Percent` « 5 % ·
   style ». 4 bières = les 4 n° les plus élevés hors celle affichée.

404 : « Bière *introuvable* » conservée, restylée dans le nouveau shell.

`generateMetadata`, sitemap (ajout de `/cuvees`), robots : inchangés sinon.

### 5.4 Étiquette à l'écran (`LabelThumb`)

Composant client : `BeerLabel` mis à l'échelle de la largeur du conteneur
(`ResizeObserver`, `scale = clientWidth / 529.13`), ombre `--shadow-web`,
radius 4, inclinaison optionnelle. SSR à 0,45. Si `labelImage` est renseignée,
`<img>` à la largeur à la place, même ombre et inclinaison. Remplace
`LabelZoom`.

### 5.5 Mentions légales, connexion

Contenu inchangé. Mentions légales : dans le `.shell`, largeur max 760. Connexion : hors `.shell` (page privée), conteneur propre de 760 px.

## 6. Conversion de l'ancien format (`src/lib/recipe-legacy.ts`)

Fonction pure `legacyToRecipe(beer)` → `{ grains, hopSchedule, mash, ferment,
famille }`, utilisée par la migration (§4.5), la validation (§4.3) et le script
`scripts/convert-export.mjs` (entrée `brasseyutz-export.json`, sortie
`brasseyutz-import.json` au nouveau format, exécutable hors serveur). Règles :

**Grains** « nom | 3,5 Kg » → `{ nom, kg: 3.5 }` ; « 0,150 Kg » → 0.15 ;
« 0,3 K » → 0.3 ; quantité absente ou non numérique → `kg: null`, le texte
restant va dans `nom`.

**Houblonnage** « nom | qte | durée | étape » :
- étape : `Ébullition`/`Ébulition` → Ébullition ; `Hopstand`, `Whirlpool` →
  Hopstand ; `Dry hop`/`Dry Hop` → Dry hop ; `Fermentation` → Épices avec
  `detail` préfixé « en fermentation · » ; étape absente → Ébullition.
- nom ∈ épices (gingembre, cannelle, girofle, orange, coriandre, framboise,
  mangue, ananas, zeste, écorce, poivre, vanille, sucre) → Épices quelle que
  soit l'étape, `detail` = durée d'origine.
- `qte` : texte tel quel (« 15 g », « 1 bâton », « 5 » → « 5 », « 1,5 kg »).
- `detail` : la durée (« 60 min », « J5 », « 3 jours »).

**Empâtage** lignes « label | temp | durée | eau » :
- `Rinçage | 80 °C | 11 L` → `rincage = "11 L à 80 °C"` (ou « 80 °C » seul).
- Autre ligne → palier `{ temp, min, label }` ; `label` : « Empâtage » →
  « Saccharification » ; « Mash-out »/« Mash out » → « Mash-out » ;
  « Protéines » → « Palier protéique » ; autre libellé conservé ; libellé vide
  → selon temp : ≤ 55 → « Palier protéique », ≥ 75 → « Mash-out », sinon
  « Saccharification ». Une 4e colonne en L → `eau`.
- Ligne sans température (ex. « Seconde filtration de la Triple Olympique »)
  → `note`.
- `ebullitionMin` = max des durées en min des lignes Ébullition du
  houblonnage ; 60 si aucune. **Uniquement si l'empâtage a au moins un palier,
  une eau, un rinçage ou une note** : une bière sans donnée d'empâtage garde
  `mash` vide (pas de bloc inventé). Même logique pour les autres colonnes :
  une colonne legacy vide reste vide.

**Fermentation** lignes « temp | durée | label » (ou « levure | temp | durée »
du seed : première colonne non numérique = levure, ignorée) :
- palier `{ temp, duree, label }` ; `duree` : « 14 jours » → « 14 j »,
  « 5 semaines » → « 5 sem. » ; `label` vide → 1er palier « Fermentation
  principale », temp ≤ 5 → « Garde à froid », sinon « Fin de fermentation » ;
  « Cold crash »/« Cold Crush » → « Cold crash ».
- `ensemencement` = « 1 sachet · <yeast> » si `yeast` non vide, sinon « ».
- `refermentation` = « Sucre · 2 sem. à 20 °C » si `other` contient
  « sucre », sinon « » (déduction : le brasseur corrigera).

**Famille** : déduite de `styleName` par la table §4.1 (insensible à la
casse/accents, premier mot-clé trouvé) ; sinon « ».

**Service** : `serving` normalisé en passant : « 6°C. » → « 6 °C », « 8–10 °C »
conservé.

Toutes ces règles sont couvertes par des tests unitaires sur des lignes
réelles de l'export (Xmas 2025, Micro IPA, Raspberry Pils, Pils Électrique #2,
Cascade 22).

## 7. Backoffice — formulaire `/admin/biere/[id]`

Même page, mêmes actions (enregistrer, supprimer, QR, planche, voir la page),
même aperçu d'étiquette en colonne droite. La colonne gauche est réorganisée :

1. **Étiquette** — inchangé + un select **Famille** (liste §4.1, option
   « — »).
2. **Ancienne étiquette (image)** — inchangé.
3. **Histoire & mot du brasseur** — `description` (textarea 5 lignes),
   `notes` (textarea 2 lignes).
4. **Recette** — `volume`, `og`, `fg` (inputs mono), puis quatre
   sous-blocs à **lignes éditables** (composant `Rows` générique : liste
   d'inputs en grille, boutons « + Ajouter », supprimer par ligne, monter /
   descendre) :
   - Malts & grains : nom · kg (nombre, virgule acceptée).
   - Houblonnage : étape (select 4 valeurs) · nom · quantité · détail.
   - Empâtage : eau d'empâtage · paliers (temp °C · min · libellé) · rinçage ·
     ébullition (min) · note.
   - Fermentation : ensemencement · paliers (temp °C · durée · libellé) ·
     refermentation.
5. **Dégustation** — Aspect, Nez, Bouche, Finale (textareas), Service
   (input), puis **Radar** : 8 curseurs `range` 0–5 pas 0,5 avec la valeur
   affichée, et une case « Pas de radar » (vide le champ). Le radar est
   envoyé vide tant que la case est cochée.

État du formulaire : un objet typé (`FormState`) ; sérialisé en JSON pour
`POST/PUT /api/beers`. Le `blank()` d'une nouvelle bière propose la recette
par défaut actuelle (Pale Ale/Pilsen/Malt de blé/Flocons, 3 Citra, empâtage
65 °C 60 min, fermentation 20 °C 14 j) au nouveau format.

Style des champs : inchangé (angles vifs, filets) — le backoffice n'est pas
dans le périmètre visuel.

## 8. Tests

- Mettre à jour `fiche.test.tsx`, `catalogue.test.tsx` (→ accueil + cuvées),
  `admin.test.tsx`, `export-import.test.ts`, `db.test.ts`, `domain.test.ts`
  aux nouveaux libellés et structures.
- Nouveaux : `recipe-legacy.test.ts` (§6), `radar.test.tsx` (SVG, aria,
  omission si vide), `famille.test.ts`, migration au démarrage (§4.5),
  `/cuvees?q=` préremplit la recherche, sections omises quand vides.
- `npm test` et `npm run build` verts.

## 9. Laissé au builder

- Découpage en composants et fichiers (suggestion : `src/components/site/`
  pour TopNav, BottomNav, Search, Tabs, CuveeTile, CuveeCard, CodeLink,
  LabelThumb, Radar, Blk, Steps ; CSS dans `globals.css` avec les classes du
  ui-kit).
- Gestion client/serveur : pages SSR, filtres (recherche, onglets) en client
  component.
- Détails d'accessibilité (rôles tablist/tab, aria-selected, focus visible).
- Ordre des commits.

## 10. Décisions prises par Claude (à vérifier par Nicolas)

- Mêmes noms de colonnes, contenu passé en JSON, avec migration automatique
  au démarrage (évite un ré-import en prod ; l'import reste accepté en ancien
  et nouveau format).
- `qte` de houblon en texte libre plutôt qu'en nombre (bâtons, clous, kg de
  fruits) ; le total ne somme que les valeurs en g/kg.
- Fruits en fermentation (framboises) rangés en « Épices », avec détail « en
  fermentation ».
- Refermentation déduite « Sucre · 2 sem. à 20 °C » quand `other` mentionne
  le sucre.
- 5 familles (ajout de « Belges » et « Blanches & fruits » aux 3 du ui-kit).
- « Les autres cuvées » = 4 derniers n° hors la fiche courante.
- Header orange supprimé au profit du header pastilles du ui-kit, y compris
  sur les pages admin.
- Fond de page blanc (ui-kit) et non `--papier-ecran` (état actuel).
- `.shell` réservé aux pages publiques ; admin et planche gardent leur largeur.
- Déduction de famille une seule fois (`user_version`), pas à chaque démarrage.
- Pas de bloc Empâtage synthétisé quand l'ancien format n'en avait aucun.
