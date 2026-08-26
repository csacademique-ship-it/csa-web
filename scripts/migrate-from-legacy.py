#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Migration unique : ancien generateur Python  ->  projet csa-web.

Lit `Site_Web_Tunnel_Vente/generateur/donnees_site.py` et produit :

  content/site.json
  content/references.json
  content/temoignages.json
  content/formateur.json
  content/formations/<id>.md      (front matter JSON + corps Markdown)

Ce script n'a vocation a etre execute qu'une fois. Il est conserve dans le
depot comme trace de la migration : si un doute surgit sur l'origine d'un
contenu, on peut rejouer la conversion et comparer.

    python scripts/migrate-from-legacy.py
"""

import json
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
LEGACY = RACINE.parent / "Site_Web_Tunnel_Vente" / "generateur"
CONTENU = RACINE / "content"

if not (LEGACY / "donnees_site.py").exists():
    sys.exit(f"Source introuvable : {LEGACY / 'donnees_site.py'}")

sys.path.insert(0, str(LEGACY))
import donnees_site as L  # noqa: E402


# ── ordre et regroupement des cles du front matter ──────────────────
CLES_FM = [
    "id", "nom", "nomCourt", "categorie", "resume", "accroche",
    "phare", "nouveau", "image", "video", "videoLegende",
    "prix", "prixMin", "prixMax", "statutPrix", "paiement",
    "duree", "seances", "format", "outils", "formules",
]


def fm_formation(f):
    """Construit le front matter JSON d'une formation."""
    d = {
        "id": f["id"],
        "nom": f["nom"],
        "nomCourt": f["nom_court"],
        "categorie": f["categorie"],
        "resume": f["resume"],
        "accroche": f["accroche"],
        "phare": bool(f.get("phare")),
        "nouveau": bool(f.get("nouveau")),
        "image": f.get("illustration") or f["id"],
        "video": f.get("video") or "",
        "videoLegende": f.get("video_legende") or "",
        "prix": f.get("prix"),
        "statutPrix": f.get("statut_prix"),
        "paiement": f.get("paiement", ""),
        "duree": f["duree"],
        "seances": f["seances"],
        "format": f["format"],
        "outils": f.get("outils", ""),
    }
    if f.get("prix_min") is not None:
        d["prixMin"] = f["prix_min"]
        d["prixMax"] = f["prix_max"]
    if f.get("formules"):
        d["formules"] = [
            {
                "nom": k["nom"],
                "prix": k["prix"],
                "prixUsd": k.get("prix_usd"),
                "recommande": bool(k.get("recommande")),
                "resume": k.get("resume", ""),
                "inclus": k.get("inclus", []),
                "exclus": k.get("exclus", []),
            }
            for k in f["formules"]
        ]
    # on retire les cles vides pour garder les fichiers lisibles
    d = {k: v for k, v in d.items()
         if v not in ("", None, [], False) or k in ("phare", "nouveau")}
    # remise en ordre
    return {k: d[k] for k in CLES_FM if k in d}


def liste(items):
    return "\n".join(f"- {x}" for x in items)


def corps_formation(f):
    """Corps Markdown : sections reperees par des titres de niveau 2."""
    s = []
    s.append("## Problème\n\n" + f["probleme"])
    s.append("## Promesse\n\n" + f["promesse"])

    if f.get("licence_requise"):
        s.append("## Licence\n\n" + f["licence_requise"])

    s.append("## Public\n\n" + liste(f["public"]))
    s.append("## Prérequis\n\n" + liste(f["prerequis"]))
    s.append("## Acquis\n\n" + liste(f["acquis"]))

    prog = ["## Programme\n"]
    for titre, corps in f["programme"]:
        prog.append(f"### {titre}\n\n{corps}")
    s.append("\n\n".join(prog))

    s.append("## Fil rouge\n\n" + f["fil_rouge"])

    pr = ["## Preuves\n"]
    for titre, corps in f["preuves"]:
        pr.append(f"### {titre}\n\n{corps}")
    s.append("\n\n".join(pr))

    s.append("## Différenciateurs\n\n" + liste(f["differenciateurs"]))

    faq = ["## FAQ\n"]
    for q, r in f["faq"]:
        faq.append(f"### {q}\n\n{r}")
    s.append("\n\n".join(faq))

    return "\n\n".join(s) + "\n"


def ecrire_formation(f):
    fm = json.dumps(fm_formation(f), ensure_ascii=False, indent=2)
    texte = f"---\n{fm}\n---\n\n{corps_formation(f)}"
    (CONTENU / "formations" / f"{f['id']}.md").write_text(texte,
                                                          encoding="utf-8")
    return len(texte)


def main():
    (CONTENU / "formations").mkdir(parents=True, exist_ok=True)

    site = {
        "nom": L.CSA["nom"],
        "nomComplet": L.CSA["nom_complet"],
        "slogan": L.CSA["slogan"],
        "sousTitre": L.CSA["sous_titre"],
        "baseline": L.CSA["baseline"],
        "email": L.CSA["email"],
        "whatsapp": L.CSA["whatsapp"],
        "whatsappAffiche": L.CSA["whatsapp_affiche"],
        "pays": L.CSA["pays"],
        "domaine": L.CSA["domaine"],
        "urlFormulaire": L.URL_FORMULAIRE,
        "piliers": [{"icone": i, "titre": t, "texte": x}
                    for i, t, x in L.PILIERS],
        "chiffres": [{"valeur": v, "libelle": lib, "detail": d}
                     for v, lib, d in L.CHIFFRES],
        "paysFormulaire": L.PAYS,
        "profilsFormulaire": L.PROFILS,
    }
    (CONTENU / "site.json").write_text(
        json.dumps(site, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    (CONTENU / "references.json").write_text(
        json.dumps(L.REFERENCES, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    (CONTENU / "temoignages.json").write_text(
        json.dumps(L.TEMOIGNAGES, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    (CONTENU / "formateur.json").write_text(
        json.dumps(L.FORMATEUR, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")

    total = 0
    for f in L.FORMATIONS:
        total += ecrire_formation(f)
        print(f"  content/formations/{f['id']}.md")

    print(f"\n{len(L.FORMATIONS)} formations migrees, "
          f"{total/1024:.0f} Ko de Markdown")


if __name__ == "__main__":
    main()
