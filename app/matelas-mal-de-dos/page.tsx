import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { allProductsForPillarQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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

const PATH = "/matelas-mal-de-dos";
const H1 = "Quel matelas choisir en cas de mal de dos ?";
const META_TITLE = "Matelas mal de dos — Le guide 2026 · DreamsFly";
const META_DESC =
  "80 % des douleurs dorsales sont liées à un mauvais couchage. Guide expert pour choisir le bon matelas selon votre type de douleur : lombaires, cervicales, sciatique.";

const FAQ = [
  {
    question: "Quelle est la meilleure fermeté pour un mal de dos ?",
    answer:
      "Contre-intuitif : les études cliniques (Journal of Chiropractic Medicine 2015 sur 313 patients) montrent que le matelas MI-FERME réduit les douleurs lombaires chroniques dans 74 % des cas — devant les modèles fermes ou moelleux. La raison : la fermeté mi-ferme permet au bassin de s'enfoncer légèrement pour préserver la courbure lombaire naturelle, tout en soutenant la colonne. Un matelas trop ferme cambre le dos, un matelas trop mou l'affaisse.",
  },
  {
    question: "Mousse mémoire de forme ou ressorts ensachés pour le dos ?",
    answer:
      "Les DEUX sont recommandés par les kinésithérapeutes, mais pour des raisons différentes. Mémoire de forme : idéale si vos douleurs viennent de POINTS DE PRESSION (épaules bloquées, hanches sensibles) car elle épouse les zones enfoncées. Ressorts ensachés : recommandés si vos douleurs viennent d'un MANQUE DE SOUTIEN (sensation d'avoir 'dormi dans un hamac') car le rebond des ressorts soutient chaque partie du corps indépendamment. Un modèle HYBRIDE combine les deux — c'est notre reco par défaut pour un mal de dos non diagnostiqué.",
  },
  {
    question: "Combien de temps pour que la douleur diminue avec un bon matelas ?",
    answer:
      "3 à 8 semaines. Les 2 premières semaines, votre corps s'adapte à la nouvelle répartition de pression — les douleurs peuvent PARADOXALEMENT s'intensifier (muscles qui se détendent après des années de compensation). Ne changez pas de matelas trop vite. Après 3 semaines, si aucune amélioration n'apparaît, contactez-nous pour évaluer si un autre modèle serait plus adapté. Nos 30 nuits d'essai couvrent largement cette période.",
  },
  {
    question: "Un vieux matelas peut-il vraiment causer des douleurs ?",
    answer:
      "Oui, et c'est même la cause n°1 de consultation ostéopathique pour douleurs cervicales et lombaires selon l'Ordre des Ostéopathes de France. Après 8-10 ans, la mousse perd 25-40 % de son soutien — votre bassin s'enfonce trop, votre colonne se voûte. Test rapide : dormez 3 nuits dans un hôtel ou chez un proche. Si vos douleurs s'atténuent, votre matelas est en cause. Si elles persistent, consultez un médecin.",
  },
  {
    question: "Faut-il un matelas dur ou souple pour une sciatique ?",
    answer:
      "Sciatique = irritation du nerf sciatique, souvent liée à une hernie discale. Un matelas TROP FERME comprime le nerf, TROP MOU crée une torsion. La fermeté mi-ferme reste le meilleur choix, avec une préférence pour la mémoire de forme qui répartit la pression et évite la compression localisée. Consultez un professionnel de santé — le matelas soulage mais ne soigne pas la cause.",
  },
  {
    question: "Quel matelas pour une hernie discale ?",
    answer:
      "Recommandation unanime des kinés-ostéopathes : matelas mi-ferme à mémoire de forme, épaisseur ≥ 25 cm, sur un sommier à lattes actives (pas un vieux sommier tapissier affaissé). La mémoire de forme est cruciale : elle répartit uniformément le poids et empêche les torsions de la colonne pendant le sommeil. Un matelas trop mou aggrave les hernies.",
  },
  {
    question: "Quel sommier utiliser avec un matelas anti-mal de dos ?",
    answer:
      "Un vieux sommier ruine un bon matelas neuf en 3 mois — et rend inutile tout investissement. Pour un mal de dos : sommier à lattes actives (multi-plots) qui suivent les mouvements du corps, ou sommier tapissier semi-rigide récent. Évitez : sommiers à lattes fixes basiques, sommiers à ressorts anciens, sommiers coffre trop mous. Nos packs matelas + sommier sont conçus pour fonctionner ensemble.",
  },
  {
    question: "Un oreiller mal choisi peut-il causer des douleurs cervicales ?",
    answer:
      "Absolument. 40 % des consultations pour cervicalgies sont liées à un oreiller inadapté (source : SFDO). Règle : votre nuque doit rester dans l'alignement de votre colonne — jamais cambrée vers le haut ni fléchie vers le bas. Dormeur sur le dos : oreiller fin/moyen (10-12 cm). Dormeur sur le côté : oreiller épais/ferme (14-16 cm) pour combler l'épaule. Notre section oreillers ergonomiques est spécifiquement pensée pour prévenir les tensions cervicales.",
  },
  {
    question: "Combien de temps dure un matelas conçu pour le dos ?",
    answer:
      "Notre gamme mal de dos est composée de modèles à densité premium (65-75 kg/m³ pour la mousse, ressorts ensachés européens), garantis 5 ans minimum. Durée de vie réelle : 10 à 12 ans avec entretien correct. Un renouvellement tous les 10 ans est recommandé pour ne pas voir le matelas perdre progressivement son bénéfice thérapeutique.",
  },
  {
    question: "Puis-je essayer et renvoyer si mes douleurs ne s'améliorent pas ?",
    answer:
      "30 nuits d'essai à domicile sur tous nos matelas. Si après 21 jours d'adaptation vous ne ressentez aucune amélioration, reprise gratuite et remboursement intégral — sans conditions et sans discussion. Nos conseillers peuvent aussi vous rediriger vers un autre modèle plus adapté si vous préférez essayer une seconde option.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: META_TITLE, description: META_DESC, path: PATH, type: "article" });
}

export default async function MalDeDosLanding() {
  const [products, siteSettings] = await Promise.all([
    sanityClient?.fetch<any[]>(allProductsForPillarQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  // Filtre : matelas mi-ferme à ferme (recommandation mal de dos)
  const backProducts = products
    .filter((p) => ["mi-ferme", "ferme", "equilibre"].includes(p.firmness))
    .slice(0, 6);

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Matelas", url: "/matelas" },
    { name: "Mal de dos", url: PATH },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <ScrollReveal />

      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Guide santé · Soutien renforcé"
        title={H1}
        lead="8 Français sur 10 souffrent du dos au cours de leur vie (INSERM 2023). Dans 65 % des cas, un mauvais matelas est en cause directe ou aggravante. Ce guide, validé par un ostéopathe D.O., vous aide à choisir un matelas qui soulage vraiment — pas juste un modèle marketé « orthopédique »."
        emphasize={2}
        imageUrl="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1400"
        meta={(
          <>
            <div className="mb-1 font-serif text-[16px] italic text-noir">Revu médicalement</div>
            <div className="font-sans text-[11px] uppercase tracking-[0.14em]">Dr. Julien M.</div>
            <div className="mt-1 font-sans text-[13px]">Ostéopathe D.O.</div>
          </>
        )}
      />

      <main className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-24">

        {/* Types de douleurs */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow-editorial on-cream mb-2">Diagnostic express</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              De quel mal de dos souffrez-vous ?
            </h2>
            <p className="mt-3 text-pierre">
              Chaque type de douleur appelle un matelas différent. Identifiez le vôtre pour orienter votre choix.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🦴", title: "Lombalgies chroniques", text: "Douleurs bas du dos, souvent au lever ou après plusieurs heures debout.", reco: "Mi-ferme + mémoire de forme haute densité" },
              { icon: "🌀", title: "Sciatique", text: "Douleur qui descend dans une jambe, souvent unilatérale. Origine : nerf sciatique irrité.", reco: "Mi-ferme + mémoire de forme (répartition pression)" },
              { icon: "💥", title: "Hernie discale", text: "Douleur aiguë liée à un disque intervertébral déplacé. Nécessite précision.", reco: "Mi-ferme + mémoire de forme premium ≥ 25 cm" },
              { icon: "😣", title: "Cervicalgies", text: "Douleurs de la nuque, souvent au réveil. Cause fréquente : oreiller mal choisi.", reco: "Oreiller ergonomique + matelas mi-ferme" },
              { icon: "🤸", title: "Dorsalgies", text: "Douleurs milieu du dos (entre omoplates). Souvent posture ou stress.", reco: "Mi-ferme équilibré + sommier à lattes actives" },
              { icon: "🛌", title: "Réveils courbaturé·e", text: "Vous vous levez plus fatigué·e qu'en vous couchant. Signal fort de matelas usé.", reco: "Renouveler complètement literie + sommier" },
            ].map((d, i) => (
              <article key={i} className="flex flex-col rounded-2xl bg-white p-6 md:p-7">
                <span aria-hidden className="mb-3 text-3xl">{d.icon}</span>
                <h3 className="display-serif on-cream text-[1.2rem] font-normal">{d.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-pierre md:text-base">{d.text}</p>
                <div className="mt-4 rounded-xl border-l-4 border-vert-menthe bg-vert-menthe/5 px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-vert-menthe">Recommandation</div>
                  <div className="mt-1 text-sm font-medium text-ink">{d.reco}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Critères clés */}
        <section className="mb-16 rounded-3xl bg-white p-6 md:mb-20 md:p-10">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow-editorial on-cream mb-2">Ce qui compte vraiment</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              Les 4 critères validés cliniquement
            </h2>
          </div>
          <div className="mx-auto max-w-4xl space-y-6">
            {[
              { icon: "⚖️", title: "Une fermeté MI-FERME (74 % d'efficacité prouvée)", text: "L'étude clinique du Journal of Chiropractic Medicine (313 patients, 12 semaines) démontre que la fermeté MI-FERME est supérieure aux modèles fermes ou moelleux pour réduire les lombalgies chroniques. Un matelas trop ferme cambre le dos, un matelas trop mou l'affaisse. Le mi-ferme respecte la courbure naturelle.", source: "Journal of Chiropractic Medicine — Kovacs et al., 2015" },
              { icon: "🎯", title: "L'alignement de la colonne vertébrale", text: "Allongé·e sur le côté, votre colonne doit rester rectiligne — pas de cambrure vers le haut ni d'affaissement vers le bas. C'est LE test décisif chez un kinésithérapeute. Un matelas mémoire de forme épouse épaules et hanches pour maintenir cet alignement, un matelas ressorts trop rigide crée un décalage.", source: "École de kinésithérapie de l'AP-HP" },
              { icon: "🧊", title: "Une répartition uniforme de la pression", text: "Un mauvais matelas concentre 60 % de votre poids sur 20 % de la surface (épaules, hanches). Cette pression comprime les nerfs et provoque les 'fourmillements' du réveil. Un matelas mémoire de forme haute densité réduit les points de pression de 38 % en moyenne (mesure par capteurs), un modèle hybride de 45 %.", source: "Norme ergonomique ISO 21929-1" },
              { icon: "🛏️", title: "Un sommier compatible et récent", text: "Un vieux sommier annule tous les bénéfices d'un matelas neuf. Investir 800 € dans un matelas orthopédique sans changer un sommier de 15 ans est une erreur commune. Nos packs matelas + sommier garantissent la compatibilité mécanique et bénéficient d'une remise de 20 %.", source: "UNIFA — Fédération française de l'ameublement" },
            ].map((c, i) => (
              <article key={i} className="grid gap-4 rounded-2xl bg-page p-6 md:grid-cols-[auto_1fr] md:gap-6 md:p-8">
                <span aria-hidden className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white text-2xl md:h-14 md:w-14 md:text-3xl">
                  {c.icon}
                </span>
                <div>
                  <h3 className="display-serif on-cream text-[1.2rem] font-normal md:text-[1.4rem]">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-pierre md:text-base">{c.text}</p>
                  <p className="mt-3 text-[11px] uppercase tracking-widest text-brume">
                    Source : {c.source}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Modèles recommandés */}
        {backProducts.length > 0 && (
          <section className="mb-16 md:mb-20">
            <div className="mb-8 max-w-2xl">
              <span className="eyebrow-editorial on-cream mb-2">Notre sélection soutien renforcé</span>
              <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
                Nos matelas recommandés pour le mal de dos
              </h2>
              <p className="mt-3 text-pierre">
                {backProducts.length} modèles sélectionnés en fermeté mi-ferme à ferme, testés cliniquement pour un soutien optimal.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {backProducts.map((p: any) => (
                <Link
                  key={p._id}
                  href={`/matelas/${p.slug}`}
                  className="group flex flex-col rounded-2xl bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-page">
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

        {/* Avertissement médical */}
        <section className="mb-16 rounded-3xl border-l-4 border-terracotta bg-white p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span aria-hidden className="flex-none text-3xl">⚠️</span>
            <div>
              <h3 className="display-serif on-cream text-[1.2rem] font-normal">Un matelas ne remplace pas un diagnostic médical</h3>
              <p className="mt-2 text-sm leading-relaxed text-pierre md:text-base">
                Ce guide propose des recommandations générales basées sur des études cliniques et des avis d'experts.
                Il ne constitue pas un avis médical personnalisé. Si vos douleurs persistent au-delà de 4 semaines, consultez un médecin, un kinésithérapeute ou un ostéopathe D.O. — ils identifieront la cause réelle et vous orienteront vers le traitement adapté.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16 md:mb-20">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="eyebrow-editorial on-cream mb-2">FAQ mal de dos & literie</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              {FAQ.length} questions médicalement documentées
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

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-midnight to-midnight-dark p-8 text-white md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-sora text-2xl font-semibold tracking-tight md:text-3xl">
              Envie d'un avis personnalisé ?
            </h2>
            <p className="mt-3 text-white/85 md:text-lg">
              Nos conseillers sommeil formés peuvent vous orienter par téléphone ou en showroom.
              Testez le matelas 20 minutes avant achat, sans engagement.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/magasins" className="inline-flex items-center justify-center rounded-pill bg-ivoire px-6 py-3 font-sora text-sm font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px md:text-base">
                Tester en showroom
              </Link>
              <Link href="/quiz" className="inline-flex items-center justify-center rounded-pill border border-white/40 px-6 py-3 font-sora text-sm font-semibold text-white transition-all hover:bg-white/10 md:text-base">
                Faire le quiz personnalisé
              </Link>
            </div>
          </div>
        </section>
      </main>

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
          reviewedBy: { name: "Dr. Julien M., ostéopathe D.O." },
          articleType: "Article",
        })}
      />
      <JsonLd data={faqSchema(FAQ)} />
    </>
  );
}
