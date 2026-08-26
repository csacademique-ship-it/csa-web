/** Formulaire d'inscription. */

import { esc, chaque } from '../lib/html.mjs';
import { prixAffiche, lienWhatsApp } from '../lib/format.mjs';
import { page } from '../components/layout.mjs';
import { filAriane } from '../components/blocs.mjs';

export function pageInscription(contenu) {
  const { site, formations } = contenu;

  const options = chaque(formations, (f) => {
    const prix = prixAffiche(f);
    return `<option value="${esc(f.id)}">${esc(f.nomCourt)} — ${esc(prix)}</option>`;
  });

  const pays = chaque(site.paysFormulaire,
                      (p) => `<option>${esc(p)}</option>`);
  const profils = chaque(site.profilsFormulaire,
                         (p) => `<option>${esc(p)}</option>`);

  const corps = `
  <section class="section">
    <div class="conteneur conteneur-texte">
      ${filAriane([['Accueil', 'index.html'], ['Inscription']])}
      <h1>Demander votre inscription</h1>
      <p class="hero-accroche">Réponse sous 48 heures avec le programme
        détaillé, les dates et les modalités de paiement. Aucun paiement
        n'est demandé à cette étape.</p>

      <form class="formulaire" id="form-inscription" novalidate>
        <div class="champ">
          <label for="formation">Formation souhaitée <span aria-hidden="true">*</span></label>
          <select id="formation" name="formation" required>
            <option value="">— Choisissez une formation —</option>
            ${options}
            <option value="conseil">Une mission de conseil ou de recherche</option>
            <option value="indecis">Je ne sais pas encore, conseillez-moi</option>
          </select>
        </div>

        <div class="champs-duo">
          <div class="champ">
            <label for="nom">Nom et prénom <span aria-hidden="true">*</span></label>
            <input type="text" id="nom" name="nom" required autocomplete="name">
          </div>
          <div class="champ">
            <label for="telephone">Téléphone / WhatsApp <span aria-hidden="true">*</span></label>
            <input type="tel" id="telephone" name="telephone" required
                   autocomplete="tel" placeholder="+237 6XX XX XX XX">
          </div>
        </div>

        <div class="champ">
          <label for="email">Adresse e-mail <span aria-hidden="true">*</span></label>
          <input type="email" id="email" name="email" required
                 autocomplete="email" placeholder="nom@exemple.com">
        </div>

        <div class="champs-duo">
          <div class="champ">
            <label for="pays">Pays <span aria-hidden="true">*</span></label>
            <select id="pays" name="pays" required>
              <option value="">— Choisissez —</option>${pays}
            </select>
          </div>
          <div class="champ">
            <label for="profil">Votre profil</label>
            <select id="profil" name="profil">
              <option value="">— Choisissez —</option>${profils}
            </select>
          </div>
        </div>

        <div class="champ">
          <label for="organisation">Organisation ou établissement</label>
          <input type="text" id="organisation" name="organisation"
                 autocomplete="organization">
        </div>

        <div class="champ">
          <label for="message">Votre message</label>
          <textarea id="message" name="message" rows="4"
                    placeholder="Ce que vous faites aujourd'hui, ce que vous voulez pouvoir faire, vos contraintes de calendrier ou de licence."></textarea>
        </div>

        <div class="piege" aria-hidden="true">
          <label for="site">Ne pas remplir</label>
          <input type="text" id="site" name="site" tabindex="-1"
                 autocomplete="off">
        </div>

        <p class="form-mention">Vos informations servent uniquement à traiter
          votre demande. Elles ne sont ni vendues ni transmises à des tiers.
          Voir les <a href="mentions.html">mentions légales</a>.</p>

        <p class="form-message" id="msg" role="status" aria-live="polite"></p>

        <button type="submit" class="btn btn-primaire btn-large btn-bloc"
                id="btn-envoi">Envoyer ma demande</button>
      </form>

      <p class="form-secours">Vous préférez écrire directement&nbsp;?
        <a href="${lienWhatsApp(site.whatsapp, 'Bonjour CSA, je souhaite minscrire a une formation.')}"
           target="_blank" rel="noopener">WhatsApp ${esc(site.whatsappAffiche)}</a>
        ou <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
    </div>
  </section>`;

  return page({
    titre: `Inscription — ${site.nom}`,
    description: 'Demandez votre inscription à une formation CSA. '
      + 'Réponse sous 48 heures, aucun paiement à cette étape.',
    corps,
    actif: 'inscription',
    chemin: 'inscription.html',
    contenu,
  });
}
