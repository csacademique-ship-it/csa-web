---
{
  "id": "sig-teledetection-pollution",
  "nom": "Cartographie de la pollution environnementale — SIG et télédétection",
  "nomCourt": "SIG & Télédétection Pollution",
  "categorie": "Environnement",
  "resume": "ArcGIS, ERDAS Imagine et ENVI réunis sur un seul objectif : détecter, cartographier et suivre dans le temps une pollution de l'eau, de l'air ou du sol par imagerie satellitaire.",
  "accroche": "Ce que le satellite voit et que le prélèvement rate.",
  "phare": true,
  "nouveau": true,
  "image": "satellite",
  "prix": 270000,
  "statutPrix": "ferme",
  "paiement": "60 % avant le démarrage, 40 % à mi-parcours",
  "duree": "4 semaines",
  "seances": "12 séances (3 par semaine)",
  "format": "100 % en ligne",
  "outils": "ArcGIS, ERDAS Imagine, ENVI — voir la note sur les licences"
}
---

## Problème

Une pollution ne s'arrête pas à la clôture du site. Un rejet minier descend la rivière sur quarante kilomètres, une décharge contamine la nappe en aval, une torchère marque l'atmosphère sur des mois. Les prélèvements donnent quelques points, à quelques dates. Personne ne financera un maillage complet sur dix ans — et pourtant c'est exactement ce que les archives satellitaires contiennent déjà, gratuitement, depuis 1984.

## Promesse

Vous saurez extraire d'images satellitaires une cartographie de pollution **et son évolution dans le temps** — avec la validation terrain qui la rend crédible.

## Licence

ArcGIS, ERDAS Imagine et ENVI sont des logiciels propriétaires et **CSA ne fournit aucune licence**. Beaucoup d'apprenants suivent la formation sur le poste de leur employeur ou de leur université. Des versions d'évaluation existent pour certains de ces outils. Parlons-en **avant** votre inscription : si vous n'avez aucun accès, la formation QGIS Pro couvre une partie des mêmes compétences gratuitement.

## Public

- Ingénieurs environnement
- Géomaticiens et télédétecteurs
- ONG environnementales
- Collectivités et services techniques
- Services HSE miniers et industriels
- Étudiants en géographie, environnement et géosciences

## Prérequis

- Bases de cartographie et de systèmes de coordonnées
- Aisance générale avec un ordinateur
- Aucune expérience de télédétection requise

## Acquis

- Construire et administrer une géodatabase environnementale sous ArcGIS
- Télécharger, corriger et calibrer des images Landsat et Sentinel
- Appliquer les corrections radiométriques et atmosphériques sous ENVI
- Calculer les indices spectraux utiles : NDVI, NDWI, NDTI, indices d'argiles et d'oxydes de fer
- Classifier une occupation du sol, supervisée et non supervisée, sous ERDAS
- Évaluer une classification : matrice de confusion, indice Kappa
- Détecter le changement entre deux dates et produire une série spatio-temporelle
- Cartographier la turbidité et la qualité d'une eau de surface
- Croiser imagerie et mesures de terrain pour valider une carte
- Produire un atlas cartographique et un rapport de suivi environnemental

## Programme


### Semaine 1 — Géodatabase et socle SIG sous ArcGIS

**Objectif :** construire la base sur laquelle tout le reste s'appuiera.

ArcMap, ArcCatalog, ArcGIS Pro : quoi utiliser et quand. Systèmes de coordonnées et projections adaptées à l'Afrique — les erreurs de datum qui décalent une carte de 200 mètres. Création d'une géodatabase fichier : classes d'entités, domaines de valeurs, topologie, règles de saisie. Import de données de terrain, GPS, tableurs de laboratoire. Géoréférencement de cartes scannées. Symbologie et sémiologie graphique appliquées au risque environnemental.

**Livrable :** une géodatabase environnementale structurée et documentée.

### Semaine 2 — Images satellitaires : acquisition et prétraitement

**Objectif :** obtenir une image sur laquelle un calcul a un sens.

Les capteurs et ce qu'ils voient : Landsat 8/9, Sentinel-2, Sentinel-1 radar, MODIS. Résolutions spatiale, spectrale, temporelle — l'arbitrage concret. Téléchargement depuis USGS EarthExplorer et Copernicus. Sous ENVI : conversion en réflectance, correction atmosphérique, orthorectification, masquage des nuages. Sous ERDAS : mosaïquage, découpe, empilement multi-dates, fusion panchromatique. Contrôle qualité : reconnaître une image inexploitable avant d'avoir perdu deux jours dessus.

