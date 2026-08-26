# 6. Mettre le site en ligne — GitHub puis Netlify

**Durée : environ 30 minutes la première fois. Coût : 0 FCFA.**

Ce document reprend depuis le tout début. Il suppose seulement que vous avez
un compte GitHub et l'adresse e-mail de CSA.

---

## Le principe, en une phrase

Votre ordinateur envoie le **code source** sur GitHub (dépôt **privé**,
personne ne le voit). Netlify lit ce dépôt, **construit le site** sur ses
propres serveurs, et publie le résultat. Vous ne construisez jamais rien
vous-même.

```
Votre PC  ──git push──▶  GitHub (privé)  ──▶  Netlify construit  ──▶  Site public
```

C'est ce découpage qui vous permet de travailler sans Node installé : la
construction a lieu chez Netlify, pas chez vous.

---

## Pourquoi le dépôt doit rester privé

Quatre formations portent un tarif marqué `"propose"` dans les fichiers
source — Aéromagnétisme, Cartographie prédictive, Google Earth Engine,
Planification minière. Le site public ne les affiche jamais : les garde-fous
les remplacent par « Tarif sur demande ».

Mais un dépôt **public** exposerait les fichiers `content/formations/*.md`,
où ces montants sont écrits en clair. Un prospect curieux pourrait les lire
avant que la direction ne les ait validés.

> **Règle :** le dépôt reste privé tant que les trois incohérences tarifaires
> ne sont pas arbitrées. Le site, lui, est public — c'est le but.

---

# A. Envoyer le projet sur GitHub

## A1. Créer le dépôt (3 min)

1. Allez sur <https://github.com/new>
2. Remplissez :

   | Champ | Valeur |
   |---|---|
   | Repository name | `csa-web` |
   | Description | `Site vitrine et tunnel de vente de CSA` |
   | Visibilité | **Private** ← important |
   | Add a README file | **décoché** |
   | Add .gitignore | **None** |
   | Choose a license | **None** |

   > Les trois dernières cases doivent rester vides. Le projet possède déjà
   > son README et son `.gitignore` : si GitHub en crée d'autres, le premier
   > envoi sera refusé pour cause de conflit.

3. **Create repository**

GitHub affiche alors une page d'instructions. Ignorez-la, la suite est
ci-dessous.

## A2. Envoyer le projet (5 min)

Le dépôt local existe déjà et le premier commit est fait. Il reste à indiquer
où envoyer, puis à envoyer.

Dans le terminal, à la racine de `csa-web`, remplacez `VOTRE-COMPTE` par
votre nom d'utilisateur GitHub :

```bash
git remote add origin https://github.com/VOTRE-COMPTE/csa-web.git
```

Puis :

```bash
git push -u origin main
```

**Une fenêtre de navigateur s'ouvre** et vous demande d'autoriser Git à
accéder à votre compte GitHub. Acceptez avec le compte qui possède le dépôt.
Cette autorisation n'est demandée qu'une seule fois : Windows la retient.

> **Si aucune fenêtre ne s'ouvre** et que Git réclame un mot de passe :
> GitHub n'accepte plus les mots de passe depuis 2021. Créez un jeton sur
> <https://github.com/settings/tokens> (*Generate new token (classic)*,
> portée **repo**), et collez-le à la place du mot de passe.

## A3. Vérifier (1 min)

Rechargez la page de votre dépôt. Vous devez voir les 63 fichiers et le
message *Site CSA — tunnel de vente, 18 formations*.

Vérifiez aussi qu'il n'y a **aucun dossier `dist`**. S'il apparaît, arrêtez-
vous et signalez-le : cela voudrait dire que le `.gitignore` n'a pas été pris
en compte.

Quelques minutes plus tard, un onglet **Actions** affiche une coche verte :
GitHub a construit le site et lancé les 32 tests pour vérifier que tout va
bien. Cette vérification tourne à chaque envoi. **Si elle passe au rouge, ne
déployez pas** — quelque chose est cassé.

---

# B. Publier avec Netlify

## B1. Créer le compte (3 min)

1. <https://app.netlify.com/signup>
2. Choisissez **Sign up with GitHub** — c'est le plus simple, aucun mot de
   passe supplémentaire à retenir
3. Autorisez Netlify à lire vos dépôts

## B2. Importer le projet (5 min)

1. **Add new site** → **Import an existing project**
2. **Deploy with GitHub**
3. Netlify demande quels dépôts il peut voir. Choisissez
   **Only select repositories** → `csa-web`.

   > Ne donnez pas accès à « All repositories ». Netlify n'a besoin que de
   > celui-ci.

