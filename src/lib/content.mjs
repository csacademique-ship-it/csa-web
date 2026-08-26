/**
 * Chargement et validation du contenu.
 *
 * Une seule fonction publique, `chargerContenu()`, qui renvoie un objet
 * entierement valide ou leve une erreur explicite. Le build ne demarre
 * jamais sur du contenu douteux : mieux vaut echouer ici, avec le nom du
 * fichier et la cle fautive, que produire une page silencieusement fausse.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { separer, sections, sousSections, puces } from './frontmatter.mjs';
import { RACINE } from './chemins.mjs';

const CONTENU = join(RACINE, 'content');

const STATUTS_PRIX = new Set(['ferme', 'propose', 'aDefinir', 'devis']);

/** Sections obligatoires dans chaque fiche formation. */
const SECTIONS_REQUISES = [
  'Problème', 'Promesse', 'Public', 'Prérequis', 'Acquis',
  'Programme', 'Fil rouge', 'Preuves', 'Différenciateurs', 'FAQ',
];

const CHAMPS_REQUIS = [
  'id', 'nom', 'nomCourt', 'categorie', 'resume', 'accroche',
  'statutPrix', 'duree', 'seances', 'format',
];

function lireJson(nom) {
  const chemin = join(CONTENU, nom);
  if (!existsSync(chemin)) throw new Error(`Fichier manquant : content/${nom}`);
  try {
    return JSON.parse(readFileSync(chemin, 'utf8'));
  } catch (e) {
    throw new Error(`content/${nom} : JSON invalide — ${e.message}`);
  }
}

function validerFormation(f, chemin) {
  const erreurs = [];

  for (const champ of CHAMPS_REQUIS) {
    if (f[champ] === undefined || f[champ] === '') {
      erreurs.push(`champ requis manquant : « ${champ} »`);
    }
  }

  if (f.statutPrix && !STATUTS_PRIX.has(f.statutPrix)) {
    erreurs.push(
      `statutPrix « ${f.statutPrix} » inconnu — valeurs admises : ` +
      `${[...STATUTS_PRIX].join(', ')}`,
    );
  }

  if (f.statutPrix === 'ferme') {
    const simple = Number.isFinite(f.prix);
    const fourchette = Number.isFinite(f.prixMin) && Number.isFinite(f.prixMax);
    const formules = Array.isArray(f.formules) && f.formules.length > 0;
    if (!simple && !fourchette && !formules) {
      erreurs.push(
        'statutPrix « ferme » mais aucun montant : renseigner « prix », ' +
        'ou « prixMin » et « prixMax », ou « formules »',
      );
    }
  }

  if (f.formules) {
    if (!Array.isArray(f.formules) || f.formules.length < 2) {
      erreurs.push('« formules » doit contenir au moins deux entrees');
    } else {
      f.formules.forEach((k, i) => {
        if (!k.nom) erreurs.push(`formules[${i}] : « nom » manquant`);
        if (!Number.isFinite(k.prix)) {
          erreurs.push(`formules[${i}] : « prix » doit etre un nombre`);
        }
      });
    }
  }

  for (const s of SECTIONS_REQUISES) {
    if (!f.sections.has(s)) erreurs.push(`section « ## ${s} » absente`);
  }

  if (f.programme.length === 0) {
    erreurs.push('la section « ## Programme » ne contient aucun « ### Module »');
  }
  if (f.faq.length === 0) {
    erreurs.push('la section « ## FAQ » ne contient aucune question');
  }
  if (f.acquis.length === 0) {
    erreurs.push('la section « ## Acquis » ne contient aucune puce');
  }

  if (erreurs.length) {
    throw new Error(
      `${chemin} :\n${erreurs.map((e) => `    - ${e}`).join('\n')}`,
    );
  }
}

function chargerFormation(fichier) {
  const chemin = join(CONTENU, 'formations', fichier);
  const { donnees, corps } = separer(readFileSync(chemin, 'utf8'),
                                     `content/formations/${fichier}`);

  const sec = sections(corps);
  const f = {
    ...donnees,
    sections: sec,
    probleme: sec.get('Problème') || '',
    promesse: sec.get('Promesse') || '',
    licence: sec.get('Licence') || '',
    public: puces(sec.get('Public')),
    prerequis: puces(sec.get('Prérequis')),
    acquis: puces(sec.get('Acquis')),
    programme: sousSections(sec.get('Programme')),
    filRouge: sec.get('Fil rouge') || '',
    preuves: sousSections(sec.get('Preuves')),
    differenciateurs: puces(sec.get('Différenciateurs')),
    faq: sousSections(sec.get('FAQ')),
    fichier: `content/formations/${fichier}`,
  };

  const attendu = fichier.replace(/\.md$/, '');
  if (f.id !== attendu) {
    throw new Error(
      `content/formations/${fichier} : l'identifiant « ${f.id} » ne ` +
      `correspond pas au nom du fichier (« ${attendu} » attendu).`,
    );
  }

  validerFormation(f, `content/formations/${fichier}`);
  return f;
}

/**
 * Charge tout le contenu du site.
 * @returns {{site, formations, categories, references, temoignages, formateur}}
 */
export function chargerContenu() {
  const site = lireJson('site.json');
  const references = lireJson('references.json');
  const temoignages = lireJson('temoignages.json');
  const formateur = lireJson('formateur.json');

  const dossier = join(CONTENU, 'formations');
  const fichiers = readdirSync(dossier)
    .filter((f) => f.endsWith('.md'))
    .sort();

  if (fichiers.length === 0) {
    throw new Error('Aucune formation dans content/formations/');
  }

  const formations = fichiers.map(chargerFormation);

  const vus = new Set();
  for (const f of formations) {
    if (vus.has(f.id)) throw new Error(`Identifiant en double : « ${f.id} »`);
    vus.add(f.id);
  }

  // Ordre d'affichage : les formations phares d'abord, puis les nouveautes,
  // puis l'ordre alphabetique du nom court. Deterministe, donc un build
  // rejoue produit exactement le meme HTML.
  const rang = (f) => (f.phare ? 0 : 2) + (f.nouveau ? -1 : 0);
  formations.sort(
    (a, b) => rang(a) - rang(b) || a.nomCourt.localeCompare(b.nomCourt, 'fr'),
  );

  // Regroupement par categorie, dans l'ordre d'apparition
  const categories = [];
  for (const f of formations) {
    let c = categories.find((x) => x.nom === f.categorie);
    if (!c) {
      c = { nom: f.categorie, formations: [] };
      categories.push(c);
    }
    c.formations.push(f);
  }

  return { site, formations, categories, references, temoignages, formateur };
}
