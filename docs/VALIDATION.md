# Validation de la version web

## Vérifications locales

- `npm test` : règles de sélection, calcul de croissance, validation et import/export de projet.
- `npm run build:web` : création du dossier statique `dist/web/` à partir des ressources de `app/`.
- Chargement du dossier construit par HTTP dans Chromium : interface JavaScript initialisée et catalogue affiché.

## Vérifications du site public — 30 septembre 2026

- `https://simularbre.levergerdesplumes.fr/` : certificat TLS valide et page HTTP 200.
- `http://simularbre.levergerdesplumes.fr/` : redirection 301 vers HTTPS.
- Les modules JavaScript, la feuille CSS et l’icône répondent en HTTP 200.
- Chargement en Chromium : le catalogue est rendu.
- Le site PlumesLog du même VPS répond toujours normalement.

La projection de croissance reste illustrative et non calibrée. Les données agronomiques n’ont pas fait l’objet d’une validation externe.
