# 5. Architecture

Pour qui veut modifier le moteur, pas seulement le contenu.

---

## Le principe

Un générateur de site statique écrit à la main, en JavaScript natif, **sans
aucune dépendance**.

```
content/*.md + content/*.json
        │
        ├── src/lib/frontmatter.mjs   sépare JSON / Markdown, découpe en sections
        ├── src/lib/content.mjs       charge, valide, trie, regroupe
        ├── src/lib/markdown.mjs      rend le Markdown en HTML
        ├── src/lib/format.mjs        applique les règles de tarif
        │
        ├── src/components/*.mjs      fragments réutilisables
        ├── src/pages/*.mjs           une fonction par type de page
        │
        └── src/build.mjs             orchestre, écrit dist/, contrôle
                 │
              dist/  →  Netlify
```

## Pourquoi zéro dépendance

Un site de 25 pages qui change quelques fois par an n'a pas besoin d'un
écosystème de 300 paquets. Les conséquences concrètes :

- **`git clone` puis `npm run build` fonctionne**, sans `npm install`
- Aucune alerte de sécurité npm à traiter
- Aucune version de framework à migrer dans deux ans
- Le build prend moins d'une seconde
- Le code entier tient en un après-midi de lecture

Le prix à payer : le rendu Markdown est volontairement limité (pas de
tableaux, pas d'images dans le corps). C'est un arbitrage assumé.

---

## Le format de contenu

Chaque formation est un fichier Markdown avec **front matter JSON** :

```markdown
---
{ "id": "leapfrog-geo", "nom": "…", "statutPrix": "ferme" }
---

## Problème
…
```

**Pourquoi du JSON et pas du YAML ?** Le YAML a une grammaire pleine de cas
particuliers ; l'analyser correctement demande une bibliothèque. Le JSON a
une grammaire sans ambiguïté, `JSON.parse` est intégré à Node, et il indique
la ligne exacte d'une erreur. Hugo accepte d'ailleurs officiellement le front
matter JSON.

Le corps est découpé par convention :

- `##` → une section (`Problème`, `Programme`, `FAQ`…)
- `###` à l'intérieur de `Programme` ou `FAQ` → un module, une question
- `-` à l'intérieur de `Acquis`, `Public`… → un item de liste

`src/lib/frontmatter.mjs` fait ce découpage ; `src/lib/content.mjs` vérifie
que toutes les sections obligatoires sont là et **refuse de construire** si
l'une manque.

---

## Les règles métier, et où elles vivent

| Règle | Fichier | Test qui la protège |
|---|---|---|
| Un tarif non ferme n'est jamais publié | `src/lib/format.mjs` → `prixAffiche` | `tests/lib.test.mjs`, `tests/contenu.test.mjs`, `scripts/check.mjs` |
| Une référence sans accord écrit reste anonyme | `src/pages/institutionnelles.mjs` | `tests/contenu.test.mjs` |
| Le nombre de formations est recompté | `src/build.mjs` → `controles` | `tests/contenu.test.mjs` |
| Un logiciel propriétaire déclare l'absence de licence | contenu | `tests/contenu.test.mjs` |
| Aucun témoignage fabriqué | `content/temoignages.json` vide | `tests/contenu.test.mjs` |

Ces règles sont vérifiées à trois endroits — au build, au contrôle, et par
les tests. C'est délibéré : une seule barrière finit toujours par céder.

---

## L'ordre d'affichage des formations

`src/lib/content.mjs` trie ainsi :

1. les formations **phares et nouvelles**
2. les formations **phares**
3. les **nouvelles**
4. le reste

puis par ordre alphabétique du nom court, en français. Le tri est
**déterministe** : deux builds successifs produisent exactement le même HTML,
ce qui rend les différences Git lisibles.

Le regroupement par catégorie suit l'ordre d'apparition dans cette liste
triée — pas un ordre codé en dur.

---

## Les images

`src/components/image.mjs` cherche, au moment du build,
`public/images/formations/<id>.<ext>` parmi les extensions acceptées. S'il ne
trouve rien, il rend un bloc `.visuel-attente` — jamais une balise `<img>`
cassée.

Conséquence : **ajouter une image ne demande aucune modification de code.**
On dépose le fichier, on reconstruit.

---

## Le CSS

Un seul fichier, `public/assets/css/csa.css`, organisé en 15 sections
numérotées et commentées. Variables CSS en tête pour la palette et les
espacements. Pas de préprocesseur, pas de build CSS : ce qu'on lit est ce qui
part en production.

La palette vient de `CSA_Charte_Couleurs.html`, dérivée des logos officiels.

> ⚠️ **Conflit non tranché :** la charte et les logos sont **bleus**, mais les
> supports de formation LaTeX utilisent navy #14274E + orange #C97B22. Le
> site applique la charte bleue. Une décision de la direction est attendue.

---

## Le JavaScript client

`public/assets/js/csa.js` — un seul fichier, sans framework, en IIFE. Il gère
le menu mobile, les accordéons, la présélection de formation depuis l'URL
(`?f=leapfrog-geo`) et l'envoi du formulaire.

La configuration (URL du formulaire, numéro WhatsApp) est injectée par le
build dans `assets/js/config.js`, chargé avant. Ainsi, **aucune donnée n'est
dupliquée** entre `content/site.json` et le JavaScript.

---

## Ajouter un type de page

1. Écrivez une fonction dans `src/pages/`, qui reçoit `contenu` et retourne
   du HTML via `page({...})` de `src/components/layout.mjs`
2. Appelez-la depuis `src/build.mjs` avec `ecrire(fichiers, 'ma-page.html', …)`
3. Ajoutez-la au tableau `urls` de la fonction `sitemap`
4. Si elle doit figurer dans le menu, complétez `NAV` dans `layout.mjs`

---

## Les contrôles de `npm run check`

`scripts/check.mjs` lit `dist/` et vérifie :

1. l'équilibrage des balises (pile d'ouverture/fermeture, balises vides gérées)
2. les liens internes — en retirant `?requête` et `#ancre`
3. les ancres internes (`#id` existant réellement)
4. `lang`, `<title>`, meta description, un seul `<h1>`
5. `alt` sur toutes les images, `rel="noopener"` sur tout `target="_blank"`
6. qu'aucun montant marqué non ferme n'apparaît dans le HTML

Il sort en code 1 dès la première anomalie, pour que la CI échoue.

---

## Historique

Ce projet remplace un générateur Python (`Site_Web_Tunnel_Vente/`) où contenu
et code vivaient dans le même fichier. Le script
`scripts/migrate-from-legacy.py` a produit les fichiers de `content/` et est
conservé comme trace de la conversion.
