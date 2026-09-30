# simulArbre

Application web statique pour choisir des fruitiers à partir de sources documentées et explorer des scénarios de croissance. Interface française, données techniques embarquées, aucun compte, aucune télémétrie et aucune dépendance de production.

**Application indépendante inspirée de Deciduous. Elle n’est ni une version officielle, ni une reproduction du moteur scientifique de l’INRAE. La croissance est une projection illustrative non calibrée.**

Site public : [simularbre.levergerdesplumes.fr](https://simularbre.levergerdesplumes.fr/).

## Fonctionnalités

- 25 associations espèce / porte-greffe et cinq profils botaniques supplémentaires, soit onze espèces fruitières ; recherche et filtres de sol, d’eau et de hauteur.
- Diagnostic expliqué pour chaque critère, comparaison des associations, fiches avec sources et limites.
- Catalogue public de 27 variétés sur onze espèces, avec source technique ou de recherche et recoupement de pépinière quand disponible ; les désaccords restent visibles.
- Repères sur les ravageurs, les auxiliaires et l’entretien pour les six espèces couvertes par Deciduous ; suivi général pour les cinq autres.
- Projection illustrative de hauteur sur 1 à 50 ans et géométrie indicative du houppier et de la plantation.
- Projet enregistré dans le stockage local du navigateur, export/import JSON et export CSV du scénario.

Un projet reste propre au navigateur utilisé ; conservez un export JSON si vous souhaitez le transférer ou le sauvegarder. Les liens vers les documents sources nécessitent Internet. Le site n’est pas annoncé comme utilisable hors connexion.

## Sources et méthode

Les 25 associations techniques proviennent des [compléments Deciduous du GRAB](https://www.grab.fr/deciduous-porte-greffes/). Les cinq profils ajoutés s’appuient sur les fiches botaniques de la [RHS](https://www.rhs.org.uk/plants) et le [guide verger maraîcher SMART](https://www.agroforesterie.fr/wp-content/uploads/2022/07/guidevergermaraichersmart.pdf). Les températures minimales sont des classes de rusticité de l’arbre établi ; aucun seuil maximal de chaleur n’est affirmé sans source. Les périodes de floraison et de récolte sont indicatives. Les intervalles sont conservés et les valeurs absentes ne sont pas inventées. Le taux de croissance et le ratio largeur/hauteur du houppier sont des hypothèses réglables, pas des mesures issues des fiches.

La traçabilité figure dans [docs/SOURCES.md](docs/SOURCES.md) et les règles de calcul dans [docs/METHODE.md](docs/METHODE.md). Le catalogue variétal est une sélection publique et non un inventaire du verger. Le climat local, la compatibilité des cultivars, la pollinisation et la calibration scientifique de croissance restent à vérifier. Aucun rendement annuel ni stockage de carbone n’est simulé.

## Développement

Prérequis : Node.js 22 ou plus récent et npm. Aucune installation de dépendances n’est nécessaire pour lancer les scripts :

```bash
npm test
npm run dev        # aperçu sur http://127.0.0.1:4173
npm run build:web  # fichiers publiables dans dist/web/
```

Le dossier `dist/web/` contient uniquement les sept ressources statiques nécessaires. Le code JavaScript utilise des modules natifs du navigateur. Les [vérifications réalisées](docs/VALIDATION.md) couvrent les tests du moteur et le chargement HTTP de l’interface.

## Déploiement

Le site est servi par Apache sur le VPS, sans processus Node.js ni base de données. Les modèles [Apache](deploy/apache-simularbre.conf) et [Nginx](deploy/nginx-simularbre.conf) utilisent le sous-domaine `simularbre.levergerdesplumes.fr` et `/var/www/simularbre` comme racine.

Pour préparer une livraison, exécutez `npm test` puis `npm run build:web`. Transférez `dist/web/` dans un dossier `web/` sur le VPS avec les fichiers `deploy/apache-simularbre*.conf` et `scripts/install-web-vps.sh`, puis lancez ce script avec `sudo`. Il installe les fichiers, crée au besoin le certificat avec Certbot et active le vhost Apache. Une nouvelle livraison remplace les fichiers web et conserve le certificat. Le répertoire distant de livraison est temporaire et ne fait pas partie du site servi.

Vérifiez ensuite l’URL HTTPS, la redirection depuis HTTP, le chargement des modules et l’export/import d’un projet. Le dossier de publication ne doit contenir aucun fichier privé.

## Structure

- `app/` : interface, base technique, moteur et styles.
- `scripts/build-web.mjs` : construit le dossier de publication.
- `scripts/install-web-vps.sh`, `deploy/` : installation sur le VPS et modèles de vhost.
- `tests/` : tests du moteur, de la base et des projets.

Le contenu des tableaux originaux et les marques restent attribués à leurs auteurs. Le projet embarque une transcription structurée de faits et de courtes reformulations, sans les images ni les logos des partenaires. Aucune licence de réutilisation globale de la base Deciduous n’est présumée.
