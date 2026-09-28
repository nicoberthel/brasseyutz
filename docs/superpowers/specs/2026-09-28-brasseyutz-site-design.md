# Brasse-Yutz — site brasseyutz.fr : spécification

Date : 2026-09-28 · Statut : validé en conversation, en attente de relecture écrite

## 1. Objet

Site public + backoffice pour la brasserie amateur **Brasse-Yutz** (Yutz, Moselle).
Chaque étiquette de bouteille porte un QR code qui mène à la fiche du brassin :
recette, chiffres, dégustation, mentions. Le backoffice permet de gérer les
brassins et d'imprimer les planches d'étiquettes A4.

Source de vérité visuelle : projet claude.ai/design « Site de recettes de bière
Brasse-Yutz » (`design/Brasse-Yutz Recettes.dc.html`, copie locale) + design
system « Brasserie de Basse-Yutz » (`design/_ds/…`, tokens + readme). Le rendu
final doit être fidèle à ce prototype.

## 2. Décisions actées

| Sujet | Décision |
|---|---|
| Hébergement | Inconnu à ce jour → app **portable Docker** (un conteneur), aucun service cloud propriétaire |
| Domaine / QR | **`https://www.brasseyutz.fr`** (sans tiret). QR imprimés : `https://www.brasseyutz.fr/brassin/<n°>` — définitif |
| Auth backoffice | Un seul admin, **mot de passe simple** (hash bcrypt), session cookie |
| Vérification d'âge | **Non** — site informatif, pas de vente |
| Langue | Français uniquement |

## 3. Stack

- **Next.js** (App Router, TypeScript), `output: 'standalone'`
- **SQLite** (fichier sur volume `/data/`) via **Drizzle ORM**
- **React** — les composants du design system sont portés depuis leurs sources
  `.jsx` (projet design-system claude.ai, récupérables via DesignSync) vers
  `components/ds/` : `BeerLabel`, `Gauge`, `IngredientGrid`, `LegalMentions`
  (+ `PictoSlot`), `CuveeIcon`, `Logo`/`LogoMark`/`Signature`, `Button`,
  `Badge`, `BeerCard`
- **Polices auto-hébergées** via `next/font/google` (téléchargées au build,
  servies par le site — conforme CNIL) : Instrument Serif (ital), Instrument
  Sans, IBM Plex Mono
- **Icônes** : `lucide-react` (remplace le CDN unpkg du prototype)
- **QR** : `qrcode-generator` (même lib que le prototype)
- **Images** : `sharp` côté serveur
- Tokens CSS repris tels quels (`tokens/colors|typography|spacing|base.css`)

## 4. Modèle de données

Table `beers` — un enregistrement par brassin :

| Champ | Type | Note |
|---|---|---|
| `id` | text PK | slug (`hop-overflow`), généré du nom + édition |
| `name`, `edition` | text | édition optionnelle (« 2025 », « Eph 5:18 ») |
| `styleName` | text | requis |
| `denomination` | text | optionnel, défaut affiché « Bière <style> » |
| `brew` | integer **unique** | n° de brassin, cible des QR |
| `abv` | text | virgule décimale (« 5,5 ») ; requis |
| `ebc`, `ibu` | text | optionnels |
| `bottle` | text | `75cl` \| `33cl` |
| `accent` | text | `var(--cuvee-*)` |
| `icon` | text | nom Lucide (Hop, Citrus, Zap…) |
| `malts`, `hops`, `yeast`, `other` | text | ingrédients étiquette ; allergènes entre `*astérisques*` |
| `bottledOn` | text | JJ/MM/AAAA |
| `bestBefore` | text | MM/AAAA (DDM) |
| `lot` | text | auto si vide : `L<AA><MM>-<brassin>` depuis `bottledOn` |
| `volume`, `og`, `fg` | text | recette |
| `grains`, `hopSchedule`, `mash`, `ferment` | text | multi-lignes, colonnes séparées par `\|` (« Citra \| 50 g \| dry hop J3 ») |
| `notes` | text | « le mot du brasseur » |
| `look`, `nose`, `mouth`, `finish`, `serving` | text | dégustation |
| `description` | text | « l'histoire du brassin », paragraphes par ligne vide |
| `labelImage` | text | chemin relatif dans `/data/uploads/`, vide = étiquette générée |
| `createdAt`, `updatedAt` | integer | timestamps |

