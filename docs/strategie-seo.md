# Stratégie SEO DreamsFly

## 1. État du marché français du matelas en ligne (2026)

Le marché français de la literie pèse **≈ 1,5 milliard d'euros** par an. La part du e-commerce a franchi **30 %** en 2025 contre moins de 10 % en 2018. Trois pure-players DTC (direct-to-consumer) dominent la SERP française :

| Marque | Positionnement | Volume mensuel marque | Best-seller |
|---|---|---|---|
| **Emma** | Leader européen — pédagogie + tunnel court | ~135 000 / mois | Emma Hybride II, Emma Original Pro |
| **Tediber** | Premium « Made in France », ton éditorial fort | ~6 600 / mois | L'Incroyable, Le Matelas Tediber |
| **Hypnia** | Mémoire de forme, rapport qualité-prix, parrainage agressif | ~2 400 / mois | Bien-être Suprême |
| **Eve Sleep / Simba** | Marques anglo-saxonnes, présence déclinante en FR | — | — |
| **Bultex / Simmons / Epeda / Dunlopillo** | Marques historiques, distribution mixte (But, Conforama, Maison de la Literie) | Moyen | — |

### Ce qu'on apprend de leurs sites

- **Tediber** mise sur un **éditorial puissant** (blog « Bien dormir », guides longs, FAQ exhaustive sur chaque fiche produit) et un **silo très propre** (`/matelas/`, `/sommiers/`, `/oreillers/`, `/linge-de-lit/`).
- **Emma** exploite à fond les **comparatifs**, **labels** (Élu Produit de l'Année, UFC-Que Choisir, Stiftung Warentest) et le **maillage international** (hreflang).
- **Hypnia** carbure aux **pages SEO secondaires** (par taille, par fermeté, par profil dormeur) et aux **avis vérifiés**.

### Notre opportunité

Aucun acteur n'a un site **techniquement parfait** ET un contenu **vraiment expert** ET un maillage **complet par intention de recherche**. Il y a une fenêtre pour s'imposer en combinant les 3.

## 2. Piliers de la stratégie

### Pilier 1 — Architecture en silo hermétique

Voir [`arborescence.md`](arborescence.md). Chaque silo est sémantiquement étanche : les liens internes restent dans le silo, sauf depuis le blog vers les catégories (et jamais l'inverse au même niveau).

### Pilier 2 — Couverture sémantique exhaustive

Pour chaque type de matelas (mousse, ressorts, hybride, latex, mémoire de forme), on génère :

- 1 page catégorie pilier.
- N pages **par taille** (`/matelas-mousse/140x190/`).
- N pages **par fermeté** (`/matelas/ferme/`, `/matelas/equilibre/`, `/matelas/moelleux/`).
- N pages **par profil** (`/matelas/mal-de-dos/`, `/matelas/femme-enceinte/`, `/matelas/enfant/`, `/matelas/couple/`, `/matelas/dormeur-lourd/`).
- 1 fiche produit par référence.

### Pilier 3 — E-E-A-T : on prouve qu'on est expert

Voir [`contenu-eeat.md`](contenu-eeat.md). Concrètement :

- **Experience** : photos et vidéos de nos propres tests, banc d'essai interne, notes sur 10 critères mesurés (densité, accueil, soutien, thermorégulation, indépendance de couchage).
- **Expertise** : auteurs identifiés (kinésithérapeute, ostéopathe, ingénieur literie) avec page auteur et schema `Person`.
- **Authoritativeness** : citations presse (Le Monde, 60M consommateurs, UFC-Que Choisir), partenariats labos, certifications (Oeko-Tex, CertiPUR, NF Literie).
- **Trust** : avis vérifiés (Trustpilot + Avis Vérifiés), garantie 10 ans, essai 100 nuits, mentions légales, RGPD, page « Qui sommes-nous » détaillée, SAV téléphonique visible.

### Pilier 4 — SEO technique premier de la classe

Voir [`technique-seo.md`](technique-seo.md). Cibles :

- LCP < 2,0 s, INP < 200 ms, CLS < 0,05 sur mobile.
- Schema.org complet : `Product`, `Offer`, `AggregateRating`, `Review`, `BreadcrumbList`, `FAQPage`, `HowTo`, `Organization`, `LocalBusiness` si points relais physiques, `Article` pour le blog.
- Images en AVIF/WebP, lazy-loading, `srcset` responsive.
- HTML sémantique, h1-h6 cohérents, breadcrumbs visibles.
- URLs courtes, en français, sans paramètres : `/matelas-memoire-de-forme/140x190/`.
- Sitemap segmenté (`sitemap-produits.xml`, `sitemap-categories.xml`, `sitemap-blog.xml`), indexation pilotée via Search Console + IndexNow (Bing).

### Pilier 5 — Backlinks et autorité

- **Digital PR** : études exclusives (« Baromètre du sommeil des Français 2026 »), infographies, datavisualisation.
- **Partenariats experts** : tribunes signées par des kinés/ostéos sur Doctissimo, Santé Magazine, Top Santé.
- **Comparateurs et médias literie** : presse-citron, journaldugeek, sleepdoctor, testavis — fiches produits transmises pour tests indépendants.
- **Linkbaiting** : outil interactif « Quel matelas pour mon profil ? », calculateur de durée de vie d'un matelas, quiz fermeté.

## 3. KPI à suivre

| KPI | Outil | Cible 6 mois | Cible 12 mois |
|---|---|---|---|
| Trafic SEO mensuel | GA4 + Search Console | 50 000 | 200 000 |
| Mots-clés top 3 | Ahrefs / Semrush | 200 | 800 |
| Mots-clés top 10 | Ahrefs / Semrush | 1 000 | 3 500 |
| Domain Rating | Ahrefs | 35 | 55 |
| Backlinks référents | Ahrefs | 150 domaines | 500 domaines |
| Taux de conversion SEO | GA4 | 1,5 % | 2,5 % |
| Avis vérifiés | Trustpilot | 500 (4,6+) | 2 500 (4,7+) |

## 4. Ce qu'on NE fait PAS

- Pas de cloaking, pas de PBN, pas d'achat de liens massif — Google sanctionne et la marque s'effondre.
- Pas de duplicate content entre tailles (chaque page taille a un contenu propre : usage, dimensions de chambre recommandées, profils types).
- Pas de pages vides / thin content : si une page n'a pas 600 mots utiles minimum, on ne la publie pas.
- Pas de surcharge IA non relue : le contenu généré est systématiquement passé par un rédacteur expert + un relecteur literie.

## 5. Sources

- [Doris Décoration — Marché du matelas 2026](https://dorisdecoration.fr/le-marche-du-matelas-en-france-en-2026-quand-le-web-redessine-les-regles-du-jeu/)
- [Xerfi — Marché matelas et sommiers](https://www.xerfi.com/presentationetude/le-marche-des-matelas-et-sommiers_CSO10)
- [Testavis — Comparatif 8 marques 2026](https://www.testavis.fr/marques/matelas)
- [Presse-citron — Meilleur matelas en ligne 2026](https://www.presse-citron.net/matelas/)
- [SleepDoctor — Top 10 matelas 2026](https://sleepdoctor.fr/comparatif/matelas/meilleur-matelas)
- [Search Engine Land — E-E-A-T guide](https://searchengineland.com/guide/google-e-e-a-t-for-seo)
- [Google — Helpful, Reliable, People-First Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Facem Web — Silos, hubs, clusters SEO](https://facemweb.com/blog/seo/silos-hubs-cluster-seo/)
- [Millennium Digital — Arborescence silo SEO](https://www.millennium-digital.com/site-web-seo/arborescence-site/)
- [Schema.org — Product](https://schema.org/Product)
