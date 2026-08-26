/** Pages d'accueil, catalogue, services, a propos, mentions, merci. */

import { esc, chaque } from '../lib/html.mjs';
import { enligne } from '../lib/markdown.mjs';
import { lienWhatsApp, enLettres } from '../lib/format.mjs';
import { page } from '../components/layout.mjs';
import { carteFormation, temoignages, filAriane } from '../components/blocs.mjs';
import { sectionGalerie, photoMarque } from '../components/galerie.mjs';

/* ══════════════════════════════════════════════════════════════════
   ACCUEIL
   ══════════════════════════════════════════════════════════════════ */

export function pageAccueil(contenu) {
  const { site, formations, temoignages: avis, references } = contenu;
  const n = formations.length;
  const ouverture = photoMarque('hero-accueil.webp');

  const chiffres = chaque(site.chiffres, (c) => `
        <div>
          <dt>${esc(c.libelle)}</dt>
          <dd>${esc(c.valeur)}</dd>
          <p class="chiffre-detail">${esc(c.detail)}</p>
        </div>`);

  const piliers = chaque(site.piliers, (p) => `
        <article class="carte carte-pilier">
          <span class="carte-icone" aria-hidden="true">${esc(p.icone)}</span>
          <h3>${esc(p.titre)}</h3>
          <p>${enligne(p.texte)}</p>
        </article>`);

  const phares = chaque(formations.filter((f) => f.phare),
                        (f) => carteFormation(f));

  const clients = chaque(references, (r) => {
    const nom = r.accord ? r.nom : 'Groupe scolaire (nom communiqué sur accord)';
    return `
        <article class="carte">
          <h3>${esc(nom)}</h3>
          <p class="carte-meta">${esc(r.lieu)} · ${esc(r.mission)}</p>
          <p class="carte-volume">${esc(r.volume)}</p>
          <p>${esc(r.detail)}</p>
        </article>`;
  });

  const corps = `
  <section class="hero hero-accueil">
    <div class="conteneur">
      <p class="surtitre surtitre-clair">${esc(site.sousTitre)}</p>
      <h1>Formez-vous aux géosciences numériques, en français,
        sur des cas africains</h1>
      <p class="hero-accroche">
        CSA forme les géologues, ingénieurs et techniciens d'Afrique
        francophone aux méthodes et aux logiciels que leur métier exige —
        avec des données qui ressemblent aux leurs.
      </p>
      <div class="hero-actions">
        <a href="formations.html" class="btn btn-primaire btn-large">
          Voir les ${enLettres(n)} formations</a>
        <a href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA, je cherche une formation.')}"
           class="btn btn-secondaire btn-large" target="_blank" rel="noopener">
          Parler à un formateur</a>
      </div>
      ${ouverture ? `
      <figure class="hero-photo">
        <img src="${ouverture}" width="1600" height="720"
             alt="Équipe CSA en campagne de prospection sur le terrain"
             fetchpriority="high" decoding="async">
      </figure>` : ''}
    </div>
  </section>

  <section class="section bandeau-chiffres">
    <div class="conteneur">
      <dl class="chiffres chiffres-4">${chiffres}</dl>
    </div>
  </section>

  <section class="section">
    <div class="conteneur">
      <p class="surtitre">Notre écosystème</p>
      <h2 class="section-titre">Quatre piliers, un seul objectif</h2>
      <div class="grille grille-4">${piliers}</div>
    </div>
  </section>

  <section class="section section-pale">
    <div class="conteneur">
      <p class="surtitre">Catalogue</p>
      <h2 class="section-titre">Nos formations phares</h2>
      <p class="section-intro">${enLettres(n, true)} formations au catalogue —
        du parcours certifiant de quatre semaines à la formation logiciel en
        accès libre, de la géostatistique minière à la cartographie de la
        pollution.</p>
      <div class="grille grille-3">${phares}</div>
      <p class="section-suite">
        <a href="formations.html" class="btn btn-secondaire">
          Voir les ${enLettres(n)} formations</a></p>
    </div>
  </section>

  <section class="section">
    <div class="conteneur">
      <p class="surtitre">Notre méthode</p>
      <h2 class="section-titre">Ce qui rend nos formations différentes</h2>
      <div class="grille grille-2">
        <article class="carte">
          <h3>Un seul gisement, du début à la fin</h3>
          <p>Pas d'exercices déconnectés. Chaque formation suit un jeu de
            données unique, du fichier brut jusqu'au livrable — celui que
            vous devrez produire en entreprise.</p>
        </article>
        <article class="carte">
          <h3>Les erreurs sont enseignées</h3>
          <p>Nous montrons ce qui invalide silencieusement un résultat :
            un compositage qui ignore les contacts, un krigeage qui lisse
            trop, une classification trop optimiste.</p>
        </article>
        <article class="carte">
          <h3>Des données africaines</h3>
          <p>Latérites nickélifères, or birimien, orpaillage, nappes
            tropicales. Les cas d'étude viennent du continent où vous
            travaillez.</p>
        </article>
        <article class="carte">
          <h3>On vous dit quand ne pas payer</h3>
          <p>Si une formation exige une licence que vous n'avez pas, nous
            vous le disons avant l'inscription. Nous préférons perdre une
            vente plutôt que votre confiance.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section-pale">
    <div class="conteneur">
      <p class="surtitre">Références</p>
      <h2 class="section-titre">Ils nous ont fait confiance</h2>
      <div class="grille grille-2">${clients}</div>
    </div>
  </section>

  ${temoignages(avis)}

  <section class="cta-final">
    <div class="conteneur">
      <h2>Vous ne savez pas par où commencer&nbsp;?</h2>
      <p>Décrivez-nous ce que vous faites aujourd'hui et ce que vous voulez
        pouvoir faire. Nous vous orienterons — y compris vers la formation
        la moins chère si c'est celle qu'il vous faut.</p>
      <div class="cta-actions">
        <a href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA, je souhaite un conseil sur le choix dune formation.')}"
           class="btn btn-primaire btn-large" target="_blank" rel="noopener">
          Demander conseil</a>
        <a href="formations.html" class="btn btn-secondaire btn-large">
          Parcourir le catalogue</a>
      </div>
    </div>
  </section>`;

  return page({
    titre: `${site.nomComplet} — formations en géosciences numériques`,
    description: 'Formations certifiantes en géostatistique, logiciels miniers, '
      + 'SIG, télédétection et données, pour les professionnels des géosciences '
      + "d'Afrique francophone.",
    corps,
    actif: 'accueil',
    chemin: 'index.html',
    contenu,
  });
}

