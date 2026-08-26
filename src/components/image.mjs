/**
 * Visuel de formation.
 *
 * Les images sont produites par intelligence artificielle et deposees
 * manuellement dans `public/images/formations/`. Le nom du fichier doit
 * etre l'identifiant de la formation, avec l'une des extensions admises.
 *
 *   public/images/formations/leapfrog-geo.webp
 *   public/images/formations/acp-rstudio.jpg
 *
 * Les prompts a utiliser sont dans `docs/prompts-images-ia.md`.
 *
 * Tant qu'une image est absente, un bloc de remplacement aux couleurs CSA
 * est affiche a sa place — jamais une image cassee, jamais un trou dans la
 * mise en page. `npm run check` liste les images manquantes.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { PUBLIC } from '../lib/chemins.mjs';
import { esc } from '../lib/html.mjs';

/** Extensions acceptees, par ordre de preference. */
export const EXTENSIONS = ['avif', 'webp', 'jpg', 'jpeg', 'png'];

const DOSSIER = join(PUBLIC, 'images', 'formations');

/** Chemin web de l'image d'une formation, ou null si aucune n'existe. */
export function trouverImage(id) {
  for (const ext of EXTENSIONS) {
    if (existsSync(join(DOSSIER, `${id}.${ext}`))) {
      return `images/formations/${id}.${ext}`;
    }
  }
  return null;
}

/** Liste des formations sans visuel. */
export function imagesManquantes(formations) {
  return formations.filter((f) => !trouverImage(f.id)).map((f) => f.id);
}

/**
 * Rend le visuel d'une formation.
 * @param {object} f       formation
 * @param {string} prefixe prefixe de chemin ('' ou '../')
 * @param {object} options { classe, priorite }
 */
export function visuel(f, prefixe = '', options = {}) {
  const { classe = 'visuel', priorite = false } = options;
  const src = trouverImage(f.id);
  const alt = `${f.nomCourt} — ${f.categorie}`;

  if (!src) {
    // Remplacement volontairement sobre et lisible, pas un placeholder gris
    return `<div class="${classe} visuel-attente" role="img" aria-label="${esc(alt)}">
        <span class="visuel-attente-cat">${esc(f.categorie)}</span>
        <span class="visuel-attente-nom">${esc(f.nomCourt)}</span>
      </div>`;
  }

  const chargement = priorite
    ? ' fetchpriority="high"'
    : ' loading="lazy" decoding="async"';

  return `<div class="${classe}">
      <img src="${prefixe}${src}" alt="${esc(alt)}"
           width="1200" height="675"${chargement}>
    </div>`;
}
