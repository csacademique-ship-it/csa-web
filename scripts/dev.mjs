#!/usr/bin/env node
/**
 * Serveur de developpement.
 *
 *   npm run dev            ->  http://localhost:4321
 *   npm run dev -- 8080    ->  autre port
 *
 * Reconstruit le site a chaque modification de content/, src/ ou public/,
 * puis sert dist/. Aucune dependance : `http` et `fs.watch` suffisent.
 * Le navigateur ne se rafraichit pas tout seul — rechargez la page.
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, watch } from 'node:fs';
import { join, extname } from 'node:path';
import { RACINE, DIST, CONTENU, PUBLIC } from '../src/lib/chemins.mjs';

const PORT = Number(process.argv[2]) || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

let occupe = false;
let enAttente = false;

async function rebatir(raison) {
  if (occupe) { enAttente = true; return; }
  occupe = true;
  try {
    // import horodate : contourne le cache de modules de Node
    const mod = await import(`../src/build.mjs?t=${Date.now()}`);
    const debut = Date.now();
    mod.construire();
    console.log(`  reconstruit en ${Date.now() - debut} ms  (${raison})`);
  } catch (e) {
    console.error(`\n  ERREUR DE BUILD\n  ${e.message}\n`);
  } finally {
    occupe = false;
    if (enAttente) { enAttente = false; rebatir('modifications groupees'); }
  }
}

function surveiller(dossier, etiquette) {
  if (!existsSync(dossier)) return;
  let minuteur = null;
  watch(dossier, { recursive: true }, (_, fichier) => {
    clearTimeout(minuteur);
    minuteur = setTimeout(() => rebatir(`${etiquette}/${fichier}`), 120);
  });
}

await rebatir('demarrage');

surveiller(CONTENU, 'content');
surveiller(join(RACINE, 'src'), 'src');
surveiller(PUBLIC, 'public');

createServer((req, res) => {
  let chemin = decodeURIComponent(req.url.split('?')[0]);
  if (chemin.endsWith('/')) chemin += 'index.html';
  let fichier = join(DIST, chemin);

  if (!existsSync(fichier) && existsSync(`${fichier}.html`)) {
    fichier = `${fichier}.html`;
  }

  if (!existsSync(fichier) || statSync(fichier).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1><p>Page introuvable. '
      + '<a href="/">Retour a l\'accueil</a></p>');
    return;
  }

  res.writeHead(200, {
    'Content-Type': TYPES[extname(fichier)] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  res.end(readFileSync(fichier));
}).listen(PORT, () => {
  console.log(`\n  CSA — serveur de developpement`);
  console.log(`  http://localhost:${PORT}`);
  console.log('  Ctrl+C pour arreter\n');
});
