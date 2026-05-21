# SEO technique DreamsFly

## 1. Stack recommandée

Deux options selon les compétences internes :

- **Next.js 15 + headless CMS (Sanity / Strapi) + Shopify Hydrogen ou Medusa** — performance maximale, SSR/ISR, contrôle total. Recommandé.
- **Shopify Plus + thème custom + apps SEO (Yoast SEO, Schema Plus)** — plus rapide à lancer, moins de contrôle.

Quel que soit le choix, les exigences ci-dessous sont **non négociables**.

## 2. Core Web Vitals (cibles mobiles)

| Métrique | Bon | Cible DreamsFly |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2,5 s | **< 2,0 s** |
| INP (Interaction to Next Paint) | < 200 ms | **< 150 ms** |
| CLS (Cumulative Layout Shift) | < 0,1 | **< 0,05** |
| FCP | < 1,8 s | < 1,2 s |
| TTFB | < 800 ms | < 500 ms |

Levier principal : **images** (AVIF + WebP fallback, `srcset` responsive, lazy-loading natif, dimensions explicites pour éviter le CLS), **CDN** (Cloudflare / Vercel Edge), **fonts** auto-hébergées en `font-display: swap`, **JS** minimal et asynchrone.

## 3. Données structurées (schema.org JSON-LD)

À implémenter systématiquement, validé via Rich Results Test.

### Fiche produit
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Matelas DreamsFly Hybride 140x190",
  "image": ["https://dreamsfly.fr/img/matelas-hybride-140x190-1.jpg"],
  "description": "Matelas hybride mémoire de forme + ressorts ensachés...",
  "sku": "DF-HYB-140190",
  "gtin13": "3760000000001",
  "brand": { "@type": "Brand", "name": "DreamsFly" },
  "offers": {
    "@type": "Offer",
    "url": "https://dreamsfly.fr/matelas/hybride/140x190/",
    "priceCurrency": "EUR",
    "price": "599.00",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2026-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "shippingDetails": { "@type": "OfferShippingDetails", "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "EUR" } },
    "hasMerchantReturnPolicy": { "@type": "MerchantReturnPolicy", "applicableCountry": "FR", "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow", "merchantReturnDays": 100, "returnMethod": "https://schema.org/ReturnByMail", "returnFees": "https://schema.org/FreeReturn" }
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.7", "reviewCount": "1284" },
  "review": [ ... ]
}
```

### Autres types à implémenter

- `Organization` (home) avec logo, sameAs (réseaux sociaux), contactPoint.
- `BreadcrumbList` sur toutes les pages.
- `FAQPage` sur pages catégories et guides.
- `HowTo` sur les guides type « comment nettoyer un matelas ».
- `Article` + `author` (`Person`) sur les articles de blog.
- `WebSite` + `SearchAction` sur la home (sitelinks searchbox).
- `LocalBusiness` si showroom physique.

## 4. URLs et indexation

- HTTPS partout, HSTS activé.
- WWW vs apex : choisir un canonical, rediriger l'autre en 301.
- URLs en français, slugs courts, pas d'accents, pas de majuscules, pas de paramètres indexables.
- `robots.txt` : autoriser tout sauf `/panier/`, `/compte/`, `/checkout/`, `/search?`, `/*?sort=`, `/*?filter=`.
- `sitemap.xml` segmenté par type, soumis à Search Console + Bing Webmaster Tools.
- **IndexNow** activé pour Bing (notification instantanée des nouvelles URLs).
- Pagination : `rel=prev/next` + canonical sur la page 1 pour les catégories.
- **Facet navigation** : `noindex,follow` sur les combinaisons à faible valeur, `index,follow` sur les combinaisons stratégiques (ex : taille + fermeté).

## 5. Internationalisation (phase 2)

Pour l'expansion BE / CH / LU :

- Sous-répertoires : `/fr-be/`, `/fr-ch/`, `/fr-lu/` (préféré au domaine .be séparé pour mutualiser l'autorité).
- `hreflang` réciproques sur chaque variation.
- Prix locaux, devises, transporteurs, mentions légales adaptées.

## 6. Performance images

```
Image source → Pipeline :
  - Conversion AVIF (qualité 70) + WebP (qualité 80) + JPG fallback
  - Génération 5 tailles : 320, 640, 960, 1280, 1920
  - srcset + sizes correctement déclarés
  - width/height attributs en HTML (anti-CLS)
  - loading="lazy" sauf hero
  - decoding="async"
  - CDN avec cache long (1 an, immutable)
```

## 7. Suivi et outils

| Outil | Usage | Coût ~ |
|---|---|---|
| Google Search Console | Incontournable — indexation, requêtes, CWV | Gratuit |
| Bing Webmaster Tools | Indexation Bing/ChatGPT search | Gratuit |
| GA4 + Looker Studio | Trafic, conversions, attribution | Gratuit |
| Ahrefs | Backlinks, audit, rank tracking | ~200 €/mois |
| Semrush | Concurrence, mots-clés, position tracking | ~140 €/mois |
| Screaming Frog | Crawl technique mensuel | ~200 €/an |
| PageSpeed Insights + WebPageTest | CWV granulaire | Gratuit |
| Trustpilot + Avis Vérifiés | UGC + rich snippets | ~150 €/mois |
| Hotjar / Microsoft Clarity | UX, scrollmaps | Gratuit/freemium |

## 8. Checklist de lancement (à valider AVANT mise en prod)

- [ ] HTTPS + HSTS + redirections 301 en place
- [ ] Sitemaps XML soumis à GSC + Bing
- [ ] `robots.txt` validé
- [ ] Schema.org sur 100 % des templates (Product, Article, FAQ, Breadcrumb)
- [ ] Balises title/meta description sur 100 % des URLs (uniques, < 60 / < 155 caractères)
- [ ] H1 unique par page, hiérarchie h2-h6 cohérente
- [ ] Open Graph + Twitter Cards
- [ ] Favicons multi-format
- [ ] PageSpeed mobile > 90 sur les 5 templates principaux
- [ ] CWV au vert sur Search Console (28 jours)
- [ ] Pas de contenu dupliqué (Siteliner < 5 %)
- [ ] 404 personnalisée avec recherche + liens vers top catégories
- [ ] Pas de chaînes de redirections (1 hop max)
- [ ] Hreflang validé (si international)
- [ ] Search Console + GA4 + Tag Manager configurés
- [ ] Suivi des conversions e-commerce GA4 (purchase, add_to_cart, view_item)
- [ ] Audit sécurité (en-têtes CSP, X-Frame-Options, etc.)