4. Sélectionnez `csa-web`
5. Netlify lit le fichier `netlify.toml` du projet et remplit tout seul :

   | Champ | Valeur attendue |
   |---|---|
   | Branch to deploy | `main` |
   | Build command | `npm run build` |
   | Publish directory | `dist` |

   **Ne modifiez rien.** Si ces cases sont vides, c'est que `netlify.toml`
   n'a pas été envoyé — revenez à l'étape A3.

6. **Deploy csa-web**

La construction prend environ une minute. Netlify affiche le journal en
direct. À la fin, une adresse du type
`https://romantic-tesla-a1b2c3.netlify.app` apparaît : **votre site est en
ligne.**

## B3. Choisir une adresse présentable (2 min)

L'adresse générée est absurde. Changez-la :

**Site configuration** → **Site details** → **Change site name**
→ par exemple `csa-academy`.

Le site devient `https://csa-academy.netlify.app`. C'est cette adresse que
vous communiquez, sur WhatsApp comme sur Facebook.

---

# C. À partir de maintenant

Pour modifier le site, vous ne touchez plus jamais à Netlify. Vous modifiez
un fichier de `content/`, puis :

```bash
git add -A
git commit -m "Correction du tarif ISATIS"
git push
```

Netlify reconstruit et republie en une minute environ. C'est tout.

> **La règle qui ne change pas :** on écrit dans `content/`, jamais dans
> `dist/`. Tout `dist/` est écrasé à chaque construction.

---

# D. Ce qu'il reste à faire après la mise en ligne

Le site fonctionne, mais il n'est pas encore complet. Par ordre d'importance :

| À faire | Pourquoi c'est important | Où |
|---|---|---|
| **Brancher le formulaire** | Sans lui, les inscriptions basculent sur WhatsApp uniquement | [04-deploiement.md](04-deploiement.md), partie A |
| **Générer les 18 images** | Le site paraît inachevé sans elles | [prompts-images-ia.md](prompts-images-ia.md) |
| **Arbitrer les 3 tarifs** | Un prospect qui compare deux pages verra l'incohérence | Grille tarifaire du catalogue |
| **Trancher la charte graphique** | Bleu (site, logos) ou navy/orange (supports LaTeX) — pas les deux | — |
| **Collecter des témoignages** | Le levier de conversion le plus fort, aujourd'hui absent | `content/temoignages.json` |
| **Accord écrit de Bafoussam** | Nécessaire pour nommer les 4 établissements | — |

---

# E. Installer Node (facultatif, mais recommandé)

Le seul Node présent sur ce poste est la **version 6**, livrée avec l'éditeur
Brackets. Le projet en exige la **version 20**.

Cela n'empêche **pas** de publier — Netlify construit le site avec Node 20 sur
ses serveurs. Mais tant que Node 20 n'est pas installé localement, vous ne
pouvez pas :

- prévisualiser vos modifications avant publication (`npm run dev`)
- lancer les vérifications avant d'envoyer (`npm run verify`)

Vous travaillez donc à l'aveugle, en découvrant le résultat une fois en ligne.
C'est acceptable pour une correction de texte, risqué pour le reste.

**Pour l'installer :** <https://nodejs.org> → version **LTS** → installer →
**fermer et rouvrir le terminal**. Vérifiez ensuite :

```bash
node --version
```

Le résultat doit commencer par `v20` ou plus. Voir
[01-demarrage.md](01-demarrage.md).

---

# En cas de problème

| Symptôme | Cause probable | Solution |
|---|---|---|
| `remote origin already exists` | Commande déjà lancée | `git remote set-url origin <adresse>` |
| `Authentication failed` | Mot de passe au lieu d'un jeton | Voir l'encadré de A2 |
| `Updates were rejected` | GitHub a créé un README de son côté | Recréer le dépôt sans aucune case cochée |
| Netlify : cases de build vides | `netlify.toml` non envoyé | Vérifier A3, puis recommencer B2 |
| Netlify : *Build failed* | Une erreur dans le contenu | Lire le journal : la ligne fautive y est nommée |
| Site en ligne mais sans style | `dist` déposé au lieu d'être construit | Utiliser l'import GitHub, pas le glisser-déposer |

---

Précédent : [5. Architecture](05-architecture.md) ·
Voir aussi : [4. Déploiement et formulaire](04-deploiement.md)
