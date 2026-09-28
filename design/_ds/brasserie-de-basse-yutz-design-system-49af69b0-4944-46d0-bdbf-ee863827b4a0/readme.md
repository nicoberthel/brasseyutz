# Brasse-Yutz — Design System

Brasserie amateur (bière maison, sans existence légale) de Nicolas, à **Yutz (Moselle)** ; le brasseur est informaticien de métier. **Nom : Brasse-Yutz** — clin d'œil à Basse-Yutz (quartier et ancienne brasserie historique) : une lettre change et on comprend « on brasse ici ». Remplace l'ancien « Nouvelle Brasserie de Basse-Yutz » (trop long). Signature : Brasse-*Yutz* en serif, 2e partie en italique ; sous-titre « Bières maison ». Emblème : **Saint Nicolas** (prénom du brasseur + saint patron de la Lorraine), mitre à croix de Lorraine et **barbe en houblon**. Bières surtout houblonnées, numérotées par brassin.

**Ce système est une refonte**, pas un relevé de l'existant : identité plus moderne, épurée, professionnelle. Les anciennes étiquettes (`assets/reference/`) servent de contexte uniquement. Priorité : les **étiquettes** (imprimées soi-même, toutes mentions légales FR) ; ensuite site et flyers.

Direction retenue (issue de `explorations/`) : **grille fiche technique** (piste A) + **serif élégante, beaucoup d'air, face centrée** (piste C), sans bandes verticales, typo + illustration simple, fond papier sobre.

## Sources
- `uploads/neipa75.png`, `citra_xtra_75.png`, `pils_electrique_75.png`, `paul_75.png`, `xmas25_33.png` — anciennes étiquettes (→ `assets/reference/`).
- `uploads/logo_stNicolas.svg` — logo vectoriel (→ `assets/reference/logo-saint-nicolas-original.svg`, ancien ; redessiné en `assets/logo-brasse-yutz.svg`).
- Pas de code, pas de Figma, pas de fichiers de police.

