/**
 * Tests des briques de base : echappement, Markdown, front matter, tarifs.
 *
 *   npm test
 *
 * Utilise `node:test`, integre a Node depuis la version 18. Aucune
 * dependance, aucun fichier de configuration.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { esc, attrs, slug, chaque } from '../src/lib/html.mjs';
import { enligne, bloc, texteSeul } from '../src/lib/markdown.mjs';
import { separer, sections, sousSections, puces } from '../src/lib/frontmatter.mjs';
import { milliers, prixAffiche, prixNote, enLettres, lienWhatsApp }
  from '../src/lib/format.mjs';

/* ══════════════════════════════════════════════ html ══════════ */

test('esc neutralise les caracteres dangereux', () => {
  assert.equal(esc('<script>'), '&lt;script&gt;');
  assert.equal(esc('a & b'), 'a &amp; b');
  assert.equal(esc('dit "oui"'), 'dit &quot;oui&quot;');
  assert.equal(esc(null), '');
  assert.equal(esc(0), '0');
});

test('attrs omet les valeurs fausses et gere les booleens', () => {
  assert.equal(attrs({ class: 'a', hidden: true, x: false, y: null }),
               ' class="a" hidden');
  assert.equal(attrs({ href: '"><script>' }),
               ' href="&quot;&gt;&lt;script&gt;"');
});

test('slug retire accents et ponctuation', () => {
  assert.equal(slug('Géostatistique — R & Python'), 'geostatistique-r-python');
  assert.equal(slug('Aéromagnétisme sous Oasis Montaj'),
               'aeromagnetisme-sous-oasis-montaj');
});

test('chaque ignore les listes absentes', () => {
  assert.equal(chaque(null, (x) => x), '');
  assert.equal(chaque(['a', 'b'], (x) => `<i>${x}</i>`), '<i>a</i><i>b</i>');
});

/* ══════════════════════════════════════════ markdown ══════════ */

test('enligne rend gras, italique et code', () => {
  assert.equal(enligne('**gras**'), '<strong>gras</strong>');
  assert.equal(enligne('un *mot* seul'), 'un <em>mot</em> seul');
  assert.equal(enligne('`x < y`'), '<code>x &lt; y</code>');
});

test('enligne echappe le HTML injecte dans le contenu', () => {
  assert.equal(enligne('<img onerror=alert(1)>'),
               '&lt;img onerror=alert(1)&gt;');
});

test('enligne securise les liens externes', () => {
  const html = enligne('[CSA](https://exemple.fr)');
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener"/);
  // un lien interne ne recoit pas target=_blank
  assert.doesNotMatch(enligne('[page](autre.html)'), /target=/);
});

test('bloc produit paragraphes, listes et citations', () => {
  assert.equal(bloc('Un.\n\nDeux.'), '<p>Un.</p>\n<p>Deux.</p>');
  assert.equal(bloc('- a\n- b'), '<ul><li>a</li><li>b</li></ul>');
  assert.equal(bloc('1. a\n2. b'), '<ol><li>a</li><li>b</li></ol>');
  assert.match(bloc('> cite'), /^<blockquote>/);
});

test('bloc fusionne les lignes d un meme paragraphe', () => {
  assert.equal(bloc('une phrase\ncoupee'), '<p>une phrase coupee</p>');
});

test('texteSeul retire le balisage et tronque proprement', () => {
  assert.equal(texteSeul('**Gras** et [lien](http://x)'), 'Gras et lien');
  const court = texteSeul('a'.repeat(200), 20);
  assert.equal(court.length, 20);
  assert.ok(court.endsWith('…'));
});

/* ═════════════════════════════════════ front matter ═══════════ */

const FICHIER = `---
{ "id": "demo", "nom": "Démo" }
---

## Problème

Le texte du problème.

## Programme

### Module 1 — Titre

Corps du module 1.

### Module 2 — Autre

Corps du module 2.

## Acquis

- premier
- deuxième
`;

test('separer extrait le front matter JSON', () => {
  const { donnees, corps } = separer(FICHIER);
  assert.equal(donnees.id, 'demo');
  assert.equal(donnees.nom, 'Démo');
  assert.match(corps, /^## Problème/);
});

test('separer signale un JSON invalide avec le nom du fichier', () => {
  assert.throws(
    () => separer('---\n{ oups }\n---\n', 'content/x.md'),
    /content\/x\.md.*JSON invalide/s,
  );
});

test('separer refuse un fichier sans front matter', () => {
  assert.throws(() => separer('# Titre\n', 'content/y.md'), /doit commencer/);
});

test('sections decoupe sur les titres de niveau 2', () => {
  const s = sections(separer(FICHIER).corps);
  assert.deepEqual([...s.keys()], ['Problème', 'Programme', 'Acquis']);
  assert.equal(s.get('Problème'), 'Le texte du problème.');
});

test('sousSections decoupe sur les titres de niveau 3', () => {
  const s = sections(separer(FICHIER).corps);
  const modules = sousSections(s.get('Programme'));
  assert.equal(modules.length, 2);
  assert.equal(modules[0].titre, 'Module 1 — Titre');
  assert.equal(modules[1].corps, 'Corps du module 2.');
});

test('puces extrait les items de liste', () => {
  const s = sections(separer(FICHIER).corps);
  assert.deepEqual(puces(s.get('Acquis')), ['premier', 'deuxième']);
});

/* ═══════════════════════════════════════════ format ═══════════ */

test('milliers insere une espace insecable etroite', () => {
  assert.equal(milliers(250000), '250 000');
  assert.equal(milliers(900), '900');
  assert.equal(milliers(1234567), '1 234 567');
});

test('REGLE METIER : un tarif non ferme n est jamais publie', () => {
  assert.equal(prixAffiche({ statutPrix: 'propose', prix: 180000 }),
               'Tarif sur demande');
  assert.equal(prixAffiche({ statutPrix: 'aDefinir', prix: 999 }),
               'Tarif sur demande');
  assert.equal(prixAffiche({ statutPrix: 'devis' }), 'Sur devis');
  // le montant ne doit apparaitre nulle part dans la sortie
  assert.doesNotMatch(prixAffiche({ statutPrix: 'propose', prix: 180000 }),
                      /180/);
});

test('un tarif ferme est publie, seul ou en fourchette', () => {
  assert.equal(prixAffiche({ statutPrix: 'ferme', prix: 250000 }),
               '250 000 FCFA');
  assert.equal(prixAffiche({ statutPrix: 'ferme', prixMin: 12000, prixMax: 65000 }),
               'de 12 000 à 65 000 FCFA');
});

test('prixNote explique pourquoi un tarif est absent', () => {
  assert.equal(prixNote({ statutPrix: 'propose' }),
               'tarif communiqué sur demande');
  assert.equal(prixNote({ statutPrix: 'ferme', paiement: '60 / 40' }), '60 / 40');
});

test('enLettres accorde au feminin', () => {
  assert.equal(enLettres(18, true), 'Dix-huit');
  assert.equal(enLettres(21), 'vingt et une');
  assert.equal(enLettres(99), '99');
});

test('lienWhatsApp encode le message', () => {
  const url = lienWhatsApp('237672442598', 'Bonjour CSA & merci');
  assert.equal(url,
    'https://wa.me/237672442598?text=Bonjour%20CSA%20%26%20merci');
});
