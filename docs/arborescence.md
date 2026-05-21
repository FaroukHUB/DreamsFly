# Arborescence DreamsFly — Structure en silo SEO

Principe : **3 clics max** entre la home et n'importe quelle fiche produit. Chaque silo est étanche sémantiquement, avec son propre maillage interne. Le blog est le seul espace transverse qui pointe vers les silos commerciaux.

## Carte du site (niveau 1 à 4)

```
/  (Home)
│
├── /matelas/                                   [SILO 1 — pilier commercial principal]
│    ├── /matelas/memoire-de-forme/
│    │    ├── /matelas/memoire-de-forme/90x190/
│    │    ├── /matelas/memoire-de-forme/140x190/
│    │    ├── /matelas/memoire-de-forme/160x200/
│    │    ├── /matelas/memoire-de-forme/180x200/
│    │    └── /matelas/memoire-de-forme/[fiche-produit]/
│    ├── /matelas/ressorts-ensaches/
│    │    └── (mêmes sous-tailles + fiches)
│    ├── /matelas/hybride/
│    ├── /matelas/latex/
│    ├── /matelas/mousse/
│    │
│    ├── /matelas/par-taille/
│    │    ├── /matelas/90x190/
│    │    ├── /matelas/120x190/
│    │    ├── /matelas/140x190/         ← page TRÈS importante (volume)
│    │    ├── /matelas/160x200/
│    │    ├── /matelas/180x200/
│    │    ├── /matelas/200x200/
│    │    └── /matelas/sur-mesure/
│    │
│    ├── /matelas/par-fermete/
│    │    ├── /matelas/ferme/
│    │    ├── /matelas/equilibre/
│    │    ├── /matelas/moelleux/
│    │    └── /matelas/tres-ferme/
│    │
│    ├── /matelas/par-profil/
│    │    ├── /matelas/mal-de-dos/      ← très fort potentiel SEO
│    │    ├── /matelas/femme-enceinte/
│    │    ├── /matelas/enfant/
│    │    ├── /matelas/bebe/
│    │    ├── /matelas/adolescent/
│    │    ├── /matelas/senior/
│    │    ├── /matelas/couple/
│    │    ├── /matelas/dormeur-lourd/
│    │    ├── /matelas/dormeur-cote/
│    │    ├── /matelas/dormeur-dos/
│    │    └── /matelas/dormeur-ventre/
│    │
│    └── /matelas/par-usage/
│         ├── /matelas/clic-clac/
│         ├── /matelas/canape-convertible/
│         ├── /matelas/camping-car/
│         ├── /matelas/bz/
│         └── /matelas/appoint/
│
├── /sommiers/                                  [SILO 2]
│    ├── /sommiers/tapissier/
│    ├── /sommiers/lattes/
│    ├── /sommiers/coffre/
│    ├── /sommiers/electrique/
│    ├── /sommiers/relevable/
│    └── /sommiers/par-taille/...
│
├── /surmatelas/                                [SILO 3]
│    ├── /surmatelas/memoire-de-forme/
│    ├── /surmatelas/latex/
│    ├── /surmatelas/chauffant/
│    ├── /surmatelas/rafraichissant/
│    └── /surmatelas/par-taille/...
│
├── /oreillers/                                 [SILO 4]
│    ├── /oreillers/memoire-de-forme/
│    ├── /oreillers/ergonomique/
│    ├── /oreillers/cervical/
│    ├── /oreillers/plumes/
│    └── /oreillers/par-position-sommeil/...
│
├── /couettes/                                  [SILO 5]
│    ├── /couettes/legere/
│    ├── /couettes/temperee/
│    ├── /couettes/chaude/
│    ├── /couettes/4-saisons/
│    └── /couettes/naturelle/synthetique/
│
├── /linge-de-lit/                              [SILO 6]
│    ├── /linge-de-lit/draps-housses/
│    ├── /linge-de-lit/parures/
│    ├── /linge-de-lit/percale/
│    ├── /linge-de-lit/satin-coton/
│    └── /linge-de-lit/lin-lave/
│
├── /lits/                                      [SILO 7 — optionnel phase 2]
│    ├── /lits/coffre/
│    ├── /lits/tete-de-lit/
│    └── /lits/enfant/
│
├── /packs/                                     [SILO 8 — bundles à forte conversion]
│    ├── /packs/matelas-sommier/
│    ├── /packs/literie-complete/
│    └── /packs/chambre-enfant/
│
├── /guides/                                    [SILO ÉDITORIAL — magazine du sommeil]
│    ├── /guides/comment-choisir-son-matelas/
│    ├── /guides/quel-matelas-mal-de-dos/
│    ├── /guides/matelas-mousse-vs-ressorts/
│    ├── /guides/duree-de-vie-matelas/
│    ├── /guides/entretien-matelas/
│    ├── /guides/dimensions-matelas/
│    ├── /guides/fermete-matelas-comment-choisir/
│    ├── /guides/quel-sommier-pour-quel-matelas/
│    └── /guides/sommeil/                       ← sous-silo santé du sommeil
│         ├── /guides/sommeil/insomnie/
│         ├── /guides/sommeil/apnee/
│         ├── /guides/sommeil/cycles-sommeil/
│         └── /guides/sommeil/sommeil-bebe/
│
├── /tests/                                     [Banc d'essai DreamsFly — preuve E-E-A-T]
│    └── /tests/[slug-test-matelas]/
│
├── /comparatifs/                               [Pages comparatives — fort intent]
│    ├── /comparatifs/dreamsfly-vs-emma/
│    ├── /comparatifs/dreamsfly-vs-tediber/
│    └── /comparatifs/dreamsfly-vs-hypnia/
│
├── /marque/                                    [Pages institutionnelles — trust]
│    ├── /marque/qui-sommes-nous/
│    ├── /marque/fabrication-francaise/
│    ├── /marque/nos-experts/
│    ├── /marque/certifications/
│    ├── /marque/engagements-rse/
│    └── /marque/avis-clients/
│
├── /services/                                  [Réassurance]
│    ├── /services/livraison/
│    ├── /services/livraison-france/
│    ├── /services/essai-100-nuits/
│    ├── /services/garantie-10-ans/
│    ├── /services/financement/
│    ├── /services/reprise-ancien-matelas/
│    └── /services/sav/
│
├── /aide/                                      [Support — FAQPage schema]
│    ├── /aide/faq/
│    ├── /aide/suivi-commande/
│    ├── /aide/retour-remboursement/
│    └── /aide/contact/
│
└── /pages-legales/
     ├── /mentions-legales/
     ├── /cgv/
     ├── /politique-confidentialite/
     └── /cookies/
```

