/** Enveloppe commune a toutes les pages : head, en-tete, pied, scripts. */

import { esc, chaque } from '../lib/html.mjs';
import { texteSeul } from '../lib/markdown.mjs';
import { lienWhatsApp } from '../lib/format.mjs';

const NAV = [
  ['index.html', 'Accueil', 'accueil'],
  ['formations.html', 'Formations', 'formations'],
  ['services.html', 'Services', 'services'],
  ['a-propos.html', 'À propos', 'a-propos'],
  ['inscription.html', "Je m'inscris", 'inscription'],
];

const ICONE_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4zM12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"/></svg>';

function entete(actif, prefixe, site) {
  const liens = chaque(NAV, ([url, libelle, cle]) => {
    const classe = cle === 'inscription'
      ? 'nav-lien nav-cta'
      : `nav-lien${cle === actif ? ' actif' : ''}`;
    return `<li><a class="${classe}" href="${prefixe}${url}">${esc(libelle)}</a></li>`;
  });

  return `
  <header class="entete">
    <div class="conteneur entete-interne">
      <a class="logo" href="${prefixe}index.html">
        <img src="${prefixe}images/brand/logo-csa.png" alt="" width="44" height="44">
        <span class="logo-texte">
          <strong>${esc(site.nom)}</strong>
          <small>${esc(site.slogan)}</small>
        </span>
      </a>
      <button class="burger" aria-expanded="false" aria-controls="nav-principale"
              aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
      <nav class="nav" id="nav-principale" aria-label="Navigation principale">
        <ul>${liens}</ul>
      </nav>
    </div>
  </header>`;
}

function pied(prefixe, site, formations) {
  const phares = chaque(
    formations.filter((f) => f.phare).slice(0, 6),
    (f) => `<li><a href="${prefixe}formations/${f.id}.html">${esc(f.nomCourt)}</a></li>`,
  );

  return `
  <footer class="pied">
    <div class="conteneur">
      <div class="pied-grille">
        <div>
          <p class="pied-titre">${esc(site.nomComplet)}</p>
          <p>${esc(site.sousTitre)}</p>
          <p class="pied-devise">« ${esc(site.baseline)} »</p>
        </div>
        <div>
          <p class="pied-titre">Formations phares</p>
          <ul>
            ${phares}
            <li><a href="${prefixe}formations.html">Voir tout le catalogue</a></li>
          </ul>
        </div>
        <div>
          <p class="pied-titre">Nous joindre</p>
          <ul>
            <li><a href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA, je souhaite des informations.')}"
                   target="_blank" rel="noopener">WhatsApp ${esc(site.whatsappAffiche)}</a></li>
            <li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
            <li><a href="${prefixe}inscription.html">Formulaire d'inscription</a></li>
            <li><a href="${prefixe}mentions.html">Mentions légales</a></li>
          </ul>
        </div>
      </div>
      <p class="pied-bas">
        © ${new Date().getFullYear()} ${esc(site.nomComplet)} —
        ${esc(site.pays)}. Tous droits réservés.
      </p>
    </div>
  </footer>`;
}

/**
 * Construit une page complete.
 * @param {object} o
 * @param {string} o.titre        titre de l'onglet
 * @param {string} o.description  meta description
 * @param {string} o.corps        HTML du contenu
 * @param {string} o.actif        cle de navigation active
 * @param {string} o.prefixe      '' a la racine, '../' dans un sous-dossier
 * @param {string} o.chemin       chemin relatif du fichier, pour l'URL canonique
 * @param {string} o.schema       bloc JSON-LD facultatif
 * @param {object} o.contenu      contenu global du site
 */
export function page(o) {
  const { site, formations } = o.contenu;
  const prefixe = o.prefixe ?? '';
  const desc = texteSeul(o.description, 158);
  const base = site.domaine ? `https://${site.domaine}/` : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.titre)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${esc(site.nomComplet)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(o.titre)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
${base && o.chemin ? `<link rel="canonical" href="${base}${o.chemin}">` : ''}
<link rel="stylesheet" href="${prefixe}assets/css/csa.css">
<link rel="icon" href="${prefixe}images/brand/favicon.png">
${o.schema || ''}
</head>
<body>
<a class="saut-contenu" href="#contenu">Aller au contenu</a>
${entete(o.actif, prefixe, site)}
<main id="contenu">
${o.corps}
</main>
${pied(prefixe, site, formations)}
<a class="bouton-wa-flottant"
   href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA, je souhaite des informations sur vos formations.')}"
   target="_blank" rel="noopener" aria-label="Nous écrire sur WhatsApp">
  ${ICONE_WA}
</a>
<script src="${prefixe}assets/js/config.js"></script>
<script src="${prefixe}assets/js/csa.js" defer></script>
</body>
</html>
`;
}
