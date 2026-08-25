import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { allProductsForPillarQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { fetchPageHeros, pickHeroImageUrl } from "@/lib/sanity/page-heros";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SeoCrossLinks } from "@/components/seo-cross-links";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  articleSchema,
  faqSchema,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 300;

const PATH = "/matelas-memoire-de-forme";
const H1 = "Matelas mémoire de forme : le guide complet 2026";
const META_TITLE = "Matelas mémoire de forme — Guide 2026 · DreamsFly";
const META_DESC =
  "Tout sur les matelas à mémoire de forme : technologie, avantages réels, pour qui, densités, comparatif. Notre gamme Performance sélectionnée pour ses résultats mesurés.";

const FAQ = [
  {
    question: "Qu'est-ce qu'un matelas mémoire de forme exactement ?",
    answer:
      "La mousse à mémoire de forme (visco-élastique) est un polymère développé par la NASA dans les années 1970 pour absorber les chocs des sièges de fusée. Sous l'effet de la chaleur corporelle (34-36°C), elle se ramollit et épouse la forme du dormeur, puis reprend sa forme initiale une fois délestée. Elle absorbe les points de pression au lieu de les réfléchir.",
  },
  {
    question: "Pour qui la mémoire de forme est-elle idéale ?",
    answer:
      "Trois profils en tirent le maximum : (1) dormeurs sur le côté avec épaules ou hanches sensibles — la mousse comble la courbure et évite les points de pression ; (2) personnes avec douleurs articulaires (arthrose, tendinites) — l'accueil enveloppant soulage sans écraser ; (3) couples avec grand écart de poids — chacun s'enfonce à son juste niveau sans déformer la moitié adverse.",
  },
  {
    question: "Quelle densité de mousse mémoire choisir ?",
    answer:
      "La densité (kg/m³) détermine la durée de vie. Sous 45 kg/m³ = entrée de gamme, dure 3-5 ans. 50-65 kg/m³ = milieu de gamme, 7-8 ans. Au-dessus de 65 kg/m³ = premium (notre standard), 10-12 ans. Nos matelas Performance utilisent une mousse à 65-75 kg/m³ — la même densité que les modèles à 2 500 € des grandes marques.",
  },
  {
    question: "La mémoire de forme fait-elle transpirer ?",
    answer:
      "C'est un cliché des matelas d'il y a 15 ans. Les mousses modernes intègrent des cellules ouvertes, du gel infusé ou du graphite pour évacuer la chaleur corporelle. Nos modèles Performance ont une housse Tencel respirante + une couche gel — la température de surface reste 2 à 3°C plus fraîche qu'une mousse traditionnelle (mesure de laboratoire à 20°C ambiant).",
  },
  {
    question: "Mémoire de forme ou ressorts ensachés, lequel choisir ?",
    answer:
      "Mémoire = enveloppement, absorption des points de pression, meilleure indépendance des mouvements. Ressorts = soutien tonique, respiration maximale, plus \"rebondissant\". Pour un couple avec des besoins différents ou si vous hésitez, un modèle hybride (mémoire + ressorts) est souvent le meilleur compromis. Notre gamme Performance en propose plusieurs.",
  },
  {
    question: "Combien de temps pour s'habituer à un matelas mémoire de forme ?",
    answer:
      "5 à 15 nuits en moyenne. Votre corps a pris des habitudes sur votre ancien matelas — la nouvelle façon dont votre poids se répartit sur la mousse demande une adaptation musculaire. Ne jugez donc pas votre matelas après deux nuits : laissez passer trois semaines avant de vous faire un avis. Si vous hésitez entre deux fermetés, venez les comparer en showroom avant de commander.",
  },
  {
    question: "Comment entretenir un matelas mémoire de forme ?",
    answer:
      "Ne le retournez PAS (la face inférieure n'a pas la mousse mémoire, elle n'est pas conçue pour être dessus). Tournez-le tête-pied tous les 3 mois pour équilibrer l'usure. Aérez 20 min chaque matin. Housse déhoussable lavable à 40°C. Évitez la sur-humidité — c'est le seul vrai ennemi de la mousse mémoire.",
  },
  {
    question: "Un matelas mémoire de forme fait-il vraiment durer 10 ans ?",
    answer:
      "Oui, à trois conditions : (1) densité ≥ 65 kg/m³ (nos modèles), (2) sommier compatible en bon état (à lattes ou tapissier récent), (3) rotation régulière + housse de protection. Sous ces conditions, la perte de soutien est inférieure à 5 % après 10 ans (mesures fabricant). Un modèle bas de gamme à 40 kg/m³ perd 30 % de soutien en 4 ans.",
  },
];

