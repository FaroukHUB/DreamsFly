# DreamsFly

E-commerce de matelas premium — livraison dans toute la France.

**Stack** : Next.js 15 · TypeScript · Tailwind CSS · Sanity (CMS) · Stripe · Vercel · Hostinger (domaine + email)

## Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration Sanity

1. Crée un projet Sanity sur [sanity.io/manage](https://sanity.io/manage) (Free)
2. Récupère ton `projectId`
3. Crée un token d'écriture : **API → Tokens → Add API token** (rôle Editor)
4. Copie `.env.example` en `.env.local` et remplis :

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=skxxxxxxxxxx
```

### 3. Import du catalogue Trust Industrie

```bash
npm run import:trust
```

Importe les 20 matelas (BERLIN, MILAN, MONACO, LAS VEGAS, etc.) dans Sanity avec photos.

### 4. Démarrage du serveur

```bash
npm run dev
```

- **Site** : <http://localhost:3000>
- **Studio Sanity** : <http://localhost:3000/studio>

### 5. Premier contenu à créer dans Sanity Studio

Connecte-toi à `/studio` et crée :

1. **Page d'accueil** → uploade la vidéo `public/videos/hero-matelas.mp4` dans le hero
2. **Paramètres du site** → top bar, menu, footer
3. (Les 20 matelas sont déjà importés via le script)

## Structure du projet

```
DreamsFly/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout root + polices Sora + Plus Jakarta Sans
│   ├── page.tsx                  # Page d'accueil (consomme Sanity)
│   ├── globals.css               # Tokens design + classes utilitaires
│   └── studio/                   # Studio Sanity embarqué à /studio
├── components/
│   ├── logo.tsx                  # Logo DreamsFly SVG inline
│   ├── header.tsx                # Header sticky + nav + cart
│   ├── footer.tsx                # Footer 5 colonnes
│   ├── hero.tsx                  # Hero MODULAIRE (vidéo / image / promo)
│   └── usp-strip.tsx             # Strip 4 USPs
├── lib/
│   ├── sanity/                   # Client + queries GROQ
│   └── stripe/                   # Client Stripe (à venir)
├── sanity/
│   └── schemas/                  # Schémas du CMS
│       ├── homepage.ts           # ⭐ Hero modulaire (vidéo / image / promo)
│       ├── siteSettings.ts       # Top bar, menu, footer, contact
│       ├── product.ts            # Matelas + variantes + composition
│       ├── category.ts           # Pages catégorie SEO
│       ├── guide.ts              # Articles du magazine du sommeil
│       ├── author.ts             # Comité d'experts (kinés, ostéos)
│       └── review.ts             # Avis clients vérifiés
├── scripts/
│   └── import-trust-catalog.ts   # Import CSV Trust Industrie → Sanity
├── data/                          # CSV catalogue + récap markdown
├── public/
│   ├── videos/                    # hero-matelas.mp4
│   └── images/
├── demo/                          # Démos statiques (pour validation visuelle)
└── docs/                          # Documentation stratégique
    ├── strategie-seo.md
    ├── arborescence.md
    ├── mots-cles.md
    ├── contenu-eeat.md
    ├── technique-seo.md
    └── roadmap.md
```

## Hero modulaire — comment ça marche

Le **hero de la home est piloté depuis Sanity Studio**. Tu vas dans **Page d'accueil → 🎬 Hero principal** et tu choisis :

- 🎥 **Vidéo** — tu uploades un fichier `.mp4`, l'image poster s'affiche pendant le chargement
- 🖼️ **Image** — tu uploades une image, parfait pour un visuel campagne
- 🏷️ **Bannière promo** — tu mets un badge (« -40% »), un titre, un prix « dès », et un visuel produit

Dans tous les cas tu peux ajouter : titre superposé, sous-titre, CTA principal, CTA secondaire, note de réassurance.

**Idem pour la bannière secondaire** (à droite) — c'est le « dual hero » à la Emma.

## Déploiement Vercel + Hostinger

1. Push le code sur GitHub
2. Connecte le repo à Vercel ([vercel.com/new](https://vercel.com/new))
3. Renseigne les variables d'environnement (Sanity, Stripe, etc.)
4. Pour relier `dreamsfly.fr` :
   - Dans Vercel → Settings → Domains → Add `dreamsfly.fr`
   - Vercel te donne 2 enregistrements DNS (A + CNAME ou ALIAS)
   - Va dans Hostinger → Domaines → DNS → ajoute les 2 enregistrements
   - SSL automatique sous 1-5 minutes

## Phase actuelle

✅ Phase 1 — Scaffold (foundations) :
- Config Next.js + Tailwind + tokens design
- Sanity Studio embarqué + 7 schémas
- Logo SVG inline
- Hero modulaire fonctionnel (vidéo/image/promo)
- Header, Footer, USP Strip
- Script d'import catalogue Trust

🔄 Phase 2 (à venir) — Templates :
- Page fiche produit (`/matelas/[slug]`)
- Page catégorie (`/matelas`, `/matelas/memoire-de-forme/`, etc.)
- Sections home restantes (best-sellers, mosaïque, quiz CTA, awards, brand statement)
- Page guide (`/guides/[slug]`)
- Pages institutionnelles

🔄 Phase 3 (à venir) — E-commerce :
- Panier (Zustand)
- Checkout Stripe
- Webhook + commandes Sanity
- Emails Resend

🔄 Phase 4 (à venir) — SEO + perf :
- Sitemap dynamique
- Schema.org partout
- Optimisation images AVIF/WebP
- Core Web Vitals au vert
