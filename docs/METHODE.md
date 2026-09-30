# Méthode de simulArbre 1.3

## Trois niveaux distincts

1. **Repères techniques** : 25 associations tirées des tableaux du GRAB, référencées PO, PE, CE, PR, AB et PC. Cinq profils au niveau de l’espèce proviennent de la RHS et du guide SMART. Hauteur, distance sur le rang, délai de fructification et production adulte sont des repères dépendants de la conduite, pas des performances garanties.
2. **Interprétation locale** : règles transparentes créées pour simulArbre. Elles ne reproduisent pas l’algorithme de Deciduous et n’ont pas fait l’objet d’une validation par ses auteurs.
3. **Scénario de croissance** : modèle illustratif créé pour ce projet, sans calibration sur des observations. Les fiches ne donnent pas de séries annuelles de croissance.

## Encodage et données manquantes

Les 25 premières lignes de `app/data.js` représentent des associations espèce / porte-greffe, car le même porte-greffe peut se comporter différemment selon l’espèce. Les cinq lignes suivantes représentent seulement des profils d’espèce. Leur nom précise que le matériel végétal reste à choisir. GF305 et Montclar restent groupés, comme dans les tableaux consultés. Abricotier : seul le premier tableau est inclus, sans les montages avec intermédiaire du second.

Les fourchettes conservent leurs deux bornes. Une valeur ponctuelle est encodée avec deux bornes égales, sans fabriquer une précision statistique. Les unités de production sont kg par arbre adulte ; ce n’est pas le rendement à la première mise à fruits. La production de Jaspi sur abricotier est manquante et reste `null`. Pour les cinq profils d’espèce, les espacements, délais de fructification, rendements et tolérances de sol non établis restent `null`. Leur hauteur RHS est celle de l’espèce et ne prédit pas la hauteur d’un cultivar conduit ou greffé.

Sécheresse et asphyxie : 0 = tolérance explicitement mentionnée ; 1 = sensibilité ; 2 = sensibilité forte / très forte. La qualification « sensible à la forte asphyxie » devient une alerte uniquement lorsque la contrainte d’hydromorphie est forte. Ces niveaux servent à expliquer des alertes, sans interpoler de seuil physiologique.

Pour Sainte-Lucie 64, la fiche ne donne qu’une tolérance hydrique relative à Maxma. La tolérance absolue reste inconnue. La fiche pommier ne fournit pas une sensibilité à l’asphyxie propre au M9 : elle reste inconnue. L’absence de seuil calcaire ne prouve jamais la tolérance. Les noms botaniques sont des libellés de repérage et ne constituent pas une identification variétale.

## Températures et phénologie

La température minimale affichée est la plage associée à la classe de rusticité RHS (H4, H5 ou H6) de la plante établie en conditions britanniques. Ce n’est pas un seuil précis de survie et encore moins un seuil de résistance des bourgeons ou fleurs. La température maximale supportée reste « non documentée » pour les onze espèces : les sources retenues ne fournissent pas un seuil comparable selon la durée de chaleur, l’eau disponible, le stade et la variété. Les périodes de floraison sont qualitatives ; les mois de récolte proviennent du calendrier RHS, sauf le kaki (guide SMART). Elles doivent être ajustées au cultivar et au climat local.

## Diagnostic

- Hauteur : alerte si la borne adulte basse dépasse le plafond choisi ; incertitude si le plafond traverse la fourchette ; pas d’alerte sinon.
- Sécheresse forte : alerte en cas de sensibilité publiée et irrigation absente, ponctuelle ou inconnue. Une irrigation régulière reste incertaine faute de bilan hydrique.
- Hydromorphie forte : alerte en cas de sensibilité ; absence d’alerte si une tolérance est mentionnée ; sinon incertitude. Une tolérance ne s’étend pas automatiquement à tous les degrés ou durées d’inondation.
- Calcaire actif > 10 % : alerte si le tableau signale cette sensibilité ; sinon incertitude. Un taux inférieur n’établit pas une aptitude générale.
- Sol superficiel : alerte lorsqu’il est déconseillé, absence d’alerte lorsqu’il est explicitement admis, sinon incertitude. Aucun seuil arbitraire de profondeur n’a été ajouté.
- Les contraintes inconnues ou faibles ne déclenchent pas ces règles. Une fiche sans critère évalué porte « À explorer », et non « adaptée ».

Tri : nombre croissant d’alertes, puis d’incertitudes, puis nom. Toutes les associations de l’espèce choisie restent visibles. Pas de score en pourcentage, de note de rentabilité, ni d’exclusion prétendant remplacer un diagnostic agronomique.

## Croissance illustrative

`H(t) = H0 + (Hinf − H0) × (1 − exp(−k × f × t))`

- `t` : années après plantation, de 0 à 50.
- `Hinf` : centre de la fourchette de hauteur adulte de la fiche ; les bornes sont calculées séparément pour la bande du graphique.
- `H0` : hauteur initiale définie par l’utilisateur, par défaut 1,2 m. Elle ne peut dépasser la borne adulte basse pour conserver une croissance monotone.
- `k` : vitesse supposée, par défaut 0,12 an⁻¹, sans source empirique.
- `f` : multiplicateur arbitraire de vitesse entre 0 et 1, par défaut 1. Aucune relation avec la pluviométrie, l’irrigation ou le climat n’est postulée.

Ces paramètres initiaux sont des hypothèses de démonstration, pas des paramètres recommandés par le GRAB. La bande représente seulement les deux cibles adultes publiées, **pas** un intervalle de confiance ni l’incertitude totale. Quand le GRAB donne une valeur ponctuelle, la bande est nulle mais l’incertitude biologique ne l’est pas.

La hauteur tend asymptotiquement vers la cible ; le modèle ignore les compétitions, la taille, les stades physiologiques, les maladies, la mortalité et le climat. Les critères de parcelle n’ajustent pas automatiquement la croissance. Les faibles paramètres strictement positifs permettent des scénarios très lents, sans simuler un arrêt ou une mortalité.

## Géométrie de plantation

- Diamètre théorique du houppier = hauteur × ratio utilisateur (0,65 par défaut, sans calibration).
- Surface du houppier = π × (diamètre/2)².
- Densité = 10 000 / (espacement sur le rang × inter-rang), en arbres/ha.
- Nombre = partie entière de densité × surface en ha, sans tournières ni bordures.
- Somme d’emprises = surface du houppier × densité ; les recouvrements sont comptés plusieurs fois, donc le pourcentage peut dépasser 100 %.

Ce n’est ni un bilan radiatif, ni un calcul d’ombre ou de couverture réelle. L’inter-rang est une hypothèse utilisateur, jamais déduit de la distance minimum sur le rang publiée dans la fiche.

## Validation, conservation et évolution

Douze tests automatisés couvrent les références, les intervalles, les inconnues, les espèces sur porte-greffe identique, la sensibilité au paramètre de croissance, les bornes numériques et la réimportation des projets. Ils vérifient le logiciel, pas la validité scientifique du modèle.

Le JSON conserve paramètres, résultats, version de base et références. Au réimport, les résultats sont recalculés avec la base embarquée actuelle ; les anciens résultats du fichier ne sont pas exécutés. Le CSV contient paramètres, source de la hauteur et qualification illustrative.

Pour transformer ce module en outil prédictif, il faudrait acquérir des mesures longitudinales par cultivar/porte-greffe, préciser la conduite et les conditions pédoclimatiques, estimer les paramètres sur une partie des observations, puis valider sur des données indépendantes et quantifier les erreurs. Aucune de ces étapes n’est présumée réalisée ici.