**Seed** : au démarrage, si la table est vide, insertion des 6 bières réelles du
prototype (Dark Mode n° 34, Hop Overflow n° 33, Xmas 2025 n° 32, Paul n° 31,
Pils Électrique n° 30, Citra Xtra n° 26), avec leurs textes de dégustation.

## 5. Routes

### Public (SSR)
- `/` — catalogue : titre « Toutes les *bières* », recherche (filtre client sur
  nom, édition, style, dénomination, malts, houblons, levure, n°, lot —
  insensible aux accents), compteur, grille de cartes (étiquette générée
  `BeerLabel` ou image uploadée), tri par n° décroissant.
- `/biere/[id]` — fiche recette : en-tête style/n°/date, nom serif deux tons,
  étiquette, grille de stats (Alcool ; Couleur EBC + jauge ; Amertume IBU +
  jauge ; Densités initiale/finale — champs vides omis), « L'histoire du
  brassin » (si renseignée), « La recette » (blocs Malts & grains / Houblonnage /
  Empâtage / Fermentation · levure, lignes `a | b | c`, blocs vides omis),
  « Le mot du brasseur » (si renseigné), « La dégustation » (Aspect/Nez/Bouche/
  Finale/Service, lignes vides omises), « Autres bières » (3 suivantes).
