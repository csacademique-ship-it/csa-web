/**
 * CSA — Consulting Sciences Academy
 * Backend du formulaire d'inscription du site tunnel de vente.
 *
 * Ce que fait ce script a chaque envoi du formulaire :
 *   1. il verifie le piege a robots et les champs obligatoires ;
 *   2. il ajoute une ligne dans la feuille Google Sheets (telechargeable en .xlsx) ;
 *   3. il envoie dans la foulee un e-mail de notification a CSA ;
 *   4. il envoie un accuse de reception a la personne inscrite.
 *
 * Deploiement : voir GUIDE_DEPLOIEMENT.md, section 3.
 * Ne rien modifier en dessous de la zone CONFIGURATION sans raison.
 */

/* ====================== CONFIGURATION ====================== */

var CONFIG = {
  /* Laisser vide ("") si le script est lie a la feuille (Extensions > Apps Script).
     Sinon coller ici l'identifiant de la feuille : la partie de l'URL entre
     /d/ et /edit  ->  docs.google.com/spreadsheets/d/ICI/edit */
  ID_FEUILLE: "",

  NOM_ONGLET: "Inscriptions",

  /* Destinataires de la notification. Plusieurs adresses separees par une virgule. */
  EMAIL_CSA: "c.s.academique@gmail.com",

  /* Accuse de reception automatique a la personne inscrite. */
  ACCUSE_RECEPTION: true,

  NOM_EXPEDITEUR: "CSA — Consulting Sciences Academy",
  WHATSAPP: "+237 672 442 598",

  /* Anti-spam : nombre maximum d'envois acceptes par minute, toutes origines. */
  MAX_PAR_MINUTE: 12
};

/* Libelles lisibles des formations (identifiants utilises par le site). */
var FORMATIONS = {
  "geostatistique-r-python":     "Data Analyse & Geostatistique R/Python",
  "isatis-neo":                  "Estimation des ressources — ISATIS NEO",
  "google-earth-engine":         "Google Earth Engine",
  "cartographie-predictive":     "Cartographie predictive SIG + Machine Learning",
  "aeromagnetisme-oasis-montaj": "Aeromagnetisme — Oasis Montaj",
  "qgis-pro":                    "QGIS Pro",
  "sql-bases-geologiques":       "SQL pour bases de donnees geologiques",
  "ia-generative":               "IA generative appliquee",
  "excel-gestion-scolaire":      "Excel — gestion scolaire",
  "conseil":                     "Mission de conseil ou de recherche",
  "indecis":                     "Ne sait pas encore — a orienter"
};

var COLONNES = [
  "Horodatage", "Formation", "Nom", "Telephone", "Email", "Pays",
  "Profil", "Organisation", "Message", "Page d'origine", "Statut", "Suivi"
];

/* ====================== POINT D'ENTREE ====================== */

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    /* 1. piege a robots : champ cache "site" rempli => on ignore silencieusement */
    if (nettoie(p.site)) {
      return reponse({ ok: true });
    }

    /* 2. limitation de debit */
    if (!debitAutorise_()) {
      return reponse({ ok: false, erreur: "trop_de_requetes" });
    }

    /* 3. champs obligatoires */
    var champs = {
      formation:    nettoie(p.formation),
      nom:          nettoie(p.nom),
      telephone:    nettoie(p.telephone),
      email:        nettoie(p.email),
      pays:         nettoie(p.pays),
      profil:       nettoie(p.profil),
      organisation: nettoie(p.organisation),
      message:      nettoie(p.message),
      page:         nettoie(p.page)
    };

    var manquants = [];
    ["formation", "nom", "telephone", "email", "pays"].forEach(function (c) {
      if (!champs[c]) { manquants.push(c); }
    });
    if (manquants.length) {
      return reponse({ ok: false, erreur: "champs_manquants", champs: manquants });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champs.email)) {
      return reponse({ ok: false, erreur: "email_invalide" });
    }

    champs.formation_libelle = FORMATIONS[champs.formation] || champs.formation;

    /* 4. enregistrement puis notification — dans la meme execution */
    var ligne = enregistre_(champs);
    notifieCSA_(champs, ligne);
    if (CONFIG.ACCUSE_RECEPTION) { accuseReception_(champs); }

    return reponse({ ok: true, ligne: ligne });

  } catch (err) {
    journaliseErreur_(err, e);
    return reponse({ ok: false, erreur: "erreur_serveur" });
  }
}

function doGet() {
  return reponse({ ok: true, service: "CSA — formulaire d'inscription" });
}

/* ====================== ENREGISTREMENT ====================== */

