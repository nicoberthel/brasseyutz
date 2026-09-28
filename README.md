# Brasse-Yutz — brasseyutz.fr

Site public et backoffice de la brasserie amateur Brasse-Yutz (Yutz, Moselle) : catalogue des bières, fiche recette de chaque brassin (cible des QR codes imprimés sur les étiquettes), gestion des brassins et impression des planches d'étiquettes A4.

- Spécification : `docs/superpowers/specs/2026-09-28-brasseyutz-site-design.md`
- Maquette de référence : `design/Brasse-Yutz Recettes.dc.html` (+ design system `design/_ds/`)

## Développement

```bash
npm install
cp .env.example .env
# SESSION_SECRET : openssl rand -hex 32
# ADMIN_PASSWORD_HASH : node scripts/hash-password.mjs 'votre-mot-de-passe'
npm run dev      # http://localhost:3000
npm test         # suite Vitest
```

Le backoffice est sur `/admin` (mot de passe unique, cookie de session 30 jours).

## Données

- SQLite + images uploadées dans `DATA_DIR` (défaut `./data`), créés automatiquement.
- Base vide → les 6 bières réelles sont insérées (seed).
- Sauvegarde : copier le dossier `data/`, ou bouton **Exporter** du backoffice (JSON, restaurable via **Importer**).

## Docker

```bash
# .env avec SESSION_SECRET et ADMIN_PASSWORD_HASH (voir plus haut)
docker compose up -d --build
```

Tout l'état vit dans le volume `brasseyutz-data` (`/data` dans le conteneur).

## Mise en production

- Placer le conteneur derrière un reverse proxy TLS (Caddy, Traefik, nginx) qui transmet `X-Forwarded-For` (utilisé par le rate-limit de connexion).
- `NODE_ENV=production` active le cookie `Secure` → le site doit être servi en HTTPS.
- `SITE_URL=https://www.brasseyutz.fr` détermine l'URL encodée dans les QR codes. **Ne pas la changer après avoir imprimé des étiquettes** : les QR sur les bouteilles pointent vers `SITE_URL/brassin/<n°>`.

## Impression des étiquettes

Backoffice → **Planche A4** : 4 étiquettes 140 × 75 mm par feuille A4 paysage, repères de coupe, QR code posé sur le bloc « Alc. », option 100 % noir. Imprimer à 100 % (taille réelle), sans marges.
