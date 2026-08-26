/** Page d'une formation — le tunnel de vente proprement dit. */

import { esc, chaque } from '../lib/html.mjs';
import { bloc, enligne, texteSeul } from '../lib/markdown.mjs';
import { prixAffiche, prixNote, lienWhatsApp } from '../lib/format.mjs';
import { page } from '../components/layout.mjs';
import { visuel } from '../components/image.mjs';
import {
  etiquettes, accordeon, formules, video, temoignages, filAriane, listeCoches,
} from '../components/blocs.mjs';

function schemaJsonLd(f, site) {
  const donnees = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: f.nom,
    description: texteSeul(f.resume, 300),
    inLanguage: 'fr',
    provider: {
      '@type': 'Organization',
      name: site.nomComplet,
      email: site.email,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: /ligne/i.test(f.format) ? 'online' : 'onsite',
      courseWorkload: f.seances,
    },
  };
  if (f.statutPrix === 'ferme' && Number.isFinite(f.prix)) {
    donnees.offers = {
      '@type': 'Offer',
      price: f.prix,
      priceCurrency: 'XAF',
      availability: 'https://schema.org/InStock',
    };
  }
  return `<script type="application/ld+json">${JSON.stringify(donnees)}</script>`;
}

export function pageFormation(f, contenu) {
  const { site, temoignages: avis } = contenu;
  const prix = prixAffiche(f);
  const note = prixNote(f);
  const wa = lienWhatsApp(
    site.whatsapp,
    `Bonjour CSA, je souhaite des informations sur la formation « ${f.nomCourt} ».`,
  );

  const licence = f.licence ? `
      <aside class="encadre encadre-alerte">
        <p class="encadre-titre">À régler avant l'inscription — la licence</p>
        ${bloc(f.licence)}
      </aside>` : '';

  const preuves = chaque(f.preuves, (p) => `
          <article class="carte carte-preuve">
            <h3>${enligne(p.titre)}</h3>
            ${bloc(p.corps)}
          </article>`);

  const corps = `
  <section class="hero hero-formation">
    <div class="conteneur">
      <div class="hero-duo">
        <div class="hero-texte">
          <div class="etiquettes">${etiquettes(f)}</div>
          <h1>${esc(f.nom)}</h1>
          <p class="hero-accroche">${enligne(f.accroche)}</p>
          <div class="hero-actions">
            <a href="../inscription.html?f=${esc(f.id)}"
               class="btn btn-primaire btn-large">Je m'inscris</a>
            <a href="${wa}" class="btn btn-secondaire btn-large"
               target="_blank" rel="noopener">Poser une question</a>
          </div>
        </div>
        ${visuel(f, '../', { classe: 'visuel visuel-hero', priorite: true })}
      </div>
      <dl class="chiffres">
        <div><dt>durée</dt><dd>${esc(f.duree)}</dd></div>
        <div><dt>volume</dt><dd>${esc(f.seances)}</dd></div>
        <div><dt>${esc(note)}</dt><dd>${esc(prix)}</dd></div>
      </dl>
    </div>
  </section>

  <div class="conteneur">
    ${filAriane([['Accueil', '../index.html'],
                 ['Formations', '../formations.html'],
                 [f.nomCourt]])}
  </div>

  <section class="section">
    <div class="conteneur">
      <div class="grille grille-2">
        <div>
          <p class="surtitre">Le problème</p>
          <h2 class="section-titre">Pourquoi cette formation existe</h2>
          ${bloc(f.probleme)}
        </div>
        <div>
          <p class="surtitre">Notre promesse</p>
          <h2 class="section-titre">Ce que vous en retirez</h2>
          ${bloc(f.promesse)}
        </div>
      </div>
      ${licence}
    </div>
  </section>

  <section class="section section-pale">
    <div class="conteneur">
      <p class="surtitre">Compétences</p>
      <h2 class="section-titre">Ce que vous saurez faire</h2>
      <p class="section-intro">À l'issue de la formation, ces compétences sont
        acquises et validées par un projet.</p>
      ${listeCoches(f.acquis)}
    </div>
  </section>

  <section class="section">
    <div class="conteneur">
      <p class="surtitre">Programme</p>
      <h2 class="section-titre">Le déroulé, module par module</h2>
      <p class="section-intro">Chaque module annonce son objectif et son
        livrable. Cliquez pour ouvrir.</p>
      ${accordeon(f.programme, 'prog')}
      <aside class="encadre">
        <p class="encadre-titre">Le fil rouge</p>
        ${bloc(f.filRouge)}
      </aside>
    </div>
  </section>

  ${formules(f)}

  <section class="section section-bleue">
    <div class="conteneur">
      <p class="surtitre">Ce qui le prouve</p>
      <h2 class="section-titre">Pourquoi nous faire confiance</h2>
      <div class="grille grille-3">${preuves}</div>
    </div>
  </section>

  ${video(f)}

  <section class="section">
    <div class="conteneur">
      <div class="grille grille-2">
        <div>
          <h2 class="section-titre">Pour qui</h2>
          ${listeCoches(f.public)}
        </div>
        <div>
          <h2 class="section-titre">Prérequis</h2>
          ${listeCoches(f.prerequis)}
          ${f.outils ? `<p class="note-outils"><strong>Outils :</strong>
             ${enligne(f.outils)}</p>` : ''}
        </div>
      </div>
      <h2 class="section-titre section-titre-espacee">Ce qui nous distingue</h2>
      ${listeCoches(f.differenciateurs)}
    </div>
  </section>

  ${temoignages(avis, 'Ils ont suivi cette formation')}

  <section class="section">
    <div class="conteneur">
      <p class="surtitre">Vos questions</p>
      <h2 class="section-titre">Les objections, traitées franchement</h2>
      ${accordeon(f.faq, 'faq')}
    </div>
  </section>

  <section class="cta-final">
    <div class="conteneur">
      <h2>${enligne(f.accroche)}</h2>
      <p>${esc(f.duree)} · ${esc(f.seances)} · ${esc(f.format)}<br>
        <strong class="cta-prix">${esc(prix)}</strong>
        ${note ? `— ${esc(note)}` : ''}</p>
      <div class="cta-actions">
        <a href="../inscription.html?f=${esc(f.id)}"
           class="btn btn-primaire btn-large">Je m'inscris maintenant</a>
        <a href="${wa}" class="btn btn-secondaire btn-large"
           target="_blank" rel="noopener">J'ai une question d'abord</a>
      </div>
    </div>
  </section>`;

  return page({
    titre: `${f.nom} — ${site.nom}`,
    description: f.resume,
    corps,
    actif: 'formations',
    prefixe: '../',
    chemin: `formations/${f.id}.html`,
    schema: schemaJsonLd(f, site),
    contenu,
  });
}