## Règles de maillage interne

1. **Header global** : Matelas | Sommiers | Surmatelas | Oreillers | Couettes | Linge de lit | Packs | Guides.
2. **Méga-menu** par silo : type → taille → profil → fermeté.
3. **Breadcrumbs visibles sur 100 % des pages** + `BreadcrumbList` schema.
4. **Liens contextuels** sur chaque fiche produit : « Voir tous les matelas mémoire de forme », « Voir le sommier compatible », « Guide d'achat mémoire de forme ».
5. **Footer SEO** : liens vers les 30 pages les plus stratégiques (par taille, par profil, par fermeté).
6. **Pages catégories** : minimum 800 mots de contenu éditorial unique au-dessus ou en-dessous de la grille produits, FAQ en bas avec `FAQPage` schema.
7. **Pas de pagination infinie** : on pagine `/page/2/`, `/page/3/` avec `rel=prev/next` logique + canonical sur la page 1.
8. **Filtres à facettes** : `noindex` sur les combinaisons à faible valeur, `index` sur les combinaisons stratégiques (ex. taille + fermeté).

## Naming URL

- Minuscules, tirets, pas d'accents, pas de mots vides.
- Profondeur max : 4 segments (`/matelas/memoire-de-forme/140x190/nom-produit/`).
- Slugs courts et explicites.
- Pas de paramètres GET indexables (`?sort=`, `?color=` → `noindex` ou canonical).
