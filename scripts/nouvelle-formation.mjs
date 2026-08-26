#!/usr/bin/env node
/**
 * Cree une fiche formation prete a remplir.
 *
 *   npm run nouvelle-formation -- mon-identifiant
 *
 * Genere content/formations/mon-identifiant.md avec toutes les sections
 * attendues et des indications de redaction. Le fichier est volontairement
 * incomplet : le build refusera de passer tant que les sections ne sont pas
 * remplies, ce qui evite qu'une fiche vide se retrouve en ligne.
 */

import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENU } from '../src/lib/chemins.mjs';

const id = process.argv[2];

if (!id) {
  console.error(`
  Usage : npm run nouvelle-formation -- <identifiant>

  L'identifiant sert de nom de fichier ET d'adresse de la page.
  En minuscules, sans accent, mots separes par des tirets.

  Exemples : leapfrog-geo · acp-rstudio · sig-teledetection-pollution
`);
  process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  console.error(`\n  Identifiant invalide : « ${id} »`);
  console.error('  Minuscules, chiffres et tirets uniquement.\n');
  process.exit(1);
}

const chemin = join(CONTENU, 'formations', `${id}.md`);
if (existsSync(chemin)) {
  console.error(`\n  content/formations/${id}.md existe deja.\n`);
  process.exit(1);
}

const frontMatter = {
  id,
  nom: 'Titre complet de la formation',
  nomCourt: 'Titre court',
  categorie: 'Logiciels miniers',
  resume: 'Une ou deux phrases : ce que la formation permet de faire.',
  accroche: 'Une phrase courte et frappante, reprise en bas de page.',
  phare: false,
  nouveau: true,
  image: id,
  video: '',
  videoLegende: '',
  prix: null,
  statutPrix: 'propose',
  paiement: '60 % avant le démarrage, 40 % à mi-parcours',
  duree: '4 semaines',
  seances: '12 séances (3 par semaine)',
  format: '100 % en ligne',
  outils: 'Logiciels et bibliothèques utilisés',
};

const modele = `---
${JSON.stringify(frontMatter, null, 2)}
---

## Problème

Le problème concret que rencontre la personne AVANT la formation.
Écrivez-le de son point de vue, pas du vôtre. Un paragraphe suffit.

## Promesse

Ce qu'elle saura faire APRÈS. Une phrase, la plus concrète possible.

## Licence

Section facultative — à supprimer si le logiciel est gratuit.
Si le logiciel est propriétaire, dire clairement que **CSA ne fournit pas
de licence** et inviter la personne à en parler avant de payer.

## Public

- Premier profil visé
- Deuxième profil visé
- Troisième profil visé

## Prérequis

- Ce qu'il faut savoir avant
- Ce qu'il n'est PAS nécessaire de savoir

## Acquis

- Compétence 1, formulée avec un verbe d'action
- Compétence 2
- Compétence 3

## Programme

### Semaine 1 — Titre du module

**Objectif :** une phrase.

Le contenu de la séance, en prose. Ce qui est montré, ce qui est pratiqué,
les pièges signalés.

**Livrable :** ce que la personne produit à la fin de ce module.

### Semaine 2 — Titre du module

**Objectif :** ...

**Livrable :** ...

## Fil rouge

Le jeu de données unique qui traverse toute la formation. D'où il vient,
ce qu'il contient, ce qu'on en tire à la fin.

## Preuves

### Premier élément de preuve

Explication en une ou deux phrases.

### Deuxième élément de preuve

Explication.

## Différenciateurs

- **Ce qui distingue** cette formation des autres
- Deuxième différenciateur
- Troisième différenciateur

## FAQ

### Première objection réelle d'un prospect ?

Réponse honnête, y compris quand elle ne nous arrange pas.

### Deuxième objection ?

Réponse.
`;

writeFileSync(chemin, modele, 'utf8');

console.log(`
  Créé : content/formations/${id}.md

  Étapes suivantes
    1. Remplissez le fichier (VSCode : Ctrl+P puis ${id}.md)
    2. Déposez le visuel : public/images/formations/${id}.webp
       Prompt à utiliser : docs/prompts-images-ia.md
    3. npm run build
    4. Ajustez le nombre de formations dans content/site.json si besoin —
       le build vous préviendra en cas d'incohérence
`);
