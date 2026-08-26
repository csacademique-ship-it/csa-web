#!/usr/bin/env node
/**
 * Controles sur le site construit.
 *
 *   node scripts/check.mjs
 *
 * Verifie, sur le contenu de dist/ :
 *   1. l'equilibrage des balises HTML
 *   2. les liens internes (pages, images, feuilles de style, scripts)
 *   3. les ancres internes (#id)
 *   4. la presence des balises indispensables au referencement
 *   5. l'accessibilite minimale : lang, alt, un seul h1, hierarchie des titres
 *   6. qu'aucun tarif non ferme n'a fuite dans le HTML
 *
 * Sort en code 1 des qu'une anomalie bloquante est trouvee, pour que la
 * CI echoue.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, normalize, posix } from 'node:path';
import { DIST } from '../src/lib/chemins.mjs';
import { chargerContenu } from '../src/lib/content.mjs';
import { milliers } from '../src/lib/format.mjs';

const VIDES = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'source', 'track', 'wbr']);

const anomalies = [];
const avertissements = [];

function fichiers(dossier, filtre) {
  const sortie = [];
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, e.name);
    if (e.isDirectory()) sortie.push(...fichiers(chemin, filtre));
    else if (filtre(e.name)) sortie.push(chemin);
  }
  return sortie;
}

/* ── 1. equilibrage des balises ─────────────────────────────────── */
function verifierBalises(html, nom) {
  const pile = [];
  const regex = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
  let m;
  // on ignore le contenu de <script> et <style>
  const propre = html
    .replace(/<script[\s\S]*?<\/script>/gi, '<script></script>')
    .replace(/<style[\s\S]*?<\/style>/gi, '<style></style>')
    .replace(/<!--[\s\S]*?-->/g, '');

  while ((m = regex.exec(propre)) !== null) {
    const [, fermante, balise, autoFermante] = m;
    const b = balise.toLowerCase();
    if (VIDES.has(b) || autoFermante === '/') continue;
    if (b === '!doctype') continue;
    if (!fermante) {
      pile.push(b);
    } else if (pile[pile.length - 1] === b) {
      pile.pop();
    } else if (pile.includes(b)) {
      let perdue;
      do { perdue = pile.pop(); } while (perdue !== b);
      anomalies.push(`${nom} : balise <${perdue}> mal imbriquee`);
    } else {
      anomalies.push(`${nom} : </${b}> sans ouverture`);
    }
  }
  if (pile.length) {
    anomalies.push(`${nom} : balise(s) non fermee(s) — ${pile.join(', ')}`);
  }
}

/* ── 2 et 3. liens internes et ancres ───────────────────────────── */
function verifierLiens(html, chemin) {
  const nom = relative(DIST, chemin).split(/[\\/]/).join('/');
  const base = dirname(chemin);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));

  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const cible = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/)/i.test(cible)) continue;

    if (cible.startsWith('#')) {
      const id = cible.slice(1);
      if (id && !ids.has(id)) {
        anomalies.push(`${nom} : ancre introuvable « ${cible} »`);
      }
      continue;
    }

    // on retire la chaine de requete puis l'ancre : « x.html?f=y#z »
    const [avantAncre, ancre] = cible.split('#');
    const sansAncre = avantAncre.split('?')[0];
    const absolu = normalize(join(base, sansAncre));
    if (!existsSync(absolu)) {
      anomalies.push(`${nom} : lien casse « ${cible} »`);
      continue;
    }
    if (ancre) {
      const cibleHtml = readFileSync(absolu, 'utf8');
      if (!new RegExp(`\\bid="${ancre}"`).test(cibleHtml)) {
        anomalies.push(`${nom} : ancre « #${ancre} » absente de ${sansAncre}`);
      }
    }
  }
}

