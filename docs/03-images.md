# 3. Les images

## Comment ça marche

Le site cherche, pour chaque formation, un fichier portant son identifiant :

```
public/images/formations/leapfrog-geo.webp
public/images/formations/acp-rstudio.jpg
```

**Extensions acceptées**, par ordre de préférence :
`.avif` · `.webp` · `.jpg` · `.jpeg` · `.png`

Si le fichier existe, il est utilisé. S'il n'existe pas, un bloc bleu aux
couleurs CSA prend sa place, avec le nom de la formation. Le site n'est
jamais cassé, jamais troué — mais il paraît inachevé.

Le format attendu est **16:9 paysage**, idéalement 1600 × 900 pixels.

---

## Générer les images

**[docs/prompts-images-ia.md](prompts-images-ia.md) contient les 18 prompts
prêts à coller**, avec un bloc de style commun qui garantit que les 18 images
se ressemblent.

En résumé :

1. Ouvrez ChatGPT, Gemini, Midjourney ou l'outil de votre choix
2. Collez le bloc « STYLE COMMUN », puis le prompt de la formation
3. Demandez le format 16:9
4. Enregistrez sous le nom exact indiqué

---

## Alléger avant de mettre en ligne

Une image générée pèse souvent **2 à 4 Mo**. C'est beaucoup trop : une bonne
partie de vos visiteurs sont en 3G.

Passez chaque image par **[squoosh.app](https://squoosh.app)** — gratuit,
dans le navigateur, rien à installer :

- Largeur : **1600 px**
- Format : **WebP**
- Qualité : **75**

Visez **moins de 200 Ko par image**. Le site entier doit rester sous 5 Mo.

---

## Savoir ce qui manque

Chaque build vous le dit :

```
  !!  18 visuel(s) manquant(s) sur 18 -> bloc de remplacement affiche.
        Deposez les images dans public/images/formations/ :
        - acp-rstudio.webp
        - arcgis-10.webp
        …
```

Quand la ligne devient `OK 18 visuels presents`, tout est en place.

---

## Photos réelles plutôt qu'images générées

Pour une formation technique, **une vraie photo vaut mieux qu'une image
générée** : le prospect cherche à se projeter, et une image de synthèse trop
lisse ne l'y aide pas.

Ce qui fonctionne le mieux :

- une photo d'une session CSA en cours, prise de dos ou de côté
- une capture d'écran du logiciel pendant une démonstration
- une carte ou un modèle réellement produit pendant la formation

Le système est identique — même nom de fichier, même dossier. Deux règles :

- **Accord des personnes photographiées** avant publication
- **Aucun nom d'apprenant lisible** sur une capture d'écran

---

## Le logo et le favicon

`public/images/brand/` contient `logo-csa.png` (44 × 44 affiché) et
`favicon.png`. Pour les remplacer, gardez les mêmes noms de fichier.

---

Suite : [4. Déploiement](04-deploiement.md)