function feuille_() {
  var classeur = CONFIG.ID_FEUILLE
    ? SpreadsheetApp.openById(CONFIG.ID_FEUILLE)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!classeur) {
    throw new Error("Aucune feuille accessible. Renseignez CONFIG.ID_FEUILLE.");
  }

  var f = classeur.getSheetByName(CONFIG.NOM_ONGLET);
  if (!f) {
    f = classeur.insertSheet(CONFIG.NOM_ONGLET);
  }
  if (f.getLastRow() === 0) {
    f.appendRow(COLONNES);
    var tete = f.getRange(1, 1, 1, COLONNES.length);
    tete.setFontWeight("bold")
        .setBackground("#0D5F99")
        .setFontColor("#FFFFFF");
    f.setFrozenRows(1);
    f.setColumnWidth(1, 150);   /* horodatage */
    f.setColumnWidth(2, 260);   /* formation  */
    f.setColumnWidth(9, 320);   /* message    */
  }
  return f;
}

function enregistre_(c) {
  /* verrou : deux envois simultanes ne doivent pas ecraser la meme ligne */
  var verrou = LockService.getScriptLock();
  verrou.waitLock(20000);
  try {
    var f = feuille_();
    f.appendRow([
      new Date(),
      c.formation_libelle,
      c.nom,
      "'" + c.telephone,          /* apostrophe : conserve le + et les zeros */
      c.email,
      c.pays,
      c.profil,
      c.organisation,
      c.message,
      c.page,
      "Nouveau",
      ""
    ]);
    return f.getLastRow();
  } finally {
    verrou.releaseLock();
  }
}

/* ====================== NOTIFICATIONS ====================== */

function notifieCSA_(c, ligne) {
  var sujet = "[CSA] Inscription — " + c.formation_libelle + " — " + c.nom;

  var lignes = [
    ["Formation",    c.formation_libelle],
    ["Nom",          c.nom],
    ["Telephone",    c.telephone],
    ["E-mail",       c.email],
    ["Pays",         c.pays],
    ["Profil",       c.profil || "—"],
    ["Organisation", c.organisation || "—"],
    ["Page",         c.page || "—"],
    ["Ligne",        String(ligne)]
  ];

  var tableau = lignes.map(function (l) {
    return '<tr>'
         + '<td style="padding:8px 14px;border-bottom:1px solid #E4E9F0;'
         + 'color:#6B6B6B;font-size:13px;white-space:nowrap">' + echappe(l[0]) + '</td>'
         + '<td style="padding:8px 14px;border-bottom:1px solid #E4E9F0;'
         + 'color:#1A1A1A;font-size:14px;font-weight:500">' + echappe(l[1]) + '</td>'
         + '</tr>';
  }).join("");

  var bloc_message = c.message
    ? '<div style="margin-top:20px;padding:14px 16px;background:#D6ECFA;'
      + 'border-left:3px solid #2B91D4">'
      + '<div style="font-size:12px;color:#0D5F99;text-transform:uppercase;'
      + 'letter-spacing:.5px;margin-bottom:6px">Message</div>'
      + '<div style="font-size:14px;color:#1A1A1A;line-height:1.6">'
      + echappe(c.message).replace(/\n/g, "<br>") + '</div></div>'
    : "";

  var corps =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto">'
  + '<div style="background:#0D5F99;padding:18px 22px">'
  + '<div style="color:#FFFFFF;font-size:17px;font-weight:bold">'
  + 'Nouvelle demande d\'inscription</div>'
  + '<div style="color:#D6ECFA;font-size:13px;margin-top:4px">'
  + 'Site CSA — tunnel de vente</div></div>'
  + '<div style="border:1px solid #E4E9F0;border-top:none;padding:20px 22px">'
  + '<table style="width:100%;border-collapse:collapse">' + tableau + '</table>'
  + bloc_message
  + '<div style="margin-top:22px">'
  + '<a href="https://wa.me/' + CONFIG.WHATSAPP.replace(/[^0-9]/g, "") + '" '
  + 'style="display:inline-block;background:#25D366;color:#FFFFFF;'
  + 'text-decoration:none;padding:10px 18px;font-size:14px;font-weight:bold">'
  + 'Ouvrir WhatsApp</a>'
  + '<a href="mailto:' + echappe(c.email) + '" '
  + 'style="display:inline-block;background:#2B91D4;color:#FFFFFF;'
  + 'text-decoration:none;padding:10px 18px;font-size:14px;font-weight:bold;'
  + 'margin-left:8px">Repondre par e-mail</a>'
  + '</div>'
  + '<p style="margin-top:22px;font-size:12px;color:#6B6B6B">'
  + 'Rappel : delai de reponse annonce sur le site — 48 heures.</p>'
  + '</div></div>';

  MailApp.sendEmail({
    to: CONFIG.EMAIL_CSA,
    subject: sujet,
    htmlBody: corps,
    replyTo: c.email,
    name: CONFIG.NOM_EXPEDITEUR
  });
}

