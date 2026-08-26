---
{
  "id": "acp-rstudio",
  "nom": "ACP en géosciences avec RStudio",
  "nomCourt": "ACP RStudio",
  "categorie": "Géosciences & Données",
  "resume": "Révéler les signatures géochimiques cachées d'une base de données minière, et transformer un tableau de 40 éléments en cibles d'exploration lisibles sur une carte.",
  "accroche": "Quarante colonnes de géochimie. Trois axes. Une cible.",
  "phare": true,
  "nouveau": true,
  "image": "acp",
  "prix": 30000,
  "statutPrix": "ferme",
  "paiement": "60 % avant le démarrage, 40 % à mi-parcours",
  "duree": "4 semaines",
  "seances": "12 séances (3 par semaine)",
  "format": "100 % en ligne — supports à vie",
  "outils": "R et RStudio, packages FactoMineR, factoextra, ggplot2, compositions — **tous gratuits et libres**"
}
---

## Problème

Un laboratoire vous rend un fichier de 40 éléments dosés sur 800 échantillons. Trente-deux mille nombres. Personne ne peut lire ça. La plupart des équipes se rabattent alors sur trois ou quatre éléments « intéressants » et jettent le reste — c'est-à-dire jettent l'information qui aurait révélé l'altération, le contrôle structural, et la vraie cible.

## Promesse

Vous saurez réduire un tableau géochimique à deux ou trois axes qui **portent un sens géologique**, les nommer, les défendre — et surtout reconnaître les cas où l'ACP raconte n'importe quoi.

## Public

- Étudiants en géosciences (licence, master, doctorat)
- Ingénieurs géologues d'exploration
- Géostatisticiens et data analysts
- Chercheurs et enseignants-chercheurs
- Techniciens de laboratoire géochimique

## Prérequis

- Bases de statistiques : moyenne, variance, corrélation
- Notions de géochimie ou de pétrographie
- Aucune expérience de R requise — RStudio est enseigné depuis la première séance

## Acquis

- Préparer une base géochimique : censure analytique, valeurs sous la limite de détection, transformation log-ratio des données compositionnelles
- Choisir en connaissance de cause entre ACP normée et non normée
- Décider combien d'axes retenir — et savoir pourquoi le critère de Kaiser seul ne suffit pas
- Lire un cercle de corrélation et y reconnaître une association d'altération
- Construire un biplot lisible et l'annoter géologiquement
- Comprendre la décomposition en valeurs singulières (SVD) qui est sous le capot, et la variante SVD2 utilisée en géochimie d'exploration
- Projeter les scores d'axes sur une carte et délimiter des cibles
- Produire un rapport reproductible en R Markdown

## Programme


### Semaine 1 — Les données avant les maths

**Objectif :** ne jamais faire une ACP sur des données qu'on n'a pas regardées.

Prise en main de RStudio (projets, scripts, console). Import d'une base géochimique réelle. Le piège des valeurs « < LD » : pourquoi remplacer par LD/2 déforme la structure, et ce qu'on fait à la place. Données compositionnelles : une somme qui vaut toujours 100 % crée des corrélations qui n'existent pas — transformations CLR et ILR. Statistiques descriptives, matrice de corrélation, détection des valeurs extrêmes.

**Livrable :** un jeu de données propre, documenté, prêt pour l'analyse.

### Semaine 2 — L'ACP, du principe au calcul

**Objectif :** comprendre ce que la machine calcule, pas seulement l'appeler.

L'intuition géométrique : chercher la direction de plus grande variance. Centrage, réduction, et pourquoi une ACP non normée sur des ppm et des pourcentages n'a aucun sens. Valeurs propres, vecteurs propres, inertie. La décomposition en valeurs singulières (SVD) : la mécanique réelle derrière FactoMineR. La variante SVD2, pondérée, et son usage en exploration. Combien d'axes garder : éboulis, Kaiser, test des bâtons brisés, et le seul critère qui compte vraiment — l'interprétabilité géologique.

