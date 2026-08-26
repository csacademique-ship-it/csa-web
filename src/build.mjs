#!/usr/bin/env node
/**
 * Point d'entree du build.
 *
 *   node src/build.mjs           construit dist/
 *   node src/build.mjs --quiet   sans le detail des fichiers
 *
 * Aucune dependance npm. Node 20 ou superieur.
 */

import { rmSync, mkdirSync, writeFileSync, cpSync, statSync, readdirSync }
  from 'node:fs';
import { join, dirname } from 'node:path';
import { RACINE, PUBLIC, DIST } from './lib/chemins.mjs';
import { chargerContenu } from './lib/content.mjs';
import { aujourdhui, enLettres } from './lib/format.mjs';
import { imagesManquantes } from './components/image.mjs';
import { pageFormation } from './pages/formation.mjs';
import { pageInscription } from './pages/inscription.mjs';
import {
  pageAccueil, pageCatalogue, pageServices, pageAPropos, pageMentions,
  pageMerci,
} from './pages/institutionnelles.mjs';

const silencieux = process.argv.includes('--quiet');
const log = (...a) => { if (!silencieux) console.log(...a); };

function ecrire(fichiers, chemin, contenu) {
  const complet = join(DIST, chemin);
  mkdirSync(dirname(complet), { recursive: true });
  writeFileSync(complet, contenu, 'utf8');
  fichiers.push([chemin, Buffer.byteLength(contenu, 'utf8')]);
}

function sitemap(contenu) {
  const { site, formations } = contenu;
  const base = site.domaine ? `https://${site.domaine}/` : '/';
  const date = aujourdhui();
  const urls = [
    ['index.html', '1.0'],
    ['formations.html', '0.9'],
    ['services.html', '0.7'],
    ['a-propos.html', '0.6'],
    ['inscription.html', '0.8'],
    ['mentions.html', '0.2'],
    ...formations.map((f) => [`formations/${f.id}.html`, '0.8']),
  ];
  const corps = urls.map(([u, p]) =>
    `  <url><loc>${base}${u}</loc><lastmod>${date}</lastmod>`
    + `<priority>${p}</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${corps}
</urlset>
`;
}

function robots(site) {
  const base = site.domaine ? `https://${site.domaine}/` : '';
  return `User-agent: *
Allow: /
${base ? `Sitemap: ${base}sitemap.xml` : ''}
`;
}

/** Injecte l'URL du formulaire dans le JS client, sans le dupliquer. */
function configClient(site) {
  return `/* Genere par le build — ne pas modifier a la main. */
window.CSA_CONFIG = ${JSON.stringify({
    urlFormulaire: site.urlFormulaire,
    whatsapp: site.whatsapp,
    whatsappAffiche: site.whatsappAffiche,
  }, null, 2)};
`;
}

export function construire() {
  const debut = Date.now();
  const contenu = chargerContenu();
  const { site, formations } = contenu;

  rmSync(DIST, { recursive: true, force: true });
  mkdirSync(DIST, { recursive: true });

  // 1. actifs statiques copies tels quels
  cpSync(PUBLIC, DIST, { recursive: true });

  const fichiers = [];

  // 2. pages institutionnelles
  ecrire(fichiers, 'index.html', pageAccueil(contenu));
  ecrire(fichiers, 'formations.html', pageCatalogue(contenu));
  ecrire(fichiers, 'services.html', pageServices(contenu));
  ecrire(fichiers, 'a-propos.html', pageAPropos(contenu));
  ecrire(fichiers, 'inscription.html', pageInscription(contenu));
  ecrire(fichiers, 'merci.html', pageMerci(contenu));
  ecrire(fichiers, 'mentions.html', pageMentions(contenu));

  // 3. une page par formation
  for (const f of formations) {
    ecrire(fichiers, `formations/${f.id}.html`, pageFormation(f, contenu));
  }

  // 4. fichiers techniques
  ecrire(fichiers, 'sitemap.xml', sitemap(contenu));
  ecrire(fichiers, 'robots.txt', robots(site));
  ecrire(fichiers, 'assets/js/config.js', configClient(site));

  // ── rapport ──────────────────────────────────────────────────────
  const duree = Date.now() - debut;
  log('='.repeat(70));
  log(`  BUILD — ${fichiers.length} fichiers generes en ${duree} ms`);
  log('='.repeat(70));

  if (!silencieux) {
    for (const [nom, taille] of fichiers.sort()) {
      log(`  ${nom.padEnd(50)} ${(taille / 1024).toFixed(1).padStart(7)} Ko`);
    }
  }

  const poids = poidsDossier(DIST);
  log(`\n  Poids total de dist/ : ${(poids / 1024).toFixed(0)} Ko`);

  return { contenu, fichiers, poids, duree };
}

function poidsDossier(dossier) {
  let total = 0;
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, e.name);
    total += e.isDirectory() ? poidsDossier(chemin) : statSync(chemin).size;
  }
  return total;
}

/** Controles metier affiches apres chaque build. */
export function controles(contenu) {
  const { site, formations, references, temoignages } = contenu;
  const alertes = [];
  const ok = [];

  const proposes = formations.filter((f) => f.statutPrix !== 'ferme');
  if (proposes.length) {
    ok.push(`${proposes.length} tarif(s) non fermes masques « sur demande » :\n`
      + proposes.map((f) => `        - ${f.nomCourt} (${f.statutPrix})`).join('\n'));
  }

  const sansAccord = references.filter((r) => !r.accord);
  if (sansAccord.length) {
    alertes.push(`${sansAccord.length} reference(s) SANS accord ecrit — `
      + `anonymisee(s) :\n`
      + sansAccord.map((r) => `        - ${r.nom}`).join('\n'));
  }

  if (!temoignages.length) {
    alertes.push('AUCUN temoignage collecte -> emplacement visible affiche');
  }

  if (!site.urlFormulaire || site.urlFormulaire.startsWith('REMPLACER')) {
    alertes.push('URL du formulaire NON configuree -> repli WhatsApp');
  }

  const annonce = site.chiffres.find((c) => /formation/i.test(c.libelle));
  if (!annonce) {
    alertes.push("content/site.json : aucun chiffre « formations au catalogue »");
  } else if (String(annonce.valeur) !== String(formations.length)) {
    alertes.push(`INCOHERENCE : le bandeau annonce ${annonce.valeur} formations, `
      + `le catalogue en contient ${formations.length}`);
  } else {
    ok.push(`bandeau de confiance coherent : ${formations.length} formations `
      + `(${enLettres(formations.length)})`);
  }

  const sansImage = imagesManquantes(formations);
  if (sansImage.length) {
    alertes.push(`${sansImage.length} visuel(s) manquant(s) sur ${formations.length} `
      + `-> bloc de remplacement affiche.\n`
      + `        Deposez les images dans public/images/formations/ :\n`
      + sansImage.map((id) => `        - ${id}.webp`).join('\n')
      + `\n        Prompts prets a l'emploi : docs/prompts-images-ia.md`);
  } else {
    ok.push(`${formations.length} visuels presents`);
  }

  return { ok, alertes };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const { contenu } = construire();
    const { ok, alertes } = controles(contenu);
    console.log(`\n${'='.repeat(70)}`);
    console.log('  CONTROLES');
    console.log('='.repeat(70));
    for (const m of ok) console.log(`  OK  ${m}`);
    for (const m of alertes) console.log(`  !!  ${m}`);
    console.log('');
  } catch (e) {
    console.error(`\nBUILD INTERROMPU\n\n${e.message}\n`);
    process.exit(1);
  }
}
