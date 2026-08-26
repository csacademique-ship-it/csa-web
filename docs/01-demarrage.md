# 1. Démarrage

## Ce qu'il faut installer

**Une seule chose : Node.js version 20 ou plus.**

1. Allez sur <https://nodejs.org>
2. Téléchargez la version marquée **LTS**
3. Installez-la en cliquant « Suivant » partout
4. Redémarrez votre ordinateur

Pour vérifier, ouvrez un terminal et tapez :

```bash
node --version
```

Vous devez voir `v20.x.x` ou plus. Si vous voyez une erreur, Node n'est pas
installé correctement.

> **Il n'y a rien d'autre à installer.** Ce projet n'utilise aucune
> bibliothèque externe. Pas de `npm install`, pas de `node_modules`, pas de
> mise à jour de sécurité à surveiller.

---

## Ouvrir le projet

### Dans VSCode

1. Ouvrez VSCode
2. **Fichier → Ouvrir le dossier** → sélectionnez `csa-web`
3. VSCode vous proposera d'installer quelques extensions recommandées :
   acceptez, elles rendent l'édition plus confortable
4. **Terminal → Nouveau terminal**

### Dans Claude Code

```bash
cd chemin/vers/csa-web
claude
```

Le fichier `README.md` à la racine décrit le projet ; Claude Code le lira
automatiquement.

---

## Lancer le site en local

```bash
npm run dev
```

Vous verrez :

```
  CSA — serveur de developpement
  http://localhost:4321
  Ctrl+C pour arreter
```

Ouvrez cette adresse dans votre navigateur. **Le site tourne sur votre
ordinateur uniquement** — personne d'autre ne le voit.

Modifiez un fichier dans `content/`, enregistrez, rechargez la page du
navigateur : votre modification est là.

Pour arrêter le serveur : `Ctrl+C` dans le terminal.

---

## Avant de mettre en ligne

Une seule commande vérifie tout :

```bash
npm run verify
```

Elle enchaîne trois choses :

1. **le build** — construit le site, s'arrête net si une fiche est mal formée
2. **les contrôles** — balises HTML, liens cassés, référencement, règles CSA
3. **les tests** — 32 vérifications automatiques

Si tout est vert, le site est bon à publier. Si quelque chose échoue, le
message vous dit exactement quel fichier et quelle ligne poser problème.

---

## Erreurs fréquentes au démarrage

| Message | Cause | Solution |
|---|---|---|
| `node : commande introuvable` | Node non installé ou terminal non redémarré | Réinstaller Node, rouvrir le terminal |
| `EADDRINUSE :4321` | Le serveur tourne déjà dans un autre terminal | `npm run dev -- 4322` pour changer de port |
| `BUILD INTERROMPU` suivi d'un nom de fichier | Une fiche formation est incomplète | Le message indique la section manquante |

---

Suite : [2. Modifier le contenu](02-modifier-le-contenu.md)