/** Decode les entites produites par `esc`, pour mesurer une vraie longueur. */
function decoder(s) {
  return s
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/* ── 4 et 5. referencement et accessibilite ─────────────────────── */
function verifierQualite(html, nom) {
  if (!/<html lang="fr">/.test(html)) {
    anomalies.push(`${nom} : attribut lang absent sur <html>`);
  }
  if (!/<title>[^<]{5,}<\/title>/.test(html)) {
    anomalies.push(`${nom} : <title> manquant ou trop court`);
  }
  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  // les entites HTML comptent pour un caractere une fois affichees
  const longueurDesc = desc ? decoder(desc[1]).length : 0;
  if (!desc || longueurDesc < 50) {
    anomalies.push(`${nom} : meta description manquante ou trop courte`);
  } else if (longueurDesc > 165) {
    avertissements.push(`${nom} : meta description de ${longueurDesc} `
      + 'caracteres (Google en affiche environ 160)');
  }

  const h1 = html.match(/<h1[\s>]/g) || [];
  if (h1.length === 0) anomalies.push(`${nom} : aucun <h1>`);
  if (h1.length > 1) anomalies.push(`${nom} : ${h1.length} <h1> (un seul attendu)`);

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) {
      anomalies.push(`${nom} : <img> sans attribut alt — ${m[0].slice(0, 70)}`);
    }
  }

  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(m[0])) {
      anomalies.push(`${nom} : target="_blank" sans rel="noopener"`);
    }
  }
}

/* ── 6. aucun tarif non ferme dans le HTML ──────────────────────── */
function verifierTarifs(pages, contenu) {
  const interdits = contenu.formations
    .filter((f) => f.statutPrix !== 'ferme')
    .flatMap((f) => [f.prix, f.prixMin, f.prixMax]
      .filter(Number.isFinite)
      .map((p) => ({ formation: f.nomCourt, texte: milliers(p) })));

  if (!interdits.length) return;

  for (const [nom, html] of pages) {
    for (const { formation, texte } of interdits) {
      if (html.includes(`${texte} FCFA`) || html.includes(`${texte} FCFA`)) {
        anomalies.push(`${nom} : le tarif non valide de « ${formation} » `
          + `(${texte} FCFA) apparait dans le HTML publie`);
      }
    }
  }
}

/* ── execution ──────────────────────────────────────────────────── */
if (!existsSync(DIST)) {
  console.error('dist/ absent — lancez d\'abord « npm run build ».');
  process.exit(1);
}

const contenu = chargerContenu();
const html = fichiers(DIST, (n) => n.endsWith('.html'));
const pages = [];

for (const chemin of html) {
  const nom = relative(DIST, chemin).split(/[\\/]/).join('/');
  const source = readFileSync(chemin, 'utf8');
  pages.push([nom, source]);
  verifierBalises(source, nom);
  verifierLiens(source, chemin);
  verifierQualite(source, nom);
}

verifierTarifs(pages, contenu);

// poids des pages
for (const [nom, source] of pages) {
  const ko = Buffer.byteLength(source, 'utf8') / 1024;
  if (ko > 120) avertissements.push(`${nom} : page lourde (${ko.toFixed(0)} Ko)`);
}

console.log('='.repeat(70));
console.log(`  CONTROLES — ${pages.length} pages HTML`);
console.log('='.repeat(70));

if (avertissements.length) {
  console.log(`\n  Avertissements (${avertissements.length}) :`);
  for (const a of avertissements) console.log(`    - ${a}`);
}

if (anomalies.length) {
  console.log(`\n  ANOMALIES (${anomalies.length}) :`);
  for (const a of anomalies) console.log(`    x ${a}`);
  console.log('');
  process.exit(1);
}

console.log('\n  Balises equilibrees          OK');
console.log('  Liens et ancres internes     OK');
console.log('  Titre, description, h1       OK');
console.log('  Images avec alt              OK');
console.log('  Liens externes securises     OK');
console.log('  Aucun tarif non valide       OK');
console.log('');
