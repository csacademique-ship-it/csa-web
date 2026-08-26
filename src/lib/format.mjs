/**
 * Mise en forme des tarifs et des libelles.
 *
 * C'est ici que vit la regle commerciale la plus importante du site :
 * un tarif qui n'est pas ferme n'est jamais publie.
 */

/**
 * 250000 -> "250 000".
 * Le separateur est une espace insecable etroite (U+202F), conforme a la
 * typographie francaise : le montant ne peut pas se couper en fin de ligne.
 */
export const SEPARATEUR_MILLIERS = '\u202f';

export function milliers(n) {
  return String(Math.round(Number(n) || 0))
    .replace(/\B(?=(\d{3})+(?!\d))/g, SEPARATEUR_MILLIERS);
}

/**
 * Tarif affichable pour une formation.
 *
 * REGLE : seuls les tarifs `statutPrix === "ferme"` sont publies.
 * Tout autre statut renvoie une formule neutre. Le controle
 * `scripts/check-content.mjs` verifie qu'aucun montant marque « propose »
 * ne se retrouve dans le HTML genere.
 */
export function prixAffiche(f) {
  if (f.statutPrix !== 'ferme') {
    if (f.statutPrix === 'devis') return 'Sur devis';
    return 'Tarif sur demande';
  }
  if (Number.isFinite(f.prix)) return `${milliers(f.prix)} FCFA`;
  if (Number.isFinite(f.prixMin) && Number.isFinite(f.prixMax)) {
    return `de ${milliers(f.prixMin)} à ${milliers(f.prixMax)} FCFA`;
  }
  return 'Tarif sur demande';
}

/** Legende sous le tarif : modalites de paiement ou motif de l'absence. */
export function prixNote(f) {
  switch (f.statutPrix) {
    case 'propose':
      return 'tarif communiqué sur demande';
    case 'aDefinir':
    case 'a_definir':
      return 'tarif en cours de finalisation';
    case 'devis':
      return 'mission sur mesure';
    default:
      return f.paiement || '';
  }
}

/** true si le tarif peut apparaitre publiquement. */
export function tarifPublic(f) {
  return f.statutPrix === 'ferme';
}

/** Lien WhatsApp avec message pre-rempli. */
export function lienWhatsApp(numero, message) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

const NOMBRES = [
  'zéro', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit',
  'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
  'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'vingt et une', 'vingt-deux',
  'vingt-trois', 'vingt-quatre', 'vingt-cinq', 'vingt-six', 'vingt-sept',
  'vingt-huit', 'vingt-neuf', 'trente',
];

/**
 * Nombre en toutes lettres, feminin (« dix-huit formations »).
 * Recalcule a chaque build : aucune page ne peut annoncer un nombre
 * de formations different du catalogue reel.
 */
export function enLettres(n, majuscule = false) {
  const mot = NOMBRES[n] ?? String(n);
  return majuscule ? mot.charAt(0).toUpperCase() + mot.slice(1) : mot;
}

/** Date ISO du jour, pour le sitemap. */
export function aujourdhui() {
  return new Date().toISOString().slice(0, 10);
}
