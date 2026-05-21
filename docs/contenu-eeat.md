# Plan de contenu E-E-A-T

Google évalue les sites via le framework **E-E-A-T** (Experience, Expertise, Authoritativeness, Trustworthiness). C'est ce qui sépare un site de matelas qui rank d'un site qui stagne page 4.

## 1. Experience — On a vraiment essayé les produits

- **Banc d'essai DreamsFly** : labo interne où chaque matelas est noté sur 10 critères mesurables :
  - Densité (kg/m³) — mesurée.
  - Hauteur réelle vs annoncée — mesurée.
  - Indépendance de couchage — test billes / verre d'eau.
  - Thermorégulation — capteur thermique sur 8h.
  - Accueil (moelleux/ferme) — note 1-10.
  - Soutien (zone lombaire) — note 1-10.
  - Bord renforcé — test affaissement.
  - Bruit (matelas à ressorts) — décibels mesurés.
  - Odeur initiale (off-gassing) — durée avant disparition.
  - Tenue dans le temps — re-test à 3, 6, 12 mois.
- **Photos et vidéos originales** sur chaque fiche produit (pas de visuels fabricants seuls).
- **Avis vérifiés** : intégration Trustpilot + Avis Vérifiés, affichage du `AggregateRating` schema.
- **Photos clients** via UGC (programme « partagez votre chambre »).

## 2. Expertise — Des auteurs identifiables et qualifiés

- **Comité d'experts** affiché publiquement avec page auteur + schema `Person` :
  - Kinésithérapeute (problématiques dos / posture).
  - Ostéopathe (alignement vertébral).
  - Ingénieur literie (matériaux, technologies).
  - Médecin du sommeil (santé du sommeil).
  - Designer produit (ergonomie, confort).
- **Signature obligatoire** sur chaque article : photo, titre, bio courte, lien vers la page auteur complète, lien LinkedIn.
- **Article relu et validé par** : mention en bas d'article, date de dernière relecture.

## 3. Authoritativeness — On est cité, donc on existe

- **Digital PR continue** : 1 étude exclusive / trimestre (« Baromètre du sommeil des Français », « Comment dorment les parents d'enfants en bas âge », « Sommeil et télétravail »). Diffusion presse → Le Parisien, BFM, Le Figaro, Doctissimo, Top Santé.
- **Tribunes signées** par nos experts sur des médias d'autorité (Doctissimo, Santé Magazine, Madame Figaro).
- **Certifications visibles** sur le site et schema `Certification` :
  - Oeko-Tex Standard 100
  - CertiPUR (mousses)
  - NF Literie
  - Eurolatex (latex)
  - GOTS (coton bio)
- **Partenariats** : labo indépendant pour les tests, ostéopathes/kinés en cabinet, marques de literie françaises pour la fabrication.

## 4. Trustworthiness — Tout est transparent

- **Page « Qui sommes-nous »** détaillée : histoire, fondateurs (photos, parcours), adresse physique, capital social, numéro RCS.
- **Mentions légales et CGV** complètes, à jour, accessibles depuis le footer.
- **Politique de confidentialité RGPD** rigoureuse, bandeau cookies conforme CNIL.
- **Garantie 10 ans, essai 100 nuits, retour gratuit** affichés sur 100 % des fiches produit.
- **SAV** : numéro de téléphone visible (pas seulement un formulaire), horaires, chat en direct.
- **Sécurité paiement** : badges Visa/Mastercard/PayPal/3D Secure, mention HTTPS, pas de tracker tiers non-essentiel.
- **Avis clients** : positifs ET négatifs affichés, réponse de la marque sur les négatifs.

## 5. Plan éditorial 12 mois

### Mois 1-3 — Fondations (50 articles piliers)

- Comment choisir son matelas (pilier 3 500 mots)
- Comment choisir son sommier (pilier 2 500 mots)
- Comment choisir son oreiller (pilier 2 500 mots)
- Comment choisir sa couette (pilier 2 000 mots)
- Matelas mousse vs ressorts vs latex vs hybride (pilier 3 000 mots)
- Quel matelas pour le mal de dos (pilier 3 000 mots, signé kiné + ostéo)
- Densité matelas : comment lire les fiches techniques (pilier 2 000 mots)
- Quelle fermeté de matelas choisir (pilier 2 000 mots)
- Durée de vie d'un matelas (pilier 1 800 mots)
- Comment nettoyer et entretenir son matelas (pilier 2 000 mots)
- Dimensions matelas : guide complet (pilier 2 000 mots)
- Cycles du sommeil et qualité de sommeil (pilier 2 500 mots, signé médecin)
- + 38 articles « satellites » qui pointent vers les piliers.

### Mois 4-6 — Couverture profils & cas d'usage (40 articles)

- Matelas femme enceinte : guide complet
- Matelas bébé : sécurité et confort (très réglementé, opportunité E-E-A-T)
- Matelas enfant : à quel âge changer
- Matelas adolescent : croissance et sommeil
- Matelas senior : confort et autonomie
- Matelas couple : indépendance de couchage
- Matelas dormeur lourd (>100 kg)
- Matelas chaud/froid : thermorégulation
- Matelas apnée du sommeil
- Matelas hernie discale
- (...)

### Mois 7-9 — Comparatifs et longue traîne (60 articles)

- DreamsFly vs Emma : comparatif honnête
- DreamsFly vs Tediber
- DreamsFly vs Hypnia
- Emma vs Tediber : qui choisir
- Top 10 matelas mémoire de forme 2026
- Top 10 matelas mal de dos
- (...)

### Mois 10-12 — Approfondissement santé du sommeil (40 articles)

- Sous-silo `/guides/sommeil/` autour de l'insomnie, apnée, paralysie du sommeil, rêves, sieste, mélatonine, hygiène de sommeil, sommeil et sport, sommeil et alimentation.
- Objectif : devenir une **référence santé du sommeil** au-delà du commerce, ce qui débloque les backlinks Doctissimo, Top Santé, etc.

## 6. Format type d'une page catégorie SEO

Chaque page catégorie (`/matelas/memoire-de-forme/`) suit ce template :

1. **H1** clair avec mot-clé principal.
2. **Intro 150 mots** : promesse, bénéfices, USP DreamsFly.
3. **Grille produits** (6-12 produits) avec filtres.
4. **Bloc « Notre sélection d'experts »** — top 3 recommandé par notre kiné, avec mini-justification.
5. **H2 Qu'est-ce qu'un matelas mémoire de forme ?** (200 mots)
6. **H2 Avantages et inconvénients** (tableau pour/contre)
7. **H2 Pour qui ?** (profils dormeurs)
8. **H2 Comment choisir** (densité, épaisseur, fermeté)
9. **H2 Entretien**
10. **H2 FAQ** (8-12 questions) + `FAQPage` schema
11. **Bloc « À lire aussi »** : 3 guides liés
12. **Breadcrumbs** en haut et en bas
