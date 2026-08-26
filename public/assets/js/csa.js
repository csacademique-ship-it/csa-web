/**
 * Comportements du site CSA.
 * Aucune bibliotheque externe. Fonctionne sans build, sans transpilation.
 *
 * La configuration (URL du formulaire, numero WhatsApp) est injectee par
 * le build dans assets/js/config.js, charge avant ce fichier.
 */
(function () {
  'use strict';

  var CONFIG = window.CSA_CONFIG || {};

  /* ── menu mobile ──────────────────────────────────────────────── */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var ouvert = nav.classList.toggle('ouvert');
      burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('ouvert');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── accordeons ───────────────────────────────────────────────── */
  document.querySelectorAll('.acc-tete').forEach(function (tete) {
    tete.addEventListener('click', function () {
      var corps = document.getElementById(tete.getAttribute('aria-controls'));
      if (!corps) return;
      var ouvert = tete.getAttribute('aria-expanded') === 'true';
      tete.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
      corps.style.maxHeight = ouvert ? null : corps.scrollHeight + 'px';
    });
  });

  /* ── preselection de la formation depuis l'URL ────────────────── */
  var select = document.getElementById('formation');
  if (select) {
    var params = new URLSearchParams(window.location.search);
    var demandee = params.get('f');
    if (demandee) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === demandee) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }

  /* ── formulaire d'inscription ─────────────────────────────────── */
  var form = document.getElementById('form-inscription');
  if (!form) return;

  var msg = document.getElementById('msg');
  var bouton = document.getElementById('btn-envoi');
  var url = CONFIG.urlFormulaire || '';
  var tel = CONFIG.whatsappAffiche || '';

  function afficher(texte, type) {
    msg.textContent = texte;
    msg.className = 'form-message visible ' + type;
  }

  function erreurChamp(champ, texte) {
    afficher(texte, 'erreur');
    champ.focus();
    champ.setAttribute('aria-invalid', 'true');
  }

  form.addEventListener('input', function (e) {
    e.target.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // piege a robots : rempli = automate, on fait semblant d'accepter
    if (form.site.value) {
      window.location.href = 'merci.html';
      return;
    }

    var requis = ['formation', 'nom', 'telephone', 'email', 'pays'];
    for (var i = 0; i < requis.length; i++) {
      var champ = form[requis[i]];
      if (!champ.value.trim()) {
        erreurChamp(champ, 'Merci de remplir tous les champs obligatoires.');
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value)) {
      erreurChamp(form.email, "L'adresse e-mail ne semble pas valide.");
      return;
    }
    if (form.telephone.value.replace(/\D/g, '').length < 8) {
      erreurChamp(form.telephone, 'Le numéro de téléphone semble incomplet.');
      return;
    }

    if (!url || url.indexOf('REMPLACER') === 0) {
      afficher('Le formulaire n\'est pas encore connecté. Écrivez-nous sur '
        + 'WhatsApp au ' + tel + '.', 'erreur');
      return;
    }

    bouton.disabled = true;
    bouton.textContent = 'Envoi en cours…';

    var data = new FormData(form);
    data.append('page', window.location.pathname);
    data.append('dateEnvoi', new Date().toISOString());

    fetch(url, { method: 'POST', body: data })
      .then(function () { window.location.href = 'merci.html'; })
      .catch(function () {
        bouton.disabled = false;
        bouton.textContent = 'Envoyer ma demande';
        afficher('L\'envoi a échoué. Écrivez-nous sur WhatsApp au ' + tel
          + ', nous traiterons votre demande.', 'erreur');
      });
  });
})();