/* ══════════════════════════════════════════════════════════════════
   CATALOGUE
   ══════════════════════════════════════════════════════════════════ */

export function pageCatalogue(contenu) {
  const { site, formations, categories } = contenu;
  const n = formations.length;

  const sections = chaque(categories, (c) => `
  <section class="section">
    <div class="conteneur">
      <p class="surtitre">${esc(c.nom)}</p>
      <h2 class="section-titre">${esc(c.nom)}</h2>
      <div class="grille grille-3">
        ${chaque(c.formations, (f) => carteFormation(f))}
      </div>
    </div>
  </section>`);

  const corps = `
  <section class="hero">
    <div class="conteneur">
      <h1>${enLettres(n, true)} formations, un seul objectif</h1>
      <p class="hero-accroche">Vous rendre autonome sur les méthodes et les
        logiciels que votre métier exige — avec des données qui ressemblent
        aux vôtres.</p>
    </div>
  </section>

  <div class="conteneur">
    ${filAriane([['Accueil', 'index.html'], ['Formations']])}
  </div>

  ${sections}

  <section class="cta-final">
    <div class="conteneur">
      <h2>Vous hésitez entre deux formations&nbsp;?</h2>
      <p>Décrivez-nous ce que vous faites aujourd'hui et ce que vous voulez
        pouvoir faire. Nous vous orienterons honnêtement.</p>
      <div class="cta-actions">
        <a href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA, jhesite entre plusieurs formations.')}"
           class="btn btn-primaire btn-large" target="_blank" rel="noopener">
          Demander conseil</a>
      </div>
    </div>
  </section>`;

  return page({
    titre: `Catalogue des formations — ${site.nom}`,
    description: `Les ${enLettres(n)} formations CSA en géostatistique, `
      + 'logiciels miniers, SIG, télédétection, géophysique, environnement, '
      + 'données et IA.',
    corps,
    actif: 'formations',
    chemin: 'formations.html',
    contenu,
  });
}

/* ══════════════════════════════════════════════════════════════════
   SERVICES
   ══════════════════════════════════════════════════════════════════ */

