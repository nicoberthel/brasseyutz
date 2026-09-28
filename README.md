# Brasse-Yutz — brasseyutz.fr

Site public et backoffice de la brasserie amateur Brasse-Yutz (Yutz, Moselle) : catalogue des bières, fiche recette de chaque brassin (cible des QR codes imprimés sur les étiquettes), gestion des brassins et impression des planches d'étiquettes A4.

- Dépôt : https://github.com/nicoberthel/brasseyutz
- Spécification : `docs/superpowers/specs/2026-09-28-brasseyutz-site-design.md`
- Maquette de référence : `design/Brasse-Yutz Recettes.dc.html` (+ design system `design/_ds/`)

## Développement

```bash
npm install
cp .env.example .env
# SESSION_SECRET : openssl rand -hex 32
# ADMIN_PASSWORD_HASH : node scripts/hash-password.mjs 'votre-mot-de-passe'
#   (format scrypt:… sans $, collable tel quel dans .env)
npm run dev      # http://localhost:3000
npm test         # suite Vitest
```

Le backoffice est sur `/admin` (mot de passe unique, cookie de session 30 jours). Lien discret dans le footer.

## Données

- SQLite + fichiers uploadés (images d'étiquettes, SVG perso) dans `DATA_DIR` (défaut `./data`), créés et migrés automatiquement au démarrage.
- Base vide → les 6 bières réelles sont insérées (seed).
- Sauvegarde : copier le dossier `data/` (ou le volume Docker), plus le bouton **Exporter** du backoffice (JSON des recettes, restaurable via **Importer** — n'emporte pas les images uploadées).

## Production — serveur maison + Nginx Proxy Manager

Architecture retenue : l'app tourne en Docker sur le serveur maison et expose le port **3000** ; **Nginx Proxy Manager (NPM)** porte le TLS et proxifie `www.brasseyutz.fr` vers l'app.

### 1. Prérequis réseau

- Box : ports **80** et **443** redirigés vers la machine qui héberge NPM.
- DNS chez le registrar : `A www.brasseyutz.fr → IP publique` et `A brasseyutz.fr → IP publique` (IP dynamique → enregistrement DynDNS).

### 2. Déployer l'app

```bash
git clone https://github.com/nicoberthel/brasseyutz.git
cd brasseyutz
cat > .env <<EOF
SESSION_SECRET=$(openssl rand -hex 32)
ADMIN_PASSWORD_HASH=<sortie de : node scripts/hash-password.mjs 'votre-mot-de-passe'>
CONTACT_EMAIL=
HOST_NAME=Site auto-hébergé par l'éditeur
HOST_ADDRESS=Yutz (Moselle)
HOST_PHONE=
EOF
docker compose up -d --build
curl -sf http://localhost:3000/api/health   # {"ok":true}
```

Tout l'état (SQLite + uploads) vit dans le volume `brasseyutz-data`.

### 3. Proxy host dans Nginx Proxy Manager

- **Domain Names** : `www.brasseyutz.fr`
- **Scheme/Forward** : `http` → IP du serveur app (ou `host.docker.internal` / IP LAN) port `3000`
- **SSL** : certificat Let's Encrypt via NPM, **Force SSL** activé
- **Websockets Support** : inutile (pas de websocket)
- NPM transmet `X-Forwarded-For` par défaut — requis par le rate-limit de connexion.
- Second proxy host `brasseyutz.fr` → redirection 301 vers `https://www.brasseyutz.fr`.

### 4. Vérifications après mise en ligne

- `https://www.brasseyutz.fr/api/health` → `{"ok":true}`
- Connexion au backoffice (`/connexion`)
- **Scanner un QR de test** vers `https://www.brasseyutz.fr/brassin/33` depuis un téléphone (4G, pas le wifi local) — c'est le contrat des étiquettes imprimées.

### 5. Exploitation

- **Mise à jour** :
  ```bash
  cd brasseyutz && git pull && docker compose up -d --build
  ```
- **Sauvegarde** (cron conseillé) :
  ```bash
  docker run --rm -v brasseyutz-data:/data -v "$HOME/backups:/b" alpine tar czf /b/brasseyutz-$(date +%F).tgz /data
  ```
- **`SITE_URL`** (défaut `https://www.brasseyutz.fr`) détermine l'URL encodée dans les QR — **ne jamais la changer après avoir imprimé des étiquettes**.
- `NODE_ENV=production` active le cookie `Secure` → le backoffice n'est utilisable qu'en HTTPS (via NPM), pas en `http://ip:3000`.

## Impression des étiquettes

Backoffice → **Planche A4** : 4 étiquettes 140 × 75 mm par feuille A4 paysage, variante 75 cl / 33 cl par emplacement, repères de coupe, QR code posé sur le bloc « Alc. », option 100 % noir. Imprimer à 100 % (taille réelle), sans marges.
