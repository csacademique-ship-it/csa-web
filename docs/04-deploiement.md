# 4. Mettre le site en ligne

**Durée : environ 1 h 30 la première fois. Coût : 0 FCFA**, sauf le nom de
domaine (8 000 à 15 000 FCFA par an, facultatif).

Deux choses à faire, dans cet ordre :
**A.** brancher le formulaire — **B.** publier le site.

---

# A. Le formulaire d'inscription

Le formulaire fait **deux choses en une seule exécution** : il ajoute une
ligne dans une feuille Google (téléchargeable en Excel) **et** il envoie
l'e-mail de notification à CSA. Il envoie aussi un accusé de réception au
prospect.

## A1. Créer la feuille de réponses (5 min)

1. <https://sheets.google.com>, connecté avec **c.s.academique@gmail.com**
2. Créez une feuille vierge
3. Renommez-la **CSA — Inscriptions site web**
4. N'écrivez rien dedans : le script crée les colonnes tout seul

> Pour récupérer un fichier Excel à tout moment :
> **Fichier → Télécharger → Microsoft Excel (.xlsx)**

## A2. Installer le script (10 min)

1. Dans la feuille : **Extensions → Apps Script**
2. Effacez tout le contenu de `Code.gs`
3. Ouvrez `server/apps-script/Code.gs` du projet, **copiez tout**, **collez**
4. Renommez le projet : **CSA — Formulaire site**
5. Enregistrez (icône disquette)

Rien à configurer : le script étant lié à la feuille, `ID_FEUILLE` reste vide.

## A3. Tester AVANT de publier (5 min)

1. Choisissez la fonction **`testerFormulaire`** dans la barre du haut
2. Cliquez **Exécuter**
3. Google demande une autorisation :
   - **Examiner les autorisations** → compte CSA
   - Écran « Google n'a pas validé cette application » :
     **Paramètres avancés** → **Accéder à CSA — Formulaire site (non sécurisé)**
   - **Autoriser**

   *C'est normal : l'avertissement s'affiche pour tout script personnel non
   publié sur le store Google. Le code est le vôtre.*

4. Vérifiez :
   - une ligne **Test CSA** est apparue dans la feuille
   - un e-mail « [CSA] Inscription — … » est arrivé
   - un e-mail « CSA — nous avons bien reçu votre demande » aussi
5. Supprimez la ligne de test

**Si ça échoue ici, ne passez pas à la suite.** Le problème vient de
l'autorisation, pas du site.

## A4. Publier le script (5 min)

1. **Déployer → Nouveau déploiement**
2. Engrenage → **Application Web**
3. Remplissez :

   | Champ | Valeur |
   |---|---|
   | Description | `v1 — formulaire site CSA` |
   | Exécuter en tant que | **Moi (c.s.academique@gmail.com)** |
   | Qui a accès | **Tout le monde** |

   > « Tout le monde » est obligatoire : les visiteurs ne sont pas connectés à
   > Google. Ils ne voient jamais la feuille, seulement le formulaire.

4. **Déployer** → copiez l'**URL de l'application Web**, de la forme
   `https://script.google.com/macros/s/AKfycb…/exec`

## A5. Brancher le site (2 min)

Ouvrez `content/site.json`, remplacez :

```json
"urlFormulaire": "REMPLACER_PAR_URL_APPS_SCRIPT"
```

par votre URL :

```json
"urlFormulaire": "https://script.google.com/macros/s/AKfycb…/exec"
```

Puis :

```bash
npm run verify
```

Le contrôle « URL du formulaire NON configuree » doit avoir disparu.

> **Après toute modification du code Apps Script :**
> Déployer → Gérer les déploiements → crayon → Version : **Nouvelle version**
> → Déployer. Sans cela, l'ancienne version continue de tourner.

---

# B. Publier le site

## Option recommandée — Netlify, connecté à Git

C'est la bonne façon de faire pour un vrai projet : chaque `git push`
redéploie automatiquement.

1. Poussez le projet sur GitHub (dépôt privé si vous préférez)
2. <https://app.netlify.com> → **Add new site → Import an existing project**
3. Choisissez votre dépôt
4. Netlify lit `netlify.toml` et remplit tout seul :
   - Build command : `npm run build`
   - Publish directory : `dist`
5. **Deploy**

Chaque modification poussée sur `main` met le site à jour en une minute. La
CI GitHub (`.github/workflows/ci.yml`) lance les contrôles et les tests à
chaque push — si quelque chose casse, vous le savez avant le déploiement.

## Option simple — glisser-déposer

Sans Git, sans compte GitHub :

```bash
npm run build
```

Puis glissez le dossier **`dist`** sur <https://app.netlify.com/drop>.

Pour publier une mise à jour : reconstruisez, puis reglissez `dist` dans
l'onglet **Deploys**.

> Attention : c'est `dist` qu'on dépose, pas `csa-web`.

## Autres hébergeurs

Le site est **100 % statique** : pas de base de données, pas de PHP, pas de
Node côté serveur. `dist/` fonctionne tel quel sur Vercel, Cloudflare Pages,
GitHub Pages, ou n'importe quel hébergeur classique par FTP.

---

# C. Le nom de domaine (facultatif)

`csa-academy.netlify.app` fonctionne parfaitement. Un nom propre inspire
davantage confiance.

1. Achetez le domaine chez Namecheap, OVH ou Gandi
   (`consultingsciences.africa`, `csa-academy.org`…)
2. Netlify → **Domain settings → Add custom domain**
3. Recopiez les enregistrements DNS chez le vendeur du domaine
4. Attendez 2 à 24 h. Le certificat HTTPS s'active seul

Renseignez ensuite le domaine dans `content/site.json` :

```json
"domaine": "consultingsciences.africa"
```

Cela active les URL canoniques et le sitemap complet — utile pour Google.

---

# D. Vérification finale

À faire **depuis un téléphone, en 4G**, pas depuis l'ordinateur qui a servi à
construire le site.

- [ ] La page d'accueil s'affiche, le logo est net
- [ ] Le menu s'ouvre au tap
- [ ] Les 18 fiches formation s'ouvrent
- [ ] Chaque bouton WhatsApp ouvre WhatsApp avec le message pré-rempli
- [ ] Le formulaire refuse un e-mail invalide
- [ ] Un envoi complet redirige vers `merci.html`
- [ ] La ligne apparaît dans la feuille Google
- [ ] Les deux e-mails arrivent
- [ ] Depuis `formations/isatis-neo.html`, le bouton d'inscription
      pré-sélectionne bien ISATIS NEO

---

# En cas de problème

| Symptôme | Cause probable | Solution |
|---|---|---|
| « Le formulaire n'est pas encore connecté » | `urlFormulaire` non remplacée | A5 puis `npm run build` |
| « L'envoi a échoué » | Déploiement non public | A4 : « Qui a accès » = Tout le monde |
| Ligne enregistrée, aucun e-mail | Quota Gmail atteint (100/jour) | Attendre 24 h |
| Modification invisible en ligne | Site pas reconstruit ou pas redéployé | `npm run build` puis redéployer |
| Netlify : « Page not found » | Vous avez déposé `csa-web` au lieu de `dist` | Redéposer `dist` |

---

Suite : [5. Architecture](05-architecture.md)