export function pageServices(contenu) {
  const { site } = contenu;

  const corps = `
  <section class="hero">
    <div class="conteneur">
      <h1>Conseil, recherche et innovation</h1>
      <p class="hero-accroche">La formation est notre premier pilier, pas le
        seul. CSA intervient aussi directement sur vos données et vos
        projets.</p>
    </div>
  </section>

  <div class="conteneur">
    ${filAriane([['Accueil', 'index.html'], ['Services']])}
  </div>

  <section class="section">
    <div class="conteneur">
      <div class="grille grille-3">
        <article class="carte">
          <h3>Conseil</h3>
          <p>Audit de base de données de sondages, revue critique d'une
            estimation de ressources, second regard sur un rapport avant
            dépôt, accompagnement méthodologique.</p>
        </article>
        <article class="carte">
          <h3>Recherche appliquée</h3>
          <p>Traitement statistique et géostatistique de jeux de données
            de recherche, figures de qualité publication, appui
            méthodologique aux doctorants et aux laboratoires.</p>
        </article>
        <article class="carte">
          <h3>Innovation numérique</h3>
          <p>Automatisation de traitements répétitifs, tableaux de bord,
            outils internes, intégration de l'IA générative dans les
            processus documentaires.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="cta-final">
    <div class="conteneur">
      <h2>Parlons de votre projet</h2>
      <p>Décrivez-nous votre besoin. Nous vous dirons honnêtement si nous
        sommes la bonne équipe pour y répondre.</p>
      <div class="cta-actions">
        <a href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA, je souhaite parler dune mission de conseil.')}"
           class="btn btn-primaire btn-large" target="_blank" rel="noopener">
          Décrire mon besoin</a>
        <a href="mailto:${esc(site.email)}" class="btn btn-secondaire btn-large">
          Écrire un e-mail</a>
      </div>
    </div>
  </section>`;

  return page({
    titre: `Conseil, recherche et innovation — ${site.nom}`,
    description: 'Missions de conseil, recherche appliquée et développement '
      + "d'outils numériques en géosciences et environnement.",
    corps,
    actif: 'services',
    chemin: 'services.html',
    contenu,
  });
}

/* ══════════════════════════════════════════════════════════════════
   À PROPOS
   ══════════════════════════════════════════════════════════════════ */

export function pageAPropos(contenu) {
  const { site, formateur, references, galerie } = contenu;
  const portrait = photoMarque('formateur.webp');

  const logiciels = chaque(formateur.logiciels || [],
                           (l) => `<li>${esc(l)}</li>`);
  const certifs = chaque(formateur.certifications || [],
                         (c) => `<li>${esc(c)}</li>`);

  const clients = chaque(references, (r) => {
    const nom = r.accord ? r.nom : 'Groupe scolaire (nom communiqué sur accord)';
    return `
        <article class="carte">
          <h3>${esc(nom)}</h3>
          <p class="carte-meta">${esc(r.lieu)} · ${esc(r.mission)}</p>
          <p class="carte-volume">${esc(r.volume)}</p>
          <p>${esc(r.detail)}</p>
        </article>`;
  });

  const corps = `
  <section class="hero">
    <div class="conteneur">
      <h1>Qui sommes-nous</h1>
      <p class="hero-accroche">${esc(site.baseline)}</p>
    </div>
  </section>

  <div class="conteneur">
    ${filAriane([['Accueil', 'index.html'], ['À propos']])}
  </div>

  <section class="section">
    <div class="conteneur conteneur-texte">
      <h2 class="section-titre">Pourquoi CSA existe</h2>
      <p>Entre ce qu'on apprend à l'université et ce qu'un employeur attend
        d'un géologue le premier jour, il y a un écart que personne ne
        comble. Les logiciels du métier ne s'enseignent presque nulle part
        en Afrique francophone. Les formations officielles se donnent en
        Europe, en anglais, à plusieurs milliers d'euros.</p>
      <p>CSA existe pour combler cet écart, en français, avec des données
        africaines, à des tarifs qui restent accessibles.</p>
    </div>
  </section>

  <section class="section section-pale">
    <div class="conteneur">
      <h2 class="section-titre">Le formateur</h2>
      <div class="grille grille-2">
        <div>
          ${portrait ? `
          <figure class="portrait">
            <img src="${portrait}" width="640" height="800"
                 alt="${esc(formateur.nom)} — ${esc(formateur.titre)}"
                 loading="lazy" decoding="async">
          </figure>` : ''}
          <h3>${esc(formateur.nom)}</h3>
          <p class="carte-meta">${esc(formateur.titre)}</p>
          <p>${esc(formateur.formation)}</p>
          ${formateur.these ? `<p><strong>Thèse :</strong>
             ${esc(formateur.these)}</p>` : ''}
          <p>${esc(formateur.experience)}</p>
        </div>
        <div>
          ${logiciels ? `<h3>Logiciels maîtrisés</h3>
            <ul class="liste-check">${logiciels}</ul>` : ''}
          ${certifs ? `<h3>Certifications</h3>
            <ul class="liste-check">${certifs}</ul>` : ''}
        </div>
      </div>
    </div>
  </section>

  ${sectionGalerie(galerie, '', { classeSection: 'section' })}

  <section class="section section-pale">
    <div class="conteneur">
      <h2 class="section-titre">Nos références</h2>
      <div class="grille grille-2">${clients}</div>
    </div>
  </section>

  <section class="cta-final">
    <div class="conteneur">
      <h2>Une question&nbsp;?</h2>
      <p>WhatsApp ${esc(site.whatsappAffiche)} — réponse sous 48 heures.</p>
      <div class="cta-actions">
        <a href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA.')}"
           class="btn btn-primaire btn-large" target="_blank" rel="noopener">
          Nous écrire</a>
      </div>
    </div>
  </section>`;

  return page({
    titre: `À propos — ${site.nomComplet}`,
    description: 'CSA forme les professionnels des géosciences d\'Afrique '
      + 'francophone. Notre raison d\'être, notre formateur, nos références.',
    corps,
    actif: 'a-propos',
    chemin: 'a-propos.html',
    contenu,
  });
}

