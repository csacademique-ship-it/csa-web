---
{
  "id": "isatis-pollution",
  "nom": "Géostatistique environnementale sous ISATIS — cartographie de la pollution",
  "nomCourt": "ISATIS — Pollution",
  "categorie": "Environnement",
  "resume": "Quantifier, cartographier et gérer une pollution de l'eau, de l'air ou du sol — avec les incertitudes qui vont avec, parce qu'une carte de pollution sans incertitude n'est pas une carte, c'est une opinion.",
  "accroche": "Une carte de pollution qui tient devant un tribunal.",
  "phare": true,
  "nouveau": true,
  "image": "pollution",
  "prix": 250000,
  "statutPrix": "ferme",
  "paiement": "60 % avant le démarrage, 40 % à mi-parcours",
  "duree": "4 semaines",
  "seances": "12 séances (3 par semaine)",
  "format": "100 % en ligne — enregistrements fournis",
  "outils": "ISATIS (Geovariances) — voir la note sur la licence ci-dessous"
}
---

## Problème

Une campagne de prélèvements coûte cher et donne des points. Entre les points, il n'y a rien. La pratique courante consiste à interpoler avec un outil SIG et à colorier — ce qui produit une carte lisse, rassurante, et muette sur l'essentiel : quelle est la probabilité que le seuil réglementaire soit dépassé là où personne n'a mesuré ? C'est pourtant la seule question qui décide d'une dépollution.

## Promesse

Vous produirez des cartes de pollution **assorties d'une probabilité de dépassement de seuil**, et vous saurez chiffrer le volume de terre à excaver avec une marge d'erreur assumée.

## Licence

ISATIS est un logiciel propriétaire de Geovariances et **CSA ne fournit pas de licence**. Le cas le plus fréquent : vous suivez la formation sur le poste de votre employeur ou de votre laboratoire. Si vous n'avez aucun accès, parlons-en **avant** toute inscription — nous préférons perdre une inscription plutôt que de vous laisser payer une formation que vous ne pourrez pas pratiquer.

## Public

- Ingénieurs environnement
- Hydrogéologues
- Géomaticiens et cartographes
- Services HSE du secteur minier
- Bureaux d'études et cabinets d'audit environnemental
- Agences et administrations de l'environnement

## Prérequis

- Bases de statistiques : moyenne, variance, histogramme
- Notions de cartographie et de systèmes de coordonnées
- Aucune expérience préalable d'ISATIS requise

## Acquis

- Structurer une base de données environnementale multi-support (eau, air, sol, sédiments)
- Traiter les non-détects et les données censurées sans biaiser la moyenne
- Calculer et modéliser des variogrammes sur des variables environnementales
- Kriger une concentration et produire la carte d'écart-type associée
- Utiliser le krigeage d'indicatrices pour cartographier une probabilité de dépassement de seuil
- Mener des simulations conditionnelles pour quantifier l'incertitude sur un volume
- Chiffrer un volume de sol contaminé avec son intervalle de confiance
- Optimiser l'implantation d'une campagne complémentaire de prélèvements
- Rédiger un rapport défendable devant une autorité ou un juge

## Programme


### Semaine 1 — Données environnementales et exploration

**Objectif :** partir d'une base propre, et comprendre ce qui la rend différente d'une base minière.

Prise en main d'ISATIS : projets, fichiers, systèmes de coordonnées. Import de données de sol, d'eau et d'air. Les spécificités environnementales : distributions très dissymétriques, valeurs extrêmes légitimes (un point chaud n'est pas une erreur), non-détects, supports d'échantillonnage hétérogènes. Analyse exploratoire, déclustering quand les prélèvements sont concentrés autour de la source. Cadre réglementaire : seuils, valeurs guides, ce que le texte exige réellement.

**Livrable :** base validée + note d'analyse exploratoire.

### Semaine 2 — Variographie environnementale

**Objectif :** modéliser la structure spatiale d'un panache.

