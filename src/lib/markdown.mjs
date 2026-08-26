/**
 * Rendu Markdown minimal, suffisant pour le contenu editorial de CSA.
 *
 * Sous-ensemble volontairement restreint et documente — il vaut mieux un
 * moteur de 100 lignes dont on connait exactement le comportement qu'une
 * dependance de 3 Mo dont on ne maitrise pas les cas limites.
 *
 * Pris en charge
 *   **gras**            -> <strong>
 *   *italique*          -> <em>
 *   `code`              -> <code>
 *   [texte](url)        -> <a>  (target=_blank ajoute pour les liens http)
 *   - item              -> <ul><li>
 *   1. item             -> <ol><li>
 *   > citation          -> <blockquote>
 *   ligne vide          -> separateur de paragraphe
 *
 * NON pris en charge, volontairement : tableaux, images, HTML brut,
 * titres dans le corps (les titres structurent le fichier, ils sont
 * consommes par le parseur de sections).
 */

import { esc } from './html.mjs';

/** Rendu des marques de niveau caractere (gras, italique, code, liens). */
export function enligne(texte) {
  if (!texte) return '';

  // Le code est protege en premier : son contenu ne doit subir aucun
  // autre traitement. On le remplace par un jeton, puis on le restitue.
  // Jeton delimite par NUL : ce caractere n'apparait jamais dans le
  // contenu et traverse `esc` et les regex de mise en forme intact.
  const codes = [];
  let s = String(texte).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\u0000CODE${codes.length - 1}\u0000`;
  });

  s = esc(s);

  // liens avant gras/italique : un libelle peut contenir du gras
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, libelle, url) => {
    const externe = /^https?:/i.test(url);
    const sup = externe ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${url}"${sup}>${libelle}</a>`;
  });

  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  return s.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
}

/**
 * Rendu d'un bloc de texte complet : paragraphes, listes, citations.
 * Retourne du HTML pret a inserer.
 */
export function bloc(texte) {
  if (!texte) return '';
  const lignes = String(texte).replace(/\r\n/g, '\n').split('\n');
  const sortie = [];

  let tampon = [];   // paragraphe en cours
  let liste = null;  // { type: 'ul' | 'ol', items: [] }
  let citation = [];

  const viderParagraphe = () => {
    if (tampon.length) {
      sortie.push(`<p>${enligne(tampon.join(' '))}</p>`);
      tampon = [];
    }
  };
  const viderListe = () => {
    if (liste) {
      const items = liste.items.map((i) => `<li>${enligne(i)}</li>`).join('');
      sortie.push(`<${liste.type}>${items}</${liste.type}>`);
      liste = null;
    }
  };
  const viderCitation = () => {
    if (citation.length) {
      sortie.push(`<blockquote>${bloc(citation.join('\n'))}</blockquote>`);
      citation = [];
    }
  };
  const viderTout = () => {
    viderParagraphe();
    viderListe();
    viderCitation();
  };

  for (const brute of lignes) {
    const ligne = brute.trimEnd();

    if (!ligne.trim()) {
      viderTout();
      continue;
    }

    const puce = ligne.match(/^\s*[-*]\s+(.*)$/);
    const numero = ligne.match(/^\s*\d+\.\s+(.*)$/);
    const cite = ligne.match(/^\s*>\s?(.*)$/);

    if (cite) {
      viderParagraphe();
      viderListe();
      citation.push(cite[1]);
      continue;
    }
    viderCitation();

    if (puce) {
      viderParagraphe();
      if (!liste || liste.type !== 'ul') {
        viderListe();
        liste = { type: 'ul', items: [] };
      }
      liste.items.push(puce[1]);
      continue;
    }

    if (numero) {
      viderParagraphe();
      if (!liste || liste.type !== 'ol') {
        viderListe();
        liste = { type: 'ol', items: [] };
      }
      liste.items.push(numero[1]);
      continue;
    }

    viderListe();
    tampon.push(ligne.trim());
  }

  viderTout();
  return sortie.join('\n');
}

/** Texte brut, sans balise — pour les meta description et les attributs. */
export function texteSeul(md, longueurMax = 0) {
  let s = String(md || '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (longueurMax && s.length > longueurMax) {
    s = `${s.slice(0, longueurMax - 1).replace(/[\s,;:.]+$/, '')}…`;
  }
  return s;
}