/* ══════════════════════════════════════════════════════════════════
   MENTIONS LÉGALES
   ══════════════════════════════════════════════════════════════════ */

export function pageMentions(contenu) {
  const { site } = contenu;

  const corps = `
  <section class="section">
    <div class="conteneur conteneur-texte">
      ${filAriane([['Accueil', 'index.html'], ['Mentions légales']])}
      <h1>Mentions légales</h1>

      <h2>Éditeur</h2>
      <p>${esc(site.nomComplet)}<br>
        ${esc(site.pays)}<br>
        E-mail : <a href="mailto:${esc(site.email)}">${esc(site.email)}</a><br>
        WhatsApp : ${esc(site.whatsappAffiche)}</p>

      <h2>Hébergement</h2>
      <p>Ce site est un site statique hébergé sur une plateforme de
        distribution de contenu. Aucune base de données n'est exploitée
        côté serveur.</p>

      <h2>Données personnelles</h2>
      <p>Les informations transmises via le formulaire d'inscription
        (nom, téléphone, e-mail, pays, profil, organisation, message) sont
        utilisées exclusivement pour traiter votre demande de formation.
        Elles ne sont ni vendues, ni cédées, ni transmises à des tiers à
        des fins commerciales.</p>
      <p>Vous pouvez demander à consulter, corriger ou supprimer vos
        données en écrivant à
        <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>

      <h2>Cookies</h2>
      <p>Ce site ne dépose aucun cookie de mesure d'audience ni de
        publicité. Les vidéos éventuellement intégrées sont servies par
        <code>youtube-nocookie.com</code>&nbsp;: aucun cookie publicitaire
        n'est déposé tant que vous ne lancez pas la lecture.</p>

      <h2>Propriété intellectuelle</h2>
      <p>Les contenus pédagogiques, supports, jeux de données et visuels
        présentés sur ce site sont la propriété de ${esc(site.nom)}. Les
        noms de logiciels cités (ISATIS, Surpac, Vulcan, Datamine,
        Leapfrog, ArcGIS, ERDAS, ENVI, Oasis Montaj, Whittle, MineSched)
        sont des marques de leurs éditeurs respectifs. CSA n'est affilié à
        aucun d'entre eux et ne fournit aucune licence.</p>
    </div>
  </section>`;

  return page({
    titre: `Mentions légales — ${site.nom}`,
    description: 'Mentions légales, traitement des données personnelles et '
      + 'propriété intellectuelle.',
    corps,
    actif: '',
    chemin: 'mentions.html',
    contenu,
  });
}

/* ══════════════════════════════════════════════════════════════════
   MERCI
   ══════════════════════════════════════════════════════════════════ */

export function pageMerci(contenu) {
  const { site } = contenu;

  const corps = `
  <section class="section section-centree">
    <div class="conteneur conteneur-texte">
      <p class="pastille-succes" aria-hidden="true">✓</p>
      <h1>Votre demande est bien arrivée</h1>
      <p class="hero-accroche">Un membre de l'équipe CSA vous répond sous
        48 heures avec le programme détaillé, les dates et les modalités
        d'inscription.</p>
      <p>Vous devriez recevoir un accusé de réception par e-mail dans les
        prochaines minutes. Pensez à regarder vos courriers indésirables.</p>
      <p>Votre demande est urgente&nbsp;? Écrivez-nous directement.</p>
      <div class="cta-actions cta-actions-centrees">
        <a href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA, je viens denvoyer le formulaire dinscription.')}"
           class="btn btn-primaire btn-large" target="_blank" rel="noopener">
          Discuter sur WhatsApp</a>
        <a href="formations.html" class="btn btn-secondaire btn-large">
          Retour au catalogue</a>
      </div>
    </div>
  </section>`;

  return page({
    titre: `Merci — ${site.nom}`,
    description: 'Votre demande d\'inscription a bien été enregistrée.',
    corps,
    actif: '',
    chemin: 'merci.html',
    contenu,
  });
}
