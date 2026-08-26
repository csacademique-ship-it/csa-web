# 2. Modifier le contenu

**Règle absolue : on ne modifie jamais les fichiers `.html`.** Ils sont
regénérés — et donc écrasés — à chaque build. Tout se passe dans `content/`.

---

## Changer un texte de formation

Ouvrez le fichier de la formation, par exemple
`content/formations/leapfrog-geo.md`. Il a deux parties.

### La partie du haut : les données

Entre les deux lignes `---`, du JSON :

```json
{
  "id": "leapfrog-geo",
  "nom": "Leapfrog Geo — modélisation géologique 3D",
  "nomCourt": "Leapfrog Geo",
  "categorie": "Logiciels miniers",
  "resume": "Construire un modèle géologique 3D implicite…",
  "accroche": "Vos sondages deviennent un gisement en trois dimensions.",
  "phare": true,
  "nouveau": true,
  "prixMin": 20000,
  "prixMax": 65000,
  "statutPrix": "ferme",
  "duree": "à votre rythme"
}
```

C'est du JSON strict : **chaque texte entre guillemets doubles, une virgule
entre chaque ligne, pas de virgule après la dernière.** Si vous vous trompez,
le build s'arrête et vous dit à quelle ligne.

### La partie du bas : les textes

Après le second `---`, du Markdown structuré par des titres :

```markdown
## Problème

Le texte du problème.

## Programme

### Module 1 — Prise en main

**Objectif :** une phrase.

Le contenu de la séance.

**Livrable :** ce que la personne produit.
```

Les titres `##` sont **des étiquettes reconnues par le moteur**. Ne les
renommez pas et n'en supprimez aucun : le build refusera de passer si une
section obligatoire manque.

| Titre `##` | Ce qu'il devient sur la page |
|---|---|
| `## Problème` | Bloc « Pourquoi cette formation existe » |
| `## Promesse` | Bloc « Ce que vous en retirez » |
| `## Licence` | Encadré orange d'avertissement (facultatif) |
| `## Public` | Liste « Pour qui » |
| `## Prérequis` | Liste « Prérequis » |
| `## Acquis` | Liste « Ce que vous saurez faire » |
| `## Programme` | Accordéon — un `###` par module |
| `## Fil rouge` | Encadré bleu sous le programme |
| `## Preuves` | Cartes « Pourquoi nous faire confiance » |
| `## Différenciateurs` | Liste « Ce qui nous distingue » |
| `## FAQ` | Accordéon — un `###` par question |

### La mise en forme disponible

| Vous écrivez | Résultat |
|---|---|
| `**texte**` | **gras** |
| `*texte*` | *italique* |
| `` `code` `` | `code` |
| `[libellé](https://…)` | un lien |
| `- item` | une puce |
| `> texte` | une citation encadrée |

Les tableaux, les images et le HTML brut **ne sont pas gérés** — c'est
volontaire, pour que le contenu reste simple et que le rendu reste maîtrisé.

---

## Changer un tarif

Dans le front matter :

```json
"prix": 250000,
"statutPrix": "ferme",
```

Le champ `statutPrix` commande tout :

| Valeur | Ce que le site affiche |
|---|---|
| `"ferme"` | Le montant réel, par exemple « 250 000 FCFA » |
| `"propose"` | « Tarif sur demande » — **le montant reste caché** |
| `"aDefinir"` | « Tarif sur demande » |
| `"devis"` | « Sur devis » |

> **C'est le garde-fou tarifaire de CSA.** Tant qu'un tarif est marqué
> `"propose"`, il ne peut pas fuiter, même s'il figure dans le fichier. Un
> contrôle vérifie en plus qu'aucun montant interdit n'apparaît dans le HTML
> publié — voir `npm run check`.

Pour publier un tarif validé par la direction : passez `statutPrix` de
`"propose"` à `"ferme"`, rien d'autre.

### Les formules Classique / Premium

```json
"formules": [
  {
    "nom": "Classique",
    "prix": 20000,
    "prixUsd": 30,
    "resume": "Pour apprendre seul, à son rythme.",
    "inclus": ["Accès aux vidéos", "Données d'exercices"],
    "exclus": ["Accompagnement", "Attestation"]
  },
  {
    "nom": "Premium",
    "prix": 65000,
    "prixUsd": 100,
    "recommande": true,
    "resume": "Pour être suivi et repartir avec une attestation.",
    "inclus": ["Tout le Classique", "Accompagnement", "Attestation"],
    "exclus": []
  }
]
```

Un test vérifie que Premium coûte plus cher, inclut davantage, et porte
`"recommande": true`.

---

## Ajouter une formation

```bash
npm run nouvelle-formation -- estimation-souterraine
```

Cela crée `content/formations/estimation-souterraine.md` avec toutes les
sections et des indications de rédaction. Remplissez-le, puis :

```bash
npm run build
```

Le build vous dira ce qui manque encore. Pensez ensuite à :

1. **Déposer le visuel** — `public/images/formations/estimation-souterraine.webp`
   (voir [3. Images](03-images.md))
2. **Mettre à jour le compteur** dans `content/site.json` :
   ```json
   { "valeur": "19", "libelle": "formations au catalogue", "detail": "…" }
   ```
   Si vous l'oubliez, le build vous prévient — il recompte à chaque fois.

---

## Modifier les chiffres, les contacts, les piliers

Tout est dans `content/site.json` : le numéro WhatsApp, l'e-mail, le nom de
domaine, les quatre piliers, le bandeau de chiffres, la liste des pays et des
profils du formulaire.

---

## Ajouter un témoignage

`content/temoignages.json` est **vide à dessein** : aucun témoignage n'a
encore été collecté, et le site affiche un emplacement réservé plutôt qu'un
faux avis.

Pour en ajouter un :

```json
[
  {
    "texte": "…",
    "auteur": "Un géologue d'exploration",
    "role": "Côte d'Ivoire · Formation ISATIS NEO",
    "initiales": "GE"
  }
]
```

> **Règle de confidentialité CSA :** ne jamais publier le nom complet d'un
> apprenant sans son accord écrit. Mentionnez la fonction et le pays. Les
> clients institutionnels peuvent être nommés, avec accord écrit également.

---

## Nommer un client institutionnel

`content/references.json` :

```json
{
  "nom": "Complexe Bilingue École Pépite d'Or",
  "accord": true
}
```

Tant que `"accord": false`, le site affiche « Groupe scolaire (nom communiqué
sur accord) » à la place du nom. C'est automatique.

---

Suite : [3. Images](03-images.md)