**Livrable :** une pile d'images corrigées, calibrées, prêtes à analyser.

### Semaine 3 — Indices, classification et signatures de pollution

**Objectif :** faire dire à l'image ce qu'elle sait de la pollution.

Signatures spectrales : végétation stressée, sols nus, eaux turbides, sols salins, résidus miniers. Calcul et interprétation des indices — NDVI pour le stress de la végétation, NDWI et MNDWI pour l'eau, NDTI pour la turbidité, ratios de bandes pour les oxydes de fer et les minéraux argileux. Classification supervisée sous ERDAS : sélection des zones d'entraînement, maximum de vraisemblance, machine à vecteurs de support. Classification non supervisée (ISODATA, K-means). Évaluation rigoureuse : matrice de confusion, précision globale, indice Kappa — et pourquoi une précision de 95 % peut cacher un échec complet sur la classe qui vous intéresse.

**Livrable :** carte d'occupation du sol classifiée et évaluée + cartes d'indices.

### Semaine 4 — Analyse spatio-temporelle, validation et projet

**Objectif :** montrer une évolution, et prouver qu'elle est réelle.

Détection de changement : différence d'images, ratios, analyse vectorielle de changement, post-classification. Séries temporelles sur dix à trente ans d'archives. Analyse spatiale sous ArcGIS : zones tampons autour des sources, interpolation des mesures terrain, superposition pondérée pour un indice de vulnérabilité, statistiques zonales par village ou par bassin versant. Validation croisée entre image et prélèvements. Mise en page : atlas cartographique, cartes d'évolution, planches de synthèse pour un rapport d'impact.

**Livrable :** projet certifiant — atlas de suivi d'un site pollué sur plusieurs dates, avec note méthodologique.

## Fil rouge

Un bassin versant affecté par une exploitation aurifère artisanale : turbidité de la rivière, recul du couvert végétal, extension des zones d'orpaillage. Trente ans d'archives Landsat, deux campagnes de terrain. Vous produisez l'atlas que l'administration réclame et que personne n'a le temps de faire.

## Preuves


### Trois logiciels, un seul projet

ArcGIS pour la donnée et la carte, ENVI pour la radiométrie, ERDAS pour la classification. Chacun est enseigné là où il est réellement meilleur.

### Des images gratuites, pour toujours

Landsat et Sentinel sont libres d'accès. Une fois la méthode acquise, vos données ne coûtent rien.

### Évaluation chiffrée des classifications

Aucune carte n'est livrée sans sa matrice de confusion. C'est ce qui sépare un rapport d'un joli poster.

## Différenciateurs

- **L'analyse multi-temporelle** — la plupart des formations s'arrêtent à une seule image
- **La validation terrain intégrée**, pas laissée en exercice
- **Contexte africain** : orpaillage, décharges, rejets industriels, couvert tropical
- **Atlas livrable**, directement présentable à une autorité ou un bailleur

## FAQ


### Je n'ai ni ArcGIS, ni ERDAS, ni ENVI. Puis-je suivre ?

Parlons-en avant votre inscription. Beaucoup d'apprenants passent par le poste de leur employeur ou de leur université. Sinon, la formation QGIS Pro couvre gratuitement une bonne partie du volet SIG, et une partie de la télédétection.

### Quelle différence avec la formation ISATIS environnement ?

Elles sont complémentaires. Celle-ci part de l'image satellitaire et couvre de grandes surfaces à faible coût. ISATIS part des prélèvements et quantifie l'incertitude au mètre près. En pratique, un bon rapport utilise les deux : le satellite délimite, la géostatistique chiffre.

### Faut-il des connaissances en physique du rayonnement ?

Non. Ce qui est nécessaire est enseigné en semaine 2, sans formalisme inutile : ce qu'est une réflectance, pourquoi l'atmosphère fausse la mesure, et comment on la corrige.

### Les images sont lourdes. Quelle machine faut-il ?

8 Go de mémoire vive au minimum, 16 Go confortable, et 50 Go d'espace disque libre. Une connexion correcte pour les téléchargements. Nous fournissons des extraits allégés pour ceux dont la connexion est limitée.