## Index
- `styles.css` — imports uniquement → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`
- `guidelines/` — cartes de fondations (Colors, Type, Spacing, Brand)
- `components/core/` — Button, Badge, BeerCard
- `components/label/` — BeerLabel, IngredientGrid, Gauge, LegalMentions (+ PictoSlot), CuveeIcon, Logo
- `ui_kits/etiquettes/` — Atelier d'étiquettes (5 cuvées réelles, 75/33 cl, zone visible, N&B, checklist légale, planche A4 ×4)
- `templates/etiquette/` — template d'étiquette pour projets consommateurs
- `explorations/` — les 3 pistes de départ (A Stack, B Pop Houblon, C Maison), archivées
- `assets/` — `logo-brasse-yutz.svg`, `legal/zero-alcool-grossesse-gris.svg`, `reference/`
- `outils/editeur/` — **Éditeur d'étiquettes** autonome (hors Claude) : formulaire, pictos, PNG 300 dpi 75/33 cl, impression planche A4, sauvegarde .json ; version hors ligne `outils/Editeur etiquettes (hors ligne).html`
- `impressions/Planches A4.html` — planches prêtes à imprimer (Hop Overflow, Dark Mode)
- `assets/pictos/` — 44 pictos SVG réutilisables (trait 1,25, `currentColor`), aussi dans `outils/editeur/pictos.js`
- `SKILL.md` — compatible Agent Skills / Claude Code

## Components
- **Button** — primary (encre), outline, ghost, accent
- **Badge** — ink, outline, muted, accent
- **BeerCard** — carte bière catalogue/site (même langage que l'étiquette)
- **Logo** — Saint-Nicolas seul ou signature serif
- **CuveeIcon** — icône-illustration Lucide au trait fin (ajout intentionnel : wrapper du jeu d'icônes CDN)
- **Gauge** — 5 segments : EBC en teintes de bière, IBU en couleur de cuvée (EBC en dégradé en option)
- **IngredientGrid** — icônes Malts (Wheat) / Houblons (Hop) / Levure (FlaskConical) / Autres (Droplets), allergènes en évidence
- **LegalMentions** — DDM, lot, date d'embouteillage, responsable ; exporte `PictoSlot`
- **BeerLabel** — étiquette complète 140 × 75 mm

Tous les composants sont des créations (aucune bibliothèque source), dimensionnés aux besoins : étiquettes d'abord, web ensuite.

## Format d'étiquette — 140 × 75 mm, 75 cl et 33 cl long neck
- Un seul gabarit, une seule découpe ; 4 étiquettes par A4 paysage (2 × 2).
- 33 cl long neck (Ø ≈ 58–60 mm, partie droite ≈ 90 mm) : 75 mm de haut passent ; ~50 mm lisibles d'un coup d'œil. 75 cl (Ø ≈ 80 mm) : ~64 mm lisibles.
- **Dos 62 mm** = fiche technique : en-tête (style en couleur de cuvée · N° de brassin · date d'embouteillage) ; Alc. / Couleur (EBC + 5 segments teintes de bière + « Blonde…Noire ») / Amertume (IBU + 5 segments couleur de cuvée + « Légère…Extrême ») ; grille d'ingrédients à icônes (épi, cône, fiole, gouttes) ; tableau légal aligné (DDM, lot — valeurs mono à droite) ; responsable + pictos. **Face 78 mm** = centrée : logo, signature, icône, nom (le style n'est pas répété : il apparaît dans la dénomination), un trait couleur de cuvée 62 × 0,8 mm, puis **dénomination + TAV + volume sur 50 mm** (même champ visuel garanti même sur 33 cl).
- Séparation dos/face : un filet de 0,25 mm, pas de bande de couleur.

---

## CONTENT FUNDAMENTALS
- **Français** obligatoire sur l'étiquette ; termes de brassage anglais tels quels (NEIPA, Pale Ale, Citra).
- **Ton** : artisan, direct, précis, un peu geek. « Vous » dans les conseils. Pas de superlatifs marketing, pas de point d'exclamation, **pas d'emoji**.
- **Noms de cuvée** : jeux de mots, références informatiques (« Hop Overflow » ← stack overflow, « Pils Électrique » ← pile, « Raspberry Pils » ← Raspberry Pi — une sour framboise), houblons mis en avant (« Citra Xtra », « Comet Ale »), éditions (« Xmas *2025* », « Paul *Eph 5:18* »). Pas d'ancrage régional obligé.
- **Mise en forme du nom** : deux lignes, la 2e en *italique* couleur de cuvée. Casse normale (jamais tout en capitales).
- **Casse** : capitales espacées (+18 %) pour les intitulés courts (style, « Nouvelle brasserie de Basse-Yutz ») ; mono capitales pour les intitulés de grille (MALTS, HOUBLONS…).
- **Chiffres** : virgule décimale (« 5,5 % vol. »), espace avant % et unités (« 75 cl »), dates JJ/MM/AAAA, brassin « N° 33 », lot « L2605-33 » (AAMM + brassin).
- Humour bienvenu, léger : jeux de mots dans les noms et petites phrases, jamais au détriment des mentions légales.
- Exemples : « À consommer de préférence avant fin 05/2027 » · « Lot L2605-33 » · « Bière maison · Brasse-Yutz, Yutz ».

## Mentions légales (étiquette, France / règlement UE 1169/2011)
1. Dénomination : « Bière » + style (ex. « Bière NEIPA »).
2. TAV : « 5,0 % vol. » (tolérance ± 0,5).
3. Volume net : « 75 cl » — chiffres ≥ 4 mm (20–100 cl) ; on utilise 6,5 mm.
4. 1 + 2 + 3 dans le **même champ visuel** → bloc de 50 mm en bas de la face.
5. Allergènes mis en évidence (ORGE, BLÉ, AVOINE, SEIGLE… en gras capitales).
6. Nom + adresse du responsable — « Yutz » (compléter en cas de vente).
7. N° de lot. 8. DDM (obligatoire < 10 % vol.).
9. Pictogramme « Zéro alcool pendant la grossesse » — `assets/legal/zero-alcool-grossesse-gris.svg` (fourni) ; respecter la taille minimale de l'arrêté en vigueur.
10. Info-tri / Triman (verre, capsule) — `assets/legal/triman-gris.png` (fourni).
11. Lisible, indélébile : hauteur d'x ≥ 1,2 mm → corps ≥ 2,4 mm.
- Ingrédients et nutrition facultatifs > 1,2 % vol. (on garde les ingrédients ; l'eau est toujours citée).
- Bière non vendue : mentions non exigées, mais appliquées par défaut.

## VISUAL FOUNDATIONS
- **Impression maison d'abord** : fond **papier blanc sans encre**, une encre quasi noire `#161616`, **une** couleur de cuvée (« highlight ») en petites touches : style en tête du dos, qualificatifs Couleur/Amertume, segments IBU, icônes d'ingrédients, icône + mot italique + trait sur la face. Seul le dégradé EBC utilise d'autres couleurs (il représente la bière). Option 100 % noir (`monochrome`). Aucun aplat, aucun dégradé, aucune texture sur l'étiquette.
- **Couleurs de cuvée** (toutes ≥ 3:1 sur blanc) : orange `#D9480F`, houblon `#4F8A2B`, ocre `#A87B00`, framboise `#C2255C`, bleu `#1F63B0`, violet `#6A4BC4`, bordeaux `#8A1F2E`, malt `#5E3A22` (Dark Mode). Teintes `-soft` pour l'écran uniquement. Échelle EBC colorée : écran uniquement.
- **Type** : Instrument Serif (noms, grands chiffres Alc./EBC/IBU, volume) ; Instrument Sans (texte, capitales espacées) ; IBM Plex Mono (intitulés de grille, lots, dates).
- **Structure** : le dos est un **tableau** — filets 0,25 mm noirs pour les cadres, 0,15 mm gris pour les lignes internes. La face est **centrée et aérée**, avec beaucoup de blanc.
- **Illustration** : simple — icône Lucide au trait fin (1,1) dans la couleur de cuvée, ou illustration perso monotrait (`artwork`) dans le même esprit.
- **Angles** : vifs partout (radius 0). **Ombres** : aucune dans le design ; `--shadow-print` seulement pour mettre en scène une étiquette à l'écran.
- **Cartes (web)** : fond blanc, filet 1 px `--filet`, en-tête et pied en grille ; survol = filet qui passe en encre.
- **Boutons** : carrés, capitales espacées ; survol primaire = encre 2, outline s'inverse, ghost se souligne ; appui = 1 px vers le bas.
- **Animation** : minimale — transitions de couleur 120 ms, pas de rebond, pas de parallaxe.
- **Transparence / flou** : non utilisés.
- **Imagerie (web, plus tard)** : photos lumineuses, fond clair, naturelles, peu saturées ; jamais de photo sur l'étiquette.