const TIPS = [
  {
    icon: "🌡️",
    title: "Ambiance chaude ? Gel + housse Tencel",
    text: "Si votre chambre dépasse 22°C, choisissez un modèle avec gel infusé ou couche graphite. La mousse mémoire pure conserve la chaleur — le gel évacue les calories corporelles vers l'extérieur du matelas.",
    source: "Fabricants européens de literie (EBIA)",
  },
  {
    icon: "⏳",
    title: "Ne jugez pas les 3 premières nuits",
    text: "Les 3 premières nuits sur mémoire de forme peuvent surprendre — sensation d'enveloppement inhabituel, réveil avec l'empreinte du corps. C'est normal. Après 5-7 nuits, votre corps trouve son équilibre et vous sentez la vraie valeur ajoutée.",
    source: "Recommandation ostéopathes SFDO",
  },
  {
    icon: "📐",
    title: "Épaisseur ≥ 25 cm pour la vraie sensation",
    text: "Sous 22 cm d'épaisseur, l'effet mémoire de forme est atténué — vous sentez trop vite la couche de soutien en dessous. Nos modèles Performance font 26 à 32 cm d'épaisseur.",
    source: "Norme AFNOR NF EN 1957 (literie)",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: META_TITLE, description: META_DESC, path: PATH, type: "article" });
}

