/**
 * Galerie photo « CSA sur le terrain ».
 *
 * Le contenu vit dans `content/galerie.json`, les fichiers dans
 * `public/images/galerie/`. Une photo declaree mais absente du disque est
 * ignoree silencieusement : la galerie reste correcte, elle est seulement
 * plus courte. Jamais d'image cassee sur le site.
 *
 * Ces photos montrent des personnes reconnaissables. Elles ne sont publiees
 * qu'avec l'accord des personnes et des etablissements concernes. Pour en
 * retirer une, il suffit de supprimer son entree de `galerie.json`.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { PUBLIC } from '../lib/chemins.mjs';
import { esc, chaque } from '../lib/html.mjs';

const DOSSIER = join(PUBLIC, 'images', 'galerie');
const MARQUE = join(PUBLIC, 'images', 'brand');

/**
 * Chemin web d'un visuel de marque (photo d'ouverture, portrait), ou `null`
 * s'il n'a pas ete depose. Les pages s'en servent pour n'afficher le bloc
 * que lorsque l'image existe reellement.
 */
export function photoMarque(fichier) {
  return existsSync(join(MARQUE, fichier)) ? `images/brand/${fichier}` : null;
}

/** Photos declarees ET presentes sur le disque. */
export function photosDisponibles(galerie) {
  if (!galerie || !Array.isArray(galerie.photos)) return [];
  return galerie.photos.filter((p) => p.fichier
    && existsSync(join(DOSSIER, p.fichier)));
}

/** Photos declarees mais absentes du disque — signalees par `npm run check`. */
export function photosManquantes(galerie) {
  if (!galerie || !Array.isArray(galerie.photos)) return [];
  return galerie.photos
    .filter((p) => !p.fichier || !existsSync(join(DOSSIER, p.fichier)))
    .map((p) => p.fichier || '(fichier non renseigne)');
}

/**
 * Rend la section galerie.
 * @param {object} galerie contenu de content/galerie.json
 * @param {string} prefixe prefixe de chemin ('' ou '../')
 * @param {object} options { classeSection }
 */
export function sectionGalerie(galerie, prefixe = '', options = {}) {
  const photos = photosDisponibles(galerie);
  if (photos.length === 0) return '';

  const { classeSection = 'section' } = options;

  const items = chaque(photos, (p, i) => `
        <figure class="galerie-item">
          <img src="${prefixe}images/galerie/${esc(p.fichier)}"
               alt="${esc(p.alt || p.legende || '')}"
               width="900" height="600"
               loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async">
          ${p.legende ? `<figcaption>${esc(p.legende)}</figcaption>` : ''}
        </figure>`);

  return `
  <section class="${classeSection}">
    <div class="conteneur">
      <h2 class="section-titre">${esc(galerie.titre || 'En images')}</h2>
      ${galerie.intro
        ? `<p class="section-intro">${esc(galerie.intro)}</p>` : ''}
      <div class="galerie">${items}</div>
    </div>
  </section>`;
}
