/** Chemins du projet, resolus depuis l'emplacement de ce fichier. */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ICI = dirname(fileURLToPath(import.meta.url));

/** Racine du projet csa-web/ */
export const RACINE = join(ICI, '..', '..');

export const CONTENU = join(RACINE, 'content');
export const PUBLIC = join(RACINE, 'public');
export const DIST = join(RACINE, 'dist');
export const DOCS = join(RACINE, 'docs');
