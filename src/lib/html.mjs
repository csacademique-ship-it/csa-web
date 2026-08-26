/**
 * Aides HTML de bas niveau.
 *
 * Aucune dependance. Toute chaine qui provient du contenu passe par `esc`
 * avant d'atterrir dans le HTML — sauf le Markdown rendu, qui produit ses
 * propres balises et echappe deja son texte.
 */

const ENTITES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Echappe une chaine destinee au corps du document ou a un attribut. */
export function esc(valeur) {
  if (valeur === null || valeur === undefined) return '';
  return String(valeur).replace(/[&<>"']/g, (c) => ENTITES[c]);
}

/**
 * Construit une chaine d'attributs HTML.
 * Les valeurs `false`, `null` et `undefined` suppriment l'attribut ;
 * `true` produit un attribut booleen sans valeur.
 */
export function attrs(objet = {}) {
  return Object.entries(objet)
    .filter(([, v]) => v !== false && v !== null && v !== undefined)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');
}

/** Concatene des fragments en ignorant les valeurs vides. */
export function joindre(...morceaux) {
  return morceaux.flat(Infinity).filter(Boolean).join('');
}

/** Repete un fragment pour chaque element d'une liste. */
export function chaque(liste, fn) {
  return (liste || []).map(fn).join('');
}

/** Retire l'indentation commune d'un litteral de gabarit. */
export function deplier(chaine) {
  const lignes = chaine.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const indent = Math.min(
    ...lignes.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length),
  );
  return lignes.map((l) => l.slice(indent)).join('\n');
}

/** Transforme un titre en identifiant utilisable comme ancre. */
export function slug(texte) {
  return String(texte)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