Variogramme expérimental : pas, tolérance, nombre de paires. Ce qui diffère du minier : la dérive systématique quand on s'éloigne de la source, l'anisotropie imposée par le sens d'écoulement ou le vent dominant. Pépite et erreur analytique du laboratoire — comment les distinguer. Ajustement des modèles théoriques (sphérique, exponentiel, gaussien) et modèles gigognes. Variographie sur données transformées (log, anamorphose gaussienne) et retour à l'échelle réelle. Validation croisée.

**Livrable :** modèle variographique ajusté et validé, pour trois polluants.

### Semaine 3 — Krigeage, seuils et probabilités

**Objectif :** passer de la concentration estimée à la décision.

Krigeage ordinaire : la carte de concentration et, tout aussi importante, la carte d'écart-type de krigeage. Krigeage d'indicatrices : cartographier directement P(concentration > seuil) — l'outil qui répond à la question réglementaire. Krigeage disjonctif et espérance conditionnelle. L'effet de support : la teneur d'un mètre cube n'est pas celle d'un carottage — conséquence directe sur les volumes déclarés. Cartes de risque et cartes d'aide à la décision.

**Livrable :** jeu de cartes — concentration, incertitude, probabilité de dépassement.

### Semaine 4 — Simulations, volumes et projet final

**Objectif :** chiffrer, décider, défendre.

Pourquoi le krigeage ne suffit pas pour un volume : le lissage sous-estime l'extension des zones extrêmes. Simulations conditionnelles (gaussiennes séquentielles, bandes tournantes). Distribution du volume contaminé, intervalle de confiance, coût de dépollution avec sa fourchette. Analyse de sensibilité au seuil. Optimisation d'une campagne complémentaire : où placer les prochains prélèvements pour réduire le plus l'incertitude. Structure d'un rapport opposable : ce qu'un contradicteur attaquera en premier.

**Livrable :** projet certifiant — étude complète d'un site pollué, avec volume chiffré et intervalle de confiance.

## Fil rouge

Un site industriel réel : une ancienne aire de stockage d'hydrocarbures en bordure de nappe, 140 sondages de sol, 22 piézomètres, trois campagnes successives. Vous en sortez un volume à excaver, une fourchette de coût, et la carte que le bureau d'études aurait dû produire.

## Preuves


### Le même moteur géostatistique que le minier

ISATIS est utilisé par les grands bureaux d'ingénierie pour l'estimation des ressources. Les outils sont identiques ; ce sont les questions qui changent.

### Formation construite autour du seuil réglementaire

Toute la progression converge vers une seule livraison : la probabilité de dépassement, cartographiée.

### Enregistrements et supports à vie

Séances enregistrées, données, scripts et rapports types fournis.

## Différenciateurs

- **L'incertitude est le sujet**, pas une annexe
- **Krigeage d'indicatrices et simulations** — les deux outils que les SIG classiques ne savent pas faire
- **Volume chiffré avec intervalle de confiance** — ce que demande un financeur de dépollution
- **Cas d'étude africain** : nappe phréatique et sol tropical

## FAQ


### Je n'ai pas de licence ISATIS. Que faire ?

Écrivez-nous avant de payer. Nous vérifierons ensemble vos accès. Si aucune solution n'existe, nous vous orienterons vers la formation R/Python, qui couvre les mêmes concepts avec des outils gratuits.

### Quelle différence avec ISATIS NEO exploration minière ?

Les méthodes se recouvrent largement — variogramme, krigeage, simulations. Ce qui change : les données (multi-support, non-détects), la question posée (dépassement d'un seuil légal, pas teneur de coupure) et le livrable (volume à dépolluer, pas ressource classifiée).

### Faut-il être hydrogéologue ?

Non. Des ingénieurs environnement, des géomaticiens et des responsables HSE suivent cette formation. Il faut comprendre ce qu'on mesure — le reste s'apprend.

### Peut-on organiser une session pour notre service ?

Oui, c'est même le format que nous recommandons pour cette formation. Session dédiée, sur vos propres données, 6 à 12 personnes. Tarif de groupe sur devis.