**Livrable :** une ACP complète, avec justification écrite du nombre d'axes retenus.

### Semaine 3 — Lire, interpréter, nommer

**Objectif :** transformer des axes anonymes en processus géologiques.

Le cercle de corrélation : ce qu'il dit et ce qu'il ne dit pas. Contributions et cosinus carrés — distinguer une variable bien représentée d'une variable proche du centre. Le biplot individus + variables, et comment le rendre lisible quand on a 800 points. Variables supplémentaires : projeter la lithologie, l'altération, la profondeur sans qu'elles influencent les axes. Nommer les axes : « altération phyllique », « signature mafique », « dilution sédimentaire ». Classification ascendante hiérarchique sur les scores pour définir des faciès géochimiques.

**Livrable :** une planche d'interprétation annotée, prête pour un rapport.

### Semaine 4 — De l'axe à la cible, et projet final

**Objectif :** produire quelque chose qu'un chef de projet peut utiliser.

Cartographier les scores d'axes : interpolation, seuils, superposition sur le fond géologique. Hiérarchiser les anomalies. Croiser avec la structure et la géophysique. Les limites honnêtes de la méthode : ce que l'ACP ne détectera jamais, les cas où elle induit en erreur, et les alternatives (ACP robuste, analyse factorielle, t-SNE/UMAP — quand et pourquoi). Rapport reproductible en R Markdown. Soutenance du projet.

**Livrable :** projet certifiant — une note d'exploration de 6 à 10 pages, cartes comprises, sur un jeu de données minier.

## Fil rouge

Une seule base géochimique d'exploration aurifère ouest-africaine, suivie de bout en bout : 800 échantillons, 41 éléments, deux lithologies. Vous la recevez brute en séance 1, avec ses valeurs manquantes et ses erreurs. Vous rendez une note de cibles en séance 12.

## Preuves


### Méthode déjà appliquée en interne

CSA a produit une étude ACP complète sur deux lithologies, figures de qualité publication comprises. Ce sont ces analyses qui servent de référence pédagogique.

### 30 000 FCFA, supports à vie

La formation la plus accessible du catalogue — conçue pour que les étudiants et les jeunes ingénieurs puissent y entrer.

### Tout en logiciel libre

R et RStudio sont gratuits. Aucune licence à acheter, jamais.

## Différenciateurs

- **Les données compositionnelles traitées correctement** — la majorité des ACP géochimiques publiées ignorent le problème de la somme constante
- **La SVD expliquée**, pas seulement invoquée
- **On vous montre aussi quand l'ACP échoue** — c'est ce qui distingue une formation d'un tutoriel
- **Projet certifiant** noté sur données réelles

## FAQ


### Je n'ai jamais écrit une ligne de code. C'est jouable ?

Oui. R est enseigné depuis l'ouverture de RStudio. La séance 1 suppose zéro connaissance. En revanche, il faut accepter d'écrire du code plutôt que de cliquer — c'est le prix de la reproductibilité.

### Quelle différence avec le module ACP de la formation R/Python ?

La formation R/Python consacre une partie d'un module à l'ACP, dans un parcours qui va jusqu'au krigeage. Ici, l'ACP occupe quatre semaines entières : données compositionnelles, SVD, ACP robuste, cartographie des scores. Si votre besoin est la géochimie d'exploration, prenez celle-ci.

### Puis-je utiliser mes propres données ?

Oui, et c'est encouragé pour le projet final. Envoyez-nous un extrait avant le démarrage pour qu'on vérifie qu'il se prête à l'exercice.

### L'ACP, ce n'est pas un peu dépassé face au machine learning ?

Non. L'ACP reste la première chose à faire sur un tableau géochimique, parce que ses axes sont interprétables — un réseau de neurones ne vous dira jamais « ceci est une altération phyllique ». Les deux se combinent : l'ACP en amont, l'apprentissage en aval.