## ICONOGRAPHY
- **Collection de pictos** : `assets/pictos/*.svg` (44, noms français : houblon, epi, levure, eau, agrume, cerise, lune, mode-sombre, flocon, eclair, terminal, bug, couronne…), extraits de Lucide, trait 1,25, `stroke="currentColor"` → prennent la couleur de cuvée (CSS `color`, ou remplacer `currentColor` par le hex dans Inkscape). Pour en ajouter : même grille 24 × 24, trait seul, pas de remplissage.
- **Lucide** via CDN (`unpkg.com/lucide@0.460.0`) — substitution, aucun jeu fourni. Trait fin (1,1–1,25), jamais rempli.
- Icônes de cuvée : Hop (Hop Overflow), Citrus (Citra Xtra), Zap (Pils Électrique), Cherry (Raspberry Pils), Orbit (Comet Ale), Leaf (Paul), Snowflake (Xmas), SunMoon (Dark Mode — l'icône « mode sombre »), Wheat (blanches).
- UI : icônes Lucide en encre (Printer, Plus, Minus, CircleCheck…).
- Pas d'emoji ; pas d'Unicode comme icône (sauf « · »).
- Pictogrammes réglementaires : **fichiers officiels** uniquement ; `PictoSlot` affiche un cadre pointillé tant qu'ils manquent. `assets/legal/triman.svg` fourni (original ; sur l'étiquette : `triman-gris.png` 1600 px gris encre-2, car le SVG source contient des masques rastérisés à basse résolution à l'impression ; grossesse : `zero-alcool-grossesse-gris.svg`) ; pictogramme « Zéro alcool pendant la grossesse » fourni : `assets/legal/zero-alcool-grossesse-gris.svg` (+ `.png`).
- Logo (2026, piste B4) : `assets/logo-brasse-yutz.svg` — mitre + barbe houblon en encre, croix de Lorraine fine découpée (transparente), anneau en orange highlight. Variantes `-noir.svg` (1 encre) et `-blanc.svg` (fond sombre). Signature : « Brasse-Yutz » en noir, trait d'union remplacé par un tiret épais orange centré optiquement. Taille mini conseillée 16 px / 6 mm. **Signature** (partout) : logo, puis BRASSE / filet de couleur / YUTZ en capitales justifiées à la même largeur, YUTZ plus grand (≈1,4×) — composant `Signature`. Sur l'étiquette, anneau et filet prennent la couleur de la cuvée ; ailleurs, orange marque.

## Polices
Aucun fichier fourni → Google Fonts : Instrument Serif, Instrument Sans, IBM Plex Mono (`tokens/fonts.css`).
