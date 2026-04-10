# Rapport PFA — Dental Reservation (LaTeX / Overleaf)

## Formatage appliqué (conforme au modèle EMSI)

| Élément | Police | Taille | Style |
|---------|--------|--------|-------|
| Corps du texte | Times New Roman | 12pt | Normal, interligne 1.5 |
| Titres liminaires (Dédicace, Remerciements, Résumé, Abstract, Glossaire, etc.) | Times New Roman | 24pt | **Gras, centré** |
| Texte Dédicace / Remerciements | Times New Roman | 16pt | *Italique, centré* |
| Texte Résumé / Abstract | Times New Roman | 14pt | Normal |
| Titres des chapitres | Times New Roman | 18pt | **Gras** |
| Titres des paragraphes (sections) | Times New Roman | 18pt | **Gras** |
| Sous-paragraphes (subsections) | Times New Roman | 14pt | **Gras** |
| Sous-sous-paragraphes | Times New Roman | 12pt | Normal |
| Légendes de figures | Times New Roman | — | **Gras, centré** |
| Légendes de tableaux | Times New Roman | — | **Gras, centré** |

## Structure

- Chaque chapitre commence par une **page entière** présentant le titre et les sous-titres
- **Résumé** + **Mots clés** / **Abstract** + **Keywords**
- **Glossaire** trié par ordre alphabétique (avec EMSI)
- **Liste des figures** et **Liste des tableaux** en pages séparées
- **Table des matières** avec titre 24pt gras centré
- **Références** au format : Auteur, « Titre », Lien, consulté le ...
- **Annexes** (A.1, A.2, ...)

## Comment utiliser sur Overleaf

1. **Compresser** tout le dossier `rapport-latex/` en `.zip`
2. Sur Overleaf → **New Project** → **Upload Project** → sélectionner le `.zip`
3. Le compilateur détectera automatiquement `main.tex`
4. Ajouter vos **images/screenshots** dans le dossier `figures/`
5. Décommenter les lignes `\includegraphics` dans les chapitres
6. Personnaliser la **page de garde** (noms, logo EMSI)
7. Compiler avec **pdfLaTeX**

## Structure du projet

## Arborescence du projet

```
rapport-latex/
├── main.tex                    # Fichier principal (compiler celui-ci)
├── chapters/
│   ├── 00_page_de_garde.tex    # Page de garde
│   ├── 01_dedicaces.tex        # Dédicace (24pt gras centré + 16pt italique)
│   ├── 02_remerciements.tex    # Remerciements (24pt gras centré + 16pt italique)
│   ├── 03_abstract.tex         # Abstract (24pt + 14pt + Keywords)
│   ├── 04_resume.tex           # Résumé (24pt + 14pt + Mots clés)
│   ├── 05_acronymes.tex        # Glossaire (alphabétique, avec EMSI)
│   ├── 06_introduction_generale.tex
│   ├── 07_chapitre1_contexte.tex   # Page titre + contenu
│   ├── 08_chapitre2_etude.tex      # Page titre + contenu
│   ├── 09_chapitre3_conception.tex  # Page titre + contenu
│   ├── 10_chapitre4_realisation.tex # Page titre + contenu
│   ├── 11_conclusion.tex       # Conclusion Générale et Perspectives
│   ├── 12_bibliographie.tex    # Références (format consulté le ...)
│   └── 13_annexes.tex          # Annexes (A.1, A.2, ...)
└── figures/
    └── README.txt              # Instructions pour ajouter les images
```