function accuseReception_(c) {
  var corps =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto">'
  + '<div style="background:#0D5F99;padding:20px 22px">'
  + '<div style="color:#FFFFFF;font-size:18px;font-weight:bold">'
  + 'Votre demande est bien arrivee</div>'
  + '<div style="color:#D6ECFA;font-size:13px;margin-top:4px">'
  + 'Consulting Sciences Academy</div></div>'
  + '<div style="border:1px solid #E4E9F0;border-top:none;padding:22px">'
  + '<p style="font-size:15px;color:#1A1A1A;line-height:1.7">Bonjour '
  + echappe(c.nom) + ',</p>'
  + '<p style="font-size:15px;color:#1A1A1A;line-height:1.7">'
  + 'Nous avons bien recu votre demande concernant la formation '
  + '<strong>' + echappe(c.formation_libelle) + '</strong>. '
  + 'Un membre de l\'equipe CSA vous repond sous 48 heures avec le programme '
  + 'detaille, les dates et les modalites d\'inscription.</p>'
  + '<p style="font-size:15px;color:#1A1A1A;line-height:1.7">'
  + 'Si votre demande est urgente, ecrivez-nous directement sur WhatsApp au '
  + '<strong>' + echappe(CONFIG.WHATSAPP) + '</strong>.</p>'
  + '<p style="margin-top:24px">'
  + '<a href="https://wa.me/' + CONFIG.WHATSAPP.replace(/[^0-9]/g, "") + '" '
  + 'style="display:inline-block;background:#25D366;color:#FFFFFF;'
  + 'text-decoration:none;padding:12px 22px;font-size:15px;font-weight:bold">'
  + 'Discuter sur WhatsApp</a></p>'
  + '<p style="margin-top:26px;font-size:13px;color:#6B6B6B;line-height:1.6">'
  + 'CSA — Consulting Sciences Academy<br>'
  + 'Formation • Conseil • Recherche • Innovation<br>'
  + 'Former pour transformer l\'Afrique</p>'
  + '</div></div>';

  MailApp.sendEmail({
    to: c.email,
    subject: "CSA — nous avons bien recu votre demande",
    htmlBody: corps,
    name: CONFIG.NOM_EXPEDITEUR,
    replyTo: CONFIG.EMAIL_CSA.split(",")[0].trim()
  });
}

/* ====================== OUTILS ====================== */

function nettoie(v) {
  if (v === null || v === undefined) { return ""; }
  return String(v).replace(/[\r\n]+/g, "\n").trim().slice(0, 2000);
}

function echappe(v) {
  return String(v === null || v === undefined ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function reponse(objet) {
  return ContentService
    .createTextOutput(JSON.stringify(objet))
    .setMimeType(ContentService.MimeType.JSON);
}

function debitAutorise_() {
  var cache = CacheService.getScriptCache();
  var cle = "debit_" + Math.floor(Date.now() / 60000);
  var n = Number(cache.get(cle) || 0) + 1;
  cache.put(cle, String(n), 120);
  return n <= CONFIG.MAX_PAR_MINUTE;
}

function journaliseErreur_(err, e) {
  try {
    Logger.log("ERREUR : " + (err && err.stack ? err.stack : err));
    MailApp.sendEmail({
      to: CONFIG.EMAIL_CSA.split(",")[0].trim(),
      subject: "[CSA] Erreur du formulaire du site",
      body: "Une demande n'a pas pu etre traitee.\n\n"
          + "Erreur : " + (err && err.message ? err.message : err) + "\n\n"
          + "Donnees recues :\n"
          + JSON.stringify((e && e.parameter) || {}, null, 2)
          + "\n\nLa personne a vu un message l'invitant a ecrire sur WhatsApp."
    });
  } catch (ignore) {}
}

/* ====================== TEST MANUEL ======================
   Selectionner testerFormulaire dans la liste des fonctions et cliquer
   sur Executer. Une ligne de test doit apparaitre dans la feuille et
   deux e-mails doivent partir. Supprimer ensuite la ligne de test.       */

function testerFormulaire() {
  var faux = {
    parameter: {
      formation: "isatis-neo",
      nom: "Test CSA",
      telephone: "+237672442598",
      email: CONFIG.EMAIL_CSA.split(",")[0].trim(),
      pays: "Cameroun",
      profil: "Geologue",
      organisation: "Test",
      message: "Ceci est un test du formulaire.",
      page: "/inscription.html",
      site: ""
    }
  };
  Logger.log(doPost(faux).getContent());
}
