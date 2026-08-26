/**
 * Lecture des fichiers de contenu : front matter JSON + corps Markdown
 * decoupe en sections par les titres.
 *
 * Format attendu :
 *
 *   ---
 *   { "id": "...", "nom": "..." }
 *   ---
 *
 *   ## Problème
 *   texte...
 *
 *   ## Programme
 *
 *   ### Module 1 — Titre
 *   corps...
 *
 * Le front matter est du JSON, pas du YAML : c'est un choix. Le JSON a une
 * grammaire sans ambiguite, `JSON.parse` signale la ligne exacte d'une
 * erreur, et aucun analyseur maison n'est necessaire.
 */

const SEPARATEUR = /^---\s*$/;

/**
 * Separe le front matter du corps.
 * @returns {{ donnees: object, corps: string }}
 */
export function separer(texte, chemin = '(inconnu)') {
  const lignes = String(texte).replace(/^﻿/, '').split('\n');

  if (!SEPARATEUR.test(lignes[0] ?? '')) {
    throw new Error(
      `${chemin} : le fichier doit commencer par une ligne « --- » ` +
      'ouvrant le front matter JSON.',
    );
  }

  const fin = lignes.findIndex((l, i) => i > 0 && SEPARATEUR.test(l));
  if (fin === -1) {
    throw new Error(`${chemin} : front matter non referme (« --- » manquant).`);
  }

  const brut = lignes.slice(1, fin).join('\n');
  let donnees;
  try {
    donnees = JSON.parse(brut);
  } catch (e) {
    throw new Error(`${chemin} : front matter JSON invalide — ${e.message}`);
  }

  return { donnees, corps: lignes.slice(fin + 1).join('\n').trim() };
}

/**
 * Decoupe un corps Markdown en sections de niveau 2.
 * @returns {Map<string, string>} titre de section -> contenu brut
 */
export function sections(corps) {
  const resultat = new Map();
  let titre = null;
  let tampon = [];

  const vider = () => {
    if (titre !== null) resultat.set(titre, tampon.join('\n').trim());
    tampon = [];
  };

  for (const ligne of String(corps).split('\n')) {
    const h2 = ligne.match(/^##\s+(?!#)(.+?)\s*$/);
    if (h2) {
      vider();
      titre = h2[1].trim();
    } else {
      tampon.push(ligne);
    }
  }
  vider();
  return resultat;
}

/**
 * Decoupe une section en sous-parties de niveau 3.
 * @returns {Array<{titre: string, corps: string}>}
 */
export function sousSections(section) {
  const resultat = [];
  let courante = null;

  for (const ligne of String(section || '').split('\n')) {
    const h3 = ligne.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      if (courante) {
        courante.corps = courante.corps.trim();
        resultat.push(courante);
      }
      courante = { titre: h3[1].trim(), corps: '' };
    } else if (courante) {
      courante.corps += `${ligne}\n`;
    }
  }
  if (courante) {
    courante.corps = courante.corps.trim();
    resultat.push(courante);
  }
  return resultat;
}

/**
 * Extrait les items d'une liste a puces.
 * Les lignes qui ne sont pas des puces sont ignorees.
 */
export function puces(section) {
  return String(section || '')
    .split('\n')
    .map((l) => l.match(/^\s*[-*]\s+(.*)$/))
    .filter(Boolean)
    .map((m) => m[1].trim())
    .filter(Boolean);
}
