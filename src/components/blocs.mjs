/** Composants reutilises par plusieurs pages. */

import { esc, chaque, slug } from '../lib/html.mjs';
import { bloc, enligne } from '../lib/markdown.mjs';
import { prixAffiche, prixNote, milliers } from '../lib/format.mjs';
import { visuel } from './image.mjs';

/** Etiquettes d'une formation : nouveaute, mise en avant, format, categorie. */
export function etiquettes(f) {
  const e = [];
  if (f.nouveau) e.push('<span class="etiquette etiquette-neuve">Nouveau</span>');
  if (f.phare) e.push('<span class="etiquette etiquette-phare">Formation phare</span>');
  if (/ligne/i.test(f.format)) {
    e.push('<span class="etiquette etiquette-ligne">En ligne</span>');
  } else if (/présentiel/i.test(f.format)) {
    e.push('<span class="etiquette etiquette-presentiel">Présentiel</span>');
  }
  e.push(`<span class="etiquette">${esc(f.categorie)}</span>`);
  return e.join('');
}

/** Carte de formation, utilisee sur l'accueil et le catalogue. */
export function carteFormation(f, prefixe = '') {
  return `
      <article class="carte carte-formation">
        <a class="carte-visuel" href="${prefixe}formations/${f.id}.html"
           tabindex="-1" aria-hidden="true">
          ${visuel(f, prefixe, { classe: 'visuel visuel-carte' })}
        </a>
        <div class="carte-corps">
          <div class="etiquettes">${etiquettes(f)}</div>
          <h3><a href="${prefixe}formations/${f.id}.html">${esc(f.nomCourt)}</a></h3>
          <p class="resume">${enligne(f.resume)}</p>
          <div class="meta">
            <span>${esc(f.duree)}</span>
            <span>${esc(f.seances)}</span>
          </div>
          <div class="prix">${esc(prixAffiche(f))}
            <br><small>${esc(prixNote(f))}</small></div>
          <a href="${prefixe}formations/${f.id}.html"
             class="btn btn-secondaire btn-bloc">Découvrir la formation</a>
        </div>
      </article>`;
}

/** Accordeon accessible. `items` = [{titre, corps}] */
export function accordeon(items, prefixeId) {
  const html = chaque(items, (item, i) => {
    const id = `${prefixeId}-${i}`;
    return `
        <div class="acc-item">
          <h3 class="acc-tete-conteneur">
            <button class="acc-tete" type="button" aria-expanded="false"
                    aria-controls="${id}" id="${id}-bouton">
              <span>${enligne(item.titre)}</span>
              <span class="chevron" aria-hidden="true"></span>
            </button>
          </h3>
          <div class="acc-corps" id="${id}" role="region"
               aria-labelledby="${id}-bouton">
            <div class="acc-corps-interne">${bloc(item.corps)}</div>
          </div>
        </div>`;
  });
  return `<div class="accordeon">${html}</div>`;
}

/** Comparatif Classique / Premium. */
export function formules(f) {
  if (!f.formules?.length) return '';

  const cartes = chaque(f.formules, (k) => {
    const usd = k.prixUsd
      ? ` <span class="formule-usd">≈ ${k.prixUsd} USD</span>` : '';
    const inclus = chaque(k.inclus, (x) => `<li class="oui">${enligne(x)}</li>`);
    const exclus = chaque(k.exclus, (x) => `<li class="non">${enligne(x)}</li>`);
    const badge = k.recommande
      ? '<span class="formule-badge">Le plus choisi</span>' : '';
    return `
        <div class="formule${k.recommande ? ' formule-reco' : ''}">
          ${badge}
          <h3>${esc(k.nom)}</h3>
          <p class="formule-resume">${enligne(k.resume)}</p>
          <p class="formule-prix">${milliers(k.prix)}</p>
          <p class="formule-devise">FCFA${usd}</p>
          <ul class="formule-liste">${inclus}${exclus}</ul>
          <a href="../inscription.html?f=${esc(f.id)}"
             class="btn ${k.recommande ? 'btn-primaire' : 'btn-secondaire'} btn-bloc">
            Choisir ${esc(k.nom)}</a>
        </div>`;
  });

  return `
  <section class="section section-pale" id="formules">
    <div class="conteneur">
      <p class="surtitre">Deux façons d'y entrer</p>
      <h2 class="section-titre">Choisissez votre formule</h2>
      <p class="section-intro">Même contenu pédagogique dans les deux cas.
        Ce qui change, c'est l'accompagnement — et l'attestation.</p>
      <div class="formules">${cartes}</div>
      <p class="formule-note">Vous commencez en Classique et souhaitez passer
        en Premium&nbsp;? Vous ne payez que la différence.</p>
    </div>
  </section>`;
}

/** Section video, uniquement si un identifiant YouTube est renseigne. */
export function video(f) {
  if (!f.video) return '';
  const legende = f.videoLegende
    ? `<p class="video-legende">${enligne(f.videoLegende)}</p>` : '';
  return `
  <section class="section">
    <div class="conteneur">
      <p class="surtitre">En vidéo</p>
      <h2 class="section-titre">La formation en quelques minutes</h2>
      <div class="video-cadre">
        <iframe src="https://www.youtube-nocookie.com/embed/${esc(f.video)}"
                title="Présentation — ${esc(f.nom)}" loading="lazy" allowfullscreen
                allow="accelerometer; encrypted-media; picture-in-picture"
                referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      ${legende}
    </div>
  </section>`;
}

/**
 * Temoignages. Tant qu'aucun n'est collecte, un emplacement visible est
 * affiche — on ne fabrique jamais un avis.
 */
export function temoignages(liste, titre = "Ils l'ont suivie") {
  if (!liste?.length) {
    return `
  <section class="section section-pale">
    <div class="conteneur">
      <p class="surtitre">Témoignages</p>
      <h2 class="section-titre">La parole des apprenants</h2>
      <div class="emplacement-vide">
        <strong>Emplacement réservé aux témoignages</strong>
        Cette section attend les retours écrits et vidéo des apprenants.
        Elle apparaîtra dès que les premiers auront été collectés et autorisés.
      </div>
    </div>
  </section>`;
  }

  const cartes = chaque(liste, (t) => `
      <figure class="temoignage">
        <blockquote class="temoignage-texte">${enligne(t.texte)}</blockquote>
        <figcaption class="temoignage-auteur">
          <span class="temoignage-pastille">${esc(t.initiales)}</span>
          <span>
            <span class="temoignage-nom">${esc(t.auteur)}</span>
            <span class="temoignage-role">${esc(t.role)}</span>
          </span>
        </figcaption>
      </figure>`);

  return `
  <section class="section section-pale">
    <div class="conteneur">
      <p class="surtitre">Témoignages</p>
      <h2 class="section-titre">${esc(titre)}</h2>
      <div class="grille grille-3">${cartes}</div>
    </div>
  </section>`;
}

/** Fil d'Ariane. `chemin` = [[libelle, url] | [libelle]] */
export function filAriane(chemin) {
  const items = chaque(chemin, ([libelle, url], i) => {
    const contenu = url
      ? `<a href="${url}">${esc(libelle)}</a>`
      : `<span aria-current="page">${esc(libelle)}</span>`;
    return `<li>${contenu}</li>`;
  });
  return `<nav class="fil" aria-label="Fil d'Ariane"><ol>${items}</ol></nav>`;
}

/** Liste a coches, pour les acquis, le public, les prerequis. */
export function listeCoches(items) {
  return `<ul class="liste-check">${chaque(items, (x) => `<li>${enligne(x)}</li>`)}</ul>`;
}

export { slug };
