---
{
  "id": "cartographie-predictive",
  "nom": "Cartographie prédictive par apprentissage automatique",
  "nomCourt": "Cartographie prédictive",
  "categorie": "SIG & Télédétection",
  "resume": "Transformer un inventaire de points en une carte continue de susceptibilité — et pouvoir la défendre.",
  "accroche": "Vous savez faire une carte. Savez-vous faire une carte de ce qui n'a pas encore eu lieu ?",
  "phare": false,
  "nouveau": true,
  "image": "ml",
  "prix": 180000,
  "statutPrix": "propose",
  "paiement": "60 % avant le démarrage, 40 % à mi-parcours",
  "duree": "6 semaines",
  "seances": "18 séances",
  "format": "100 % en ligne",
  "outils": "Python, scikit-learn, XGBoost, QGIS, rasterio — **tous gratuits**"
}
---

## Problème

Un service technique dispose d'un inventaire de 200 glissements de terrain recensés. La question qu'on lui pose n'est jamais « où ont-ils eu lieu ? » — c'est **« où le prochain aura-t-il lieu ? »**

## Promesse

Produire une carte de susceptibilité est facile. Produire une carte dont on peut **défendre la fiabilité** devant un bailleur ou un comité scientifique, c'est autre chose. Cette formation traite les deux, et insiste sur la seconde.

## Public

- Chercheurs et doctorants en risques naturels
- Géologues et environnementalistes
- Chercheurs en santé publique
- Ingénieurs des services techniques
- Professionnels du SIG

## Prérequis

- Bases de Python : variables, boucles, fonctions, pandas
- Manipulation courante de QGIS ou ArcGIS
- Notions de moyenne, écart-type, corrélation
- Ordinateur avec 8 Go de mémoire vive recommandés

## Acquis

- Construire une carte de susceptibilité aux glissements, inondations ou pollution
- Mettre en œuvre et comparer XGBoost, Random Forest, KNN et Naïve Bayes
- Optimiser les hyperparamètres et **justifier** les valeurs retenues
- Valider par matrice de confusion, courbe ROC et score AUC
- Produire des cartes raster GeoTIFF et vectorielles prêtes pour un rapport
- Reconnaître les erreurs qui invalident silencieusement une carte prédictive

## Programme


### Semaine 1 — Poser correctement le problème

Du phénomène de terrain à la variable cible · constitution de l'inventaire · choix et préparation des covariables · alignement des rasters.

### Semaine 2 — Préparer les données spatiales

Nettoyage · valeurs manquantes · multicolinéarité (VIF) · standardisation · **le problème des pseudo-absences** et les stratégies d'échantillonnage.

### Semaine 3 — Les quatre algorithmes

Naïve Bayes et pourquoi son hypothèse d'indépendance est presque toujours fausse en géographie · KNN et sa sensibilité à l'échelle · Random Forest · XGBoost et ce qu'il apporte réellement.

### Semaine 4 — Optimiser sans se tromper soi-même

Hyperparamètres · recherche en grille et aléatoire · **validation croisée spatiale**, la seule qui donne un chiffre honnête sur des données géographiques · le sur-apprentissage et ses signatures.

### Semaine 5 — Valider et interpréter

Matrice de confusion · courbe ROC et AUC · choix du seuil selon le coût de l'erreur · importance des variables · **quand un bon score cache un mauvais modèle**.

### Semaine 6 — Produire la carte livrable

Prédiction sur la grille · export GeoTIFF géoréférencé · vectorisation · mise en page QGIS · rédaction de la note méthodologique.

## Fil rouge

Deux projets complets menés de bout en bout. **Projet 1** — sensibilité aux particules fines PM10 en milieu urbain africain (classification multi-étiquettes). **Projet 2** — susceptibilité aux glissements de terrain en relief volcanique (classification binaire). Transposables aux inondations, aux sécheresses, aux déversements d'hydrocarbures et à la répartition d'espèces.

## Preuves


### La formation insiste sur ce qui invalide une carte

Validation croisée spatiale, déséquilibre des classes et choix des pseudo-absences sont traités comme des chapitres à part entière. Ce sont les trois raisons pour lesquelles une carte affichant un AUC de 0,95 peut être sans valeur.

### Deux cartes livrables, pas des exercices

L'apprenant sort avec deux cartes et les notes méthodologiques qui les accompagnent — de quoi alimenter un mémoire, un article ou un rapport.

## Différenciateurs

- **Données africaines** — reliefs volcaniques, villes et climats subsahariens
- **Outils entièrement gratuits**
- **Deux projets complets**, pas une démonstration
- **En français**

## FAQ


### Faut-il savoir programmer en Python ?

Des bases suffisent : variables, boucles, fonctions, pandas. Le module 1 de notre parcours Data Analyse les couvre entièrement si vous partez de zéro.

### Peut-on l'appliquer à autre chose qu'aux glissements de terrain ?

Oui, et c'est le but. La méthode est identique pour les inondations, les sécheresses, les déversements d'hydrocarbures, la répartition d'espèces ou la cartographie du risque sanitaire. Seules les covariables changent.

### Faut-il acheter un logiciel ?

Aucun. Python, scikit-learn, XGBoost et QGIS sont gratuits.