- `/brassin/[brew]` — **cible QR** : même fiche, résolue par n° de brassin,
  rendue directement (pas de redirection — l'URL imprimée doit rester stable
  et s'afficher au premier aller-retour).
- 404 fiche : « Bière *introuvable* — Ce brassin n'est pas (ou plus) en ligne. »

### Admin (protégé)
- `/connexion` — formulaire mot de passe.
- `/admin` — table des brassins (N°, Nom, Style, Embout., actions
  Voir/Modifier/Suppr. avec confirmation) + formulaire complet (sections
  Étiquette / Ancienne étiquette image / Dégustation & histoire / Recette) +
  aperçu `BeerLabel` live + carte QR (URL affichée, téléchargement SVG,
  raccourcis Planche A4 / Voir la page). Validation : nom, style, n° de
  brassin, alcool obligatoires. Message « Enregistré · HH:MM ».
- `/admin/planche` — planche A4 paysage 297×210 mm, 4 emplacements 140×75 mm
  choisis par listes déroulantes, options : repères de coupe, QR (remplace le
  bloc « Alc. » au dos de l'étiquette), 100 % noir. Bouton Imprimer
  (`window.print()`, CSS `@page A4 landscape`, taille réelle). Zoom écran.

### API (route handlers)
- `POST /api/auth/login`, `POST /api/auth/logout` (rate-limit sur login)
- `GET/POST /api/beers`, `PUT/DELETE /api/beers/[id]`
- `POST /api/upload` — image étiquette : recadrage fond blanc, max 1600 px,
  JPEG qualité 85 (comportement du prototype), limite 10 Mo
- `GET /api/export` — JSON de tous les brassins ; `POST /api/import` — restaure
- Mutations protégées par la session ; lecture publique limitée à ce que les
  pages publiques affichent (la fiche expose déjà toute la recette — pas de
  champ privé à ce jour)

### Divers
- `sitemap.xml`, `robots.txt`, balises meta/OG par page
- Footer global : « Bière maison · Brasse-Yutz, Yutz » + « L'abus d'alcool est
  dangereux pour la santé, à consommer avec modération. »
- Page `/mentions-legales` — générique, conforme LCEN (loi 2004-575), liée
  depuis le footer :
  - **Éditeur** : site personnel édité à titre non professionnel — Brasse-Yutz,
    Yutz (Moselle) ; directeur de la publication : l'éditeur ; contact par
    e-mail (adresse à renseigner via env `CONTACT_EMAIL`).
  - **Hébergeur** : nom, adresse, téléphone — valeurs via env
    (`HOST_NAME`, `HOST_ADDRESS`, `HOST_PHONE`), affichées « à venir » tant
    que non renseignées (hébergeur pas encore choisi).
  - **Propriété intellectuelle** : contenus, recettes, identité visuelle ©
    Brasse-Yutz, reproduction soumise à accord.
  - **Données personnelles (RGPD)** : aucune collecte de données visiteurs,
    aucun traceur, aucune mesure d'audience ; unique cookie = session
    d'administration (cookie technique exempté de consentement, CNIL) ; pas
    de bannière cookies nécessaire.
  - **Alcool** : rappel santé (loi Évin) — « L'abus d'alcool est dangereux
    pour la santé » ; site informatif, aucune vente.

## 6. Auth

- Env : `ADMIN_PASSWORD_HASH` (bcrypt), `SESSION_SECRET` (≥ 32 o), `SITE_URL`.
- Login → cookie de session HttpOnly, Secure, SameSite=Lax, signé, durée 30 j.
- Middleware Next : `/admin/*` et mutations API exigent la session, sinon
  redirection `/connexion` (pages) ou 401 (API).
- Rate-limit login : 5 essais / 15 min / IP (en mémoire — un seul process).

## 7. Étiquettes, QR, impression

- `BeerLabel` 140×75 mm : dos fiche technique (jauges EBC/IBU, grille
  d'ingrédients, tableau légal DDM/lot, responsable + pictos Triman et « zéro
  alcool grossesse ») + face centrée (logo, signature, icône cuvée, nom deux
  lignes, trait couleur, bloc dénomination + TAV + volume dans le même champ
  visuel 50 mm). Mentions légales UE 1169/2011 : déjà résolues par le design
  system — porter sans modifier.
- Assets : `logo-brasse-yutz.svg`, `zero-alcool-grossesse-gris.svg`,
  `triman-gris.png` servis depuis `public/assets/`.
- QR planche : QR stylisé du prototype (œils en couleur de cuvée, icône houblon
  au centre, correction H) positionné sur le bloc « Alc. » mesuré au rendu.
  QR admin : SVG simple téléchargeable. Contenu : `SITE_URL + /brassin/<n°>`.
- Option `monochrome` (100 % noir) sur planche.

## 8. Erreurs et limites

- Validation serveur systématique (mêmes règles que le formulaire).
- Upload : type image requis, 10 Mo max, erreurs affichées (« Image illisible. »).
- Suppression : confirmation explicite.
- DB absente → créée + migrée + seedée au démarrage.
- Pas de multi-utilisateur, pas de brouillon/publication : tout brassin
  enregistré est public (comportement du prototype).

## 9. Tests

- **Vitest** (unitaires) : `lotFor` (`L2605-33`), `slug`, `split` du nom,
  parsing `rows` (`a | b | c`), normalisation recherche sans accents,
  validation formulaire.
- **Intégration** : API CRUD + auth (401 sans session, login/logout,
  rate-limit), export/import.
- **Smoke SSR** : `/`, `/biere/hop-overflow`, `/brassin/33` rendent les
  contenus attendus ; `/brassin/9999` → 404 stylée.

## 10. Déploiement

- `Dockerfile` multi-stage (node:22-alpine, build → standalone), utilisateur
  non-root, port 3000.
- Volume `/data` : `brasseyutz.sqlite` + `uploads/`.
- `docker-compose.yml` d'exemple avec healthcheck (`GET /api/health`).
- `.env.example` documenté ; script `scripts/hash-password.mjs` pour générer
  `ADMIN_PASSWORD_HASH`.
- `README.md` : lancement local, génération du mot de passe, déploiement
  (VPS/maison derrière reverse proxy TLS ; le HTTPS est du ressort du proxy).

## 11. Hors périmètre (YAGNI)

- Vente en ligne, comptes visiteurs, commentaires, newsletters
- Multi-langue, mode sombre écran
- Éditeur d'étiquettes complet du design system (`outils/editeur/`) — la
  planche A4 + le formulaire couvrent le besoin
- Migration automatique des données localStorage du prototype