export default async function MemoryFoamLanding() {
  const [products, siteSettings, heros] = await Promise.all([
    sanityClient?.fetch<any[]>(allProductsForPillarQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
    fetchPageHeros(),
  ]);

  // Filtre : matelas type mémoire de forme uniquement
  const memoryProducts = products.filter(
    (p) => p.type === "memoire-ressorts" || /m[eé]moire/i.test(p.title || "")
  ).slice(0, 6);

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Matelas", url: "/matelas" },
    { name: "Mémoire de forme", url: PATH },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <ScrollReveal />

      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Gamme Performance · Guide expert"
        title={H1}
        lead="La mémoire de forme est devenue LE standard du confort orthopédique en 40 ans. Absorption des points de pression, alignement de la colonne, absence de mouvements ressentis — ses bénéfices sont réels quand la mousse est de qualité. Ce guide vous aide à distinguer les vrais modèles Performance des imitations bon marché."
        emphasize={2}
        imageUrl={pickHeroImageUrl(heros.memoireDeForme, "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1400")}
      />

      <main className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-24">

        {/* Chiffres clés */}
        <section className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { number: "75 kg/m³", label: "Densité premium DreamsFly" },
            { number: "-38 %", label: "Points de pression vs mousse HR (étude fabricant)" },
            { number: "10-12 ans", label: "Durée de vie moyenne mesurée" },
            { number: "-2,5°C", label: "Surface plus fraîche grâce au gel infusé" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
              <div className="font-sora text-3xl font-bold text-midnight">{s.number}</div>
              <div className="mt-2 text-sm text-pierre">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Comment ça marche */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow-editorial on-cream mb-2">Technologie</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              Comment la mousse à mémoire de forme fonctionne réellement
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Réaction thermique", text: "À 34-36°C (température corporelle), la mousse visco-élastique se ramollit. Chaque point de contact avec le corps se creuse à sa densité propre — épaules 0,8 cm, hanches 1,2 cm, mollets 0,5 cm." },
              { step: "2", title: "Répartition du poids", text: "L'enfoncement varié répartit uniformément votre poids sur toute la surface. Résultat : aucune zone ne subit plus de pression qu'une autre. Fini les fourmillements, les épaules douloureuses, les hanches qui tirent." },
              { step: "3", title: "Retour élastique", text: "Une fois délestée (quand vous changez de position), la mousse revient à sa forme initiale en 3 à 8 secondes selon sa densité. Les modèles premium ont un retour plus rapide — vous ne restez pas 'coincé·e'." },
            ].map((s, i) => (
              <article key={i} className="rounded-3xl bg-white p-6 md:p-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-midnight font-sora text-lg font-bold text-white">
                  {s.step}
                </div>
                <h3 className="display-serif on-cream text-[1.2rem] font-normal md:text-[1.4rem]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pierre md:text-base">{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Comparatif densités */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow-editorial on-cream mb-2">Reconnaître la qualité</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              Le seul critère qui compte vraiment : la densité
            </h2>
            <p className="mt-3 text-pierre">
              90 % des matelas mémoire de forme du marché sont fabriqués avec la même mousse — seule la densité change.
              C'est le facteur qui détermine la durée de vie, le maintien, et la sensation d'accueil.
            </p>
          </div>
          <div className="-mx-6 overflow-x-auto md:mx-0">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm md:text-base">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 border-b border-lin bg-white px-4 py-4 text-left font-sora font-semibold text-ink md:px-6">Densité</th>
                  <th className="border-b border-lin bg-white px-4 py-4 text-left font-sora font-semibold text-ink md:px-6">Positionnement</th>
                  <th className="border-b border-lin bg-white px-4 py-4 text-left font-sora font-semibold text-ink md:px-6">Durée de vie</th>
                  <th className="border-b-2 border-midnight bg-midnight px-4 py-4 text-left font-sora font-semibold text-white md:px-6">Prix indicatif</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["< 45 kg/m³", "Entrée de gamme (supermarché, discount)", "3 à 5 ans", "150 – 300 €"],
                  ["45 – 55 kg/m³", "Milieu de gamme (grandes surfaces)", "5 à 7 ans", "300 – 600 €"],
                  ["55 – 65 kg/m³", "Bon rapport qualité/prix", "7 à 9 ans", "600 – 900 €"],
                  ["65 – 75 kg/m³", "Performance DreamsFly ★", "10 à 12 ans", "700 – 1 400 €"],
                  ["> 75 kg/m³", "Luxe (grandes marques)", "12 à 15 ans", "1 800 – 3 500 €"],
                ].map((row, i) => {
                  const isRecommended = i === 3;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-page/50"}>
                      <td className={`sticky left-0 z-10 border-b border-lin px-4 py-3 font-medium md:px-6 md:py-4 ${isRecommended ? "bg-midnight/[0.04] text-ink" : "bg-inherit text-ink"}`}>
                        {row[0]}
                      </td>
                      <td className="border-b border-lin px-4 py-3 text-pierre md:px-6 md:py-4">{row[1]}</td>
                      <td className="border-b border-lin px-4 py-3 text-pierre md:px-6 md:py-4">{row[2]}</td>
                      <td className={`border-b border-lin px-4 py-3 md:px-6 md:py-4 ${isRecommended ? "bg-midnight/[0.04] font-semibold text-ink" : "text-pierre"}`}>
                        {row[3]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-brume">
            ★ Notre positionnement : la même densité que le luxe, sans les marges de la distribution — nous vendons en direct.
          </p>
        </section>

        {/* Conseils experts sourcés */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow-editorial on-cream mb-2">Le mot des experts</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              3 vérités qu'un vendeur ne vous dira pas
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TIPS.map((tip, i) => (
              <article key={i} className="flex flex-col rounded-2xl bg-white p-6 md:p-7">
                <span aria-hidden className="mb-3 text-3xl">{tip.icon}</span>
                <h3 className="display-serif on-cream text-[1.2rem] font-normal">{tip.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-pierre md:text-base">{tip.text}</p>
                <p className="mt-4 border-t border-lin pt-3 text-[11px] uppercase tracking-widest text-brume">
                  Source : {tip.source}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Modèles Performance */}
        {memoryProducts.length > 0 && (
          <section className="mb-16 rounded-3xl bg-white p-6 md:mb-20 md:p-10">
            <div className="mb-8 max-w-2xl">
              <span className="eyebrow-editorial on-cream mb-2">Notre sélection</span>
              <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
                Nos matelas mémoire de forme Performance
              </h2>
              <p className="mt-3 text-pierre">
                {memoryProducts.length} modèles sélectionnés — densité ≥ 65 kg/m³, garantie 2 ans, essai possible en showroom.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {memoryProducts.map((p: any) => (
                <Link
                  key={p._id}
                  href={`/matelas/${p.slug}`}
                  className="group flex flex-col rounded-2xl border border-lin bg-page p-4 transition-all hover:-translate-y-1 hover:border-midnight"
                >
                  <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
                    {p.image && (
                      <Image src={urlFor(p.image).width(500).url()} alt={p.name} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <h3 className="display-serif on-cream text-[1.05rem] font-normal">{p.name}</h3>
                  <p className="mb-3 line-clamp-2 text-[13px] text-pierre">{p.tagline}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-lin pt-3">
                    <span className="text-[11px] text-brume">Dès</span>
                    <span className="font-sora text-lg font-bold text-discount">{p.minPrice} €</span>
                    {p.compareAtPrice && p.compareAtPrice > p.minPrice && (
                      <span className="text-xs text-brume line-through">{p.compareAtPrice} €</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-16 md:mb-20">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="eyebrow-editorial on-cream mb-2">FAQ mémoire de forme</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              {FAQ.length} questions pour décider en toute confiance
            </h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group rounded-2xl bg-white p-5 open:shadow-[0_4px_16px_rgba(15,23,42,0.05)] md:p-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <h3 className="display-serif on-cream text-[1.15rem] font-normal md:text-[1.3rem]">{f.question}</h3>
                  <span aria-hidden className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-page text-midnight transition-transform group-open:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-pierre md:text-base">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Maillage interne */}
        <section className="rounded-3xl bg-gradient-to-br from-midnight to-midnight-dark p-8 text-white md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-sora text-2xl font-semibold tracking-tight md:text-3xl">
              Pas encore convaincu·e par la mémoire de forme ?
            </h2>
            <p className="mt-3 text-white/85 md:text-lg">
              Notre quiz personnalisé prend en compte votre position de sommeil, gabarit et priorités pour vous orienter vers la bonne technologie.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/quiz" className="inline-flex items-center justify-center rounded-pill bg-ivoire px-6 py-3 font-sora text-sm font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px md:text-base">
                Faire le quiz personnalisé
              </Link>
              <Link href="/matelas" className="inline-flex items-center justify-center rounded-pill border border-white/40 px-6 py-3 font-sora text-sm font-semibold text-white transition-all hover:bg-white/10 md:text-base">
                Voir tous les matelas
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SeoCrossLinks
        links={[
          { href: "/matelas", label: "Tous nos matelas" },
          { href: "/matelas-mal-de-dos", label: "Matelas contre le mal de dos" },
          { href: "/magazine/guide-choisir-matelas", label: "Comment choisir son matelas" },
          { href: "/quiz", label: "Quiz matelas en 6 questions" },
          { href: "/magasins", label: "Essayer en showroom" },
        ]}
      />
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={articleSchema({
          title: H1,
          description: META_DESC,
          url: PATH,
          publishedAt: "2026-01-15",
          author: { name: "L'équipe experts DreamsFly" },
          articleType: "Article",
        })}
      />
      <JsonLd data={faqSchema(FAQ)} />
    </>
  );
}
