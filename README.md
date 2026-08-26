# CSA — site web

Site vitrine et tunnel de vente de **Consulting Sciences Academy**.
18 formations, 25 pages, aucune dépendance à installer.

---

## Démarrer en 30 secondes

```bash
npm run dev
```

Ouvrez <http://localhost:4321>. Le site se reconstruit à chaque fois que vous
enregistrez un fichier — rechargez la page pour voir le résultat.

> **Prérequis :** Node.js 20 ou plus. C'est tout. Il n'y a pas de
> `npm install` à lancer : le projet n'a **aucune dépendance**.

---

## Les commandes

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | Serveur local + reconstruction automatique |
| `npm run build` | Construit le site dans `dist/` |
| `npm run check` | Vérifie balises, liens, référencement, règles métier |
| `npm test` | 32 tests unitaires |
| `npm run verify` | Les trois précédentes à la suite — **à lancer avant chaque mise en ligne** |
| `npm run nouvelle-formation -- mon-id` | Crée une fiche formation à remplir |
| `npm run clean` | Supprime `dist/` |

---

## Où se trouve quoi

```
csa-web/
├── content/                 ← TOUT LE CONTENU. C'est ici qu'on écrit.
│   ├── site.json                identité CSA, chiffres, piliers, contacts
│   ├── formations/*.md          une fiche par formation (18)
│   ├── references.json          clients institutionnels
│   ├── temoignages.json         vide tant que rien n'est collecté
│   └── formateur.json           parcours du formateur
│
├── public/                  ← FICHIERS SERVIS TELS QUELS
│   ├── assets/css/csa.css       feuille de style unique
│   ├── assets/js/csa.js         comportements (menu, accordéons, formulaire)
│   └── images/formations/       ← LES IMAGES IA VONT ICI
│
├── src/                     ← LE MOTEUR. À ne toucher que pour changer
│   ├── build.mjs                point d'entrée du build
│   ├── lib/                     briques : markdown, front matter, tarifs
│   ├── components/              en-tête, cartes, accordéon, formules
│   └── pages/                   une fonction par type de page
│
├── scripts/                 ← OUTILS
│   ├── dev.mjs                  serveur local
│   ├── check.mjs                contrôles qualité
│   ├── nouvelle-formation.mjs   création d'une fiche
│   └── migrate-from-legacy.py   migration ponctuelle (historique)
│
├── tests/                   ← 32 tests, dont les règles métier CSA
├── docs/                    ← LA DOCUMENTATION — commencez par là
├── server/apps-script/      ← backend du formulaire (Google Apps Script)
└── dist/                    ← généré, jamais versionné
```

**La règle à retenir :** on écrit dans `content/`, on ne touche jamais à
`dist/`. Tout ce qui est dans `dist/` est écrasé à chaque build.

---

## Documentation

| Document | Pour quoi |
|---|---|
| [docs/01-demarrage.md](docs/01-demarrage.md) | Installer Node, ouvrir le projet, premières commandes |
| [docs/02-modifier-le-contenu.md](docs/02-modifier-le-contenu.md) | Changer un texte, un tarif, ajouter une formation |
| [docs/03-images.md](docs/03-images.md) | Le système d'images |
| [docs/prompts-images-ia.md](docs/prompts-images-ia.md) | **Les 18 prompts à coller dans votre générateur d'images** |
| [docs/04-deploiement.md](docs/04-deploiement.md) | Mettre en ligne, brancher le formulaire |
| [docs/05-architecture.md](docs/05-architecture.md) | Comment le moteur fonctionne |
| [docs/06-github-et-netlify.md](docs/06-github-et-netlify.md) | **Envoyer le projet sur GitHub et publier — pas à pas** |

---

## Les trois garde-fous automatiques

Le build et les tests appliquent trois règles CSA. Elles ne peuvent pas être
contournées par inadvertance.

1. **Aucun tarif non validé n'est publié.** Une formation dont le
   `statutPrix` n'est pas `"ferme"` affiche « Tarif sur demande ». Le
   contrôle vérifie en plus qu'aucun montant interdit n'apparaît dans le HTML
   généré.
2. **Aucune référence client sans accord écrit n'est nommée.** Le champ
   `accord: false` déclenche l'anonymisation automatique.
3. **Le nombre de formations annoncé est recompté à chaque build.** Impossible
   d'afficher « neuf formations » sur une page qui en liste dix-huit.

Un quatrième garde-fou concerne les logiciels propriétaires : un test échoue
si une formation ISATIS, Surpac, Vulcan, Datamine, Leapfrog ou ArcGIS ne
déclare pas explicitement que **CSA ne fournit pas de licence**.

---

## État actuel

| Élément | État |
|---|---|
| Contenu des 18 formations | Complet |
| Pages générées | 25, 0 lien cassé |
| Tests | 32 / 32 |
| **Images des formations** | **0 / 18 — à générer, voir `docs/prompts-images-ia.md`** |
| Témoignages | 0 collecté — emplacement visible affiché |
| URL du formulaire | Non configurée — repli WhatsApp actif |
| Accord des 4 établissements de Bafoussam | À obtenir |

---

*CSA — Consulting Sciences Academy*
*Formation • Conseil • Recherche • Innovation*
*« Former pour transformer l'Afrique »*
