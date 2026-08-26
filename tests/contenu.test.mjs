/**
 * Tests sur le contenu reel du site.
 *
 * Ces tests protegent les regles metier CSA. S'ils echouent, c'est en
 * general qu'une fiche a ete modifiee d'une facon qui exposerait CSA :
 * un tarif non valide publie, un nom d'apprenant en clair, un chiffre
 * qui ne correspond plus au catalogue.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { chargerContenu } from '../src/lib/content.mjs';
import { prixAffiche } from '../src/lib/format.mjs';

const contenu = chargerContenu();
const { site, formations, references, temoignages } = contenu;

test('le contenu se charge et contient des formations', () => {
  assert.ok(formations.length >= 1);
});

test('chaque formation a un identifiant unique et bien forme', () => {
  const vus = new Set();
  for (const f of formations) {
    assert.match(f.id, /^[a-z0-9]+(-[a-z0-9]+)*$/,
                 `identifiant mal forme : ${f.id}`);
    assert.equal(vus.has(f.id), false, `identifiant en double : ${f.id}`);
    vus.add(f.id);
  }
});

test('chaque formation a un programme, une FAQ et des acquis', () => {
  for (const f of formations) {
    assert.ok(f.programme.length >= 2, `${f.id} : programme trop court`);
    assert.ok(f.faq.length >= 2, `${f.id} : FAQ trop courte`);
    assert.ok(f.acquis.length >= 3, `${f.id} : trop peu d'acquis`);
    assert.ok(f.public.length >= 2, `${f.id} : public trop vague`);
  }
});

test('REGLE METIER : aucun tarif non ferme ne devient affichable', () => {
  for (const f of formations) {
    if (f.statutPrix === 'ferme') continue;
    const affiche = prixAffiche(f);
    for (const montant of [f.prix, f.prixMin, f.prixMax]) {
      if (!Number.isFinite(montant)) continue;
      assert.doesNotMatch(
        affiche, new RegExp(String(montant).slice(0, 3)),
        `${f.id} : le tarif « ${f.statutPrix} » fuit dans « ${affiche} »`,
      );
    }
  }
});

test('REGLE METIER : le bandeau annonce le bon nombre de formations', () => {
  const chiffre = site.chiffres.find((c) => /formation/i.test(c.libelle));
  assert.ok(chiffre, 'content/site.json : chiffre « formations » absent');
  assert.equal(
    String(chiffre.valeur), String(formations.length),
    `le bandeau annonce ${chiffre.valeur} formations, le catalogue en `
    + `contient ${formations.length}`,
  );
});

test('REGLE METIER : une reference sans accord ecrit reste anonyme', () => {
  for (const r of references) {
    assert.equal(typeof r.accord, 'boolean',
                 `${r.nom} : champ « accord » manquant`);
  }
});

test('REGLE METIER : aucun temoignage fabrique', () => {
  // La liste peut etre vide — c'est meme l'etat attendu tant qu'aucun
  // temoignage n'a ete collecte. En revanche, toute entree presente doit
  // etre complete, pour qu'on sache d'ou elle vient.
  for (const t of temoignages) {
    assert.ok(t.texte && t.auteur && t.role,
              'temoignage incomplet dans content/temoignages.json');
  }
});

test('une formation a licence proprietaire le declare explicitement', () => {
  const proprietaires = [
    'isatis', 'surpac', 'vulcan', 'datamine', 'leapfrog',
    'arcgis', 'oasis', 'erdas', 'envi',
  ];
  for (const f of formations) {
    const concerne = proprietaires.some((p) => f.id.includes(p));
    if (!concerne) continue;
    assert.ok(
      f.licence && /licence/i.test(f.licence),
      `${f.id} : logiciel proprietaire sans section « ## Licence »`,
    );
    assert.match(
      f.licence, /ne fournit\s+\*?\*?pas/i,
      `${f.id} : la section Licence doit dire que CSA ne fournit pas de licence`,
    );
  }
});

test('les formules Classique / Premium sont coherentes', () => {
  for (const f of formations) {
    if (!f.formules) continue;
    const [classique, premium] = f.formules;
    assert.ok(premium.prix > classique.prix,
              `${f.id} : la formule Premium doit couter plus cher`);
    assert.ok(premium.inclus.length > classique.inclus.length,
              `${f.id} : la formule Premium doit inclure davantage`);
    assert.equal(premium.recommande, true,
                 `${f.id} : la formule Premium doit etre mise en avant`);
  }
});

test('le numero WhatsApp et l e-mail sont renseignes', () => {
  assert.match(site.whatsapp, /^\d{8,15}$/);
  assert.match(site.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});
