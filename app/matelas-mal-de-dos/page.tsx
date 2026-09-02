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

const PATH = "/matelas-mal-de-dos";
const H1 = "Quel matelas choisir en cas de mal de dos ?";
const META_TITLE = "Matelas mal de dos — Le guide 2026 · DreamsFly";
const META_DESC =
  "Fermeté, soutien, alignement, répartition de la pression : les critères de confort à regarder pour choisir un matelas quand on a le dos sensible.";

/**
 * Mention obligatoire sur cette page.
 *
 * Le contenu porte sur le confort et le soutien d'un couchage, jamais sur
 * le traitement d'une pathologie. Cette phrase le dit explicitement au
 * lecteur, et rappelle vers qui se tourner quand la douleur persiste.
 */
const AVERTISSEMENT_SANTE =
  "Ces informations sont données à titre indicatif et ne constituent pas un avis médical. En cas de douleurs persistantes ou importantes, consultez un professionnel de santé.";

const FAQ = [
  {
    question: "Quelle fermeté choisir quand on a le dos sensible ?",
    answer:
      "Une fermeté intermédiaire convient à la plupart des dormeurs. Un matelas très ferme laisse peu le bassin s'enfoncer et peut créer une sensation de cambrure ; un matelas très souple donne au contraire l'impression de s'affaisser. Entre les deux, le corps repose à plat sans point dur. Cela reste une question de ressenti personnel : morphologie, poids et position de sommeil changent la perception d'une même fermeté, d'où l'intérêt de l'essayer.",
  },
  {
    question: "Mousse mémoire de forme ou ressorts ensachés ?",
    answer:
      "Les deux répondent à des sensations différentes. La mémoire de forme épouse les zones saillantes — épaules, hanches — et répartit la pression sur une plus grande surface : on la choisit quand on ressent des points d'appui marqués. Les ressorts ensachés offrent un soutien plus tonique et une meilleure aération : on les choisit quand on a la sensation de s'enfoncer. Un modèle hybride combine les deux, ce qui en fait un point de départ raisonnable quand on hésite.",
  },
  {
    question: "Faut-il du temps pour s'habituer à un nouveau matelas ?",
    answer:
      "Oui. Le temps d'adaptation à une nouvelle literie est généralement de quelques semaines : le corps était habitué à un couchage différent et doit retrouver ses appuis. Ne jugez pas un matelas sur deux ou trois nuits. Si, passé ce délai, le confort ne vous convient toujours pas, contactez-nous pour évaluer si un autre modèle serait mieux adapté.",
  },
  {
    question: "Un matelas usé change-t-il le confort de couchage ?",
    answer:
      "Nettement. Avec les années, les mousses se tassent et les ressorts perdent de leur tonicité : le soutien devient irrégulier, le bassin s'enfonce davantage au centre. Test simple : passez quelques nuits sur un autre couchage, à l'hôtel ou chez un proche. Si votre confort change, votre literie y est probablement pour quelque chose. Si vos douleurs persistent quel que soit le couchage, consultez un professionnel de santé.",
  },
  {
    question: "Comment être sûr qu'un matelas me convient ?",
    answer:
      "En l'essayant allongé, dans votre position de sommeil habituelle, pendant dix à quinze minutes. Le repère le plus simple est l'alignement : sur le côté, la colonne doit rester à peu près rectiligne, sans creux marqué ni bosse. C'est un test de confort, pas un examen : un professionnel de santé reste le seul interlocuteur pour une douleur qui dure.",
  },
  {
    question: "Quel sommier associer à ce type de matelas ?",
    answer:
      "Le sommier détermine une bonne partie du soutien ressenti : un modèle affaissé annule le confort d'un matelas neuf. Privilégiez un sommier à lattes actives (multi-plots), qui suit les mouvements du corps, ou un tapissier semi-rigide récent. Évitez les lattes fixes basiques, les sommiers à ressorts anciens et les coffres trop souples. Nos ensembles matelas + sommier sont assortis pour fonctionner ensemble.",
  },
  {
    question: "L'oreiller compte-t-il aussi ?",
    answer:
      "L'oreiller joue autant que le matelas sur le confort de la nuque. Le repère est le même : la tête doit rester dans le prolongement de la colonne, sans être poussée vers le haut ni fléchie vers le bas. Dormeur sur le dos : un oreiller plutôt fin, autour de 10 à 12 cm. Dormeur sur le côté : un oreiller plus épais, 14 à 16 cm, pour combler l'espace laissé par l'épaule. Là encore, l'épaisseur idéale dépend de votre morphologie.",
  },
  {
    question: "Combien de temps dure un matelas de cette gamme ?",
    answer:
      "Nos modèles à soutien renforcé utilisent des mousses de 65 à 75 kg/m³ et des ressorts ensachés européens, garantis 2 ans. Comptez une dizaine d'années d'usage avec un entretien correct — rotation régulière, aération, protège-matelas. Au-delà, le soutien se dégrade progressivement et le confort d'origine n'est plus au rendez-vous.",
  },
  {
    question: "Puis-je essayer un matelas avant de l'acheter ?",
    answer:
      "Oui, en showroom. C'est même la méthode que nous recommandons pour une problématique de dos : allongez-vous 10 à 15 minutes sur plusieurs fermetés, dans votre position de sommeil habituelle, et laissez un conseiller observer l'alignement de votre colonne. Pour une commande en ligne, vous disposez du droit de rétractation légal de 14 jours (article L221-18 du Code de la consommation), le produit devant être retourné complet et dans son emballage d'origine.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: META_TITLE, description: META_DESC, path: PATH, type: "article" });
}

export default async function MalDeDosLanding() {
  const [products, siteSettings, heros] = await Promise.all([
    sanityClient?.fetch<any[]>(allProductsForPillarQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
    fetchPageHeros(),
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

      {/*
        Le bloc `meta` annonçait « Revu médicalement — Dr. Julien M.,
        Ostéopathe D.O. ». Aucun professionnel de santé ne relit cette page :
        c'était une caution médicale inventée, affichée sur une page qui
        conseille l'achat d'un produit. Remplacée par ce que DreamsFly
        propose réellement — l'essai en showroom.
      */}
      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Confort & soutien renforcé"
        title={H1}
        lead="Fermeté ressentie, soutien, alignement, répartition de la pression : voici les critères de confort à regarder quand on a le dos sensible, et comment les vérifier soi-même avant d'acheter."
        emphasize={2}
        imageUrl={pickHeroImageUrl(heros.malDeDos, "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1400")}
        meta={(
          <>
            <div className="mb-1 font-serif text-[16px] italic text-noir">Essayez avant d'acheter</div>
            <div className="font-sans text-[11px] uppercase tracking-[0.14em]">3 showrooms</div>
            <div className="mt-1 font-sans text-[13px]">Conseil sans rendez-vous</div>
          </>
        )}
      />

      <main className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-24">

        {/*
          Mention visible sans défiler. La section d'avertissement détaillée
          plus bas reste en place ; celle-ci existe pour que le lecteur sache
          dès la première ligne qu'il lit des conseils de confort, pas un
          contenu de santé.
        */}
        <p className="mb-10 border-l-2 border-brume pl-4 text-[13px] leading-relaxed text-pierre md:mb-14 md:text-sm">
          {AVERTISSEMENT_SANTE}
        </p>

        {/* Types de douleurs */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow-editorial on-cream mb-2">Repères de confort</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              Qu'est-ce qui vous gêne au réveil ?
            </h2>
            <p className="mt-3 text-pierre">
              Ces sensations sont celles que nos clients décrivent le plus souvent en showroom. Elles n'établissent
              aucun diagnostic — elles aident simplement à orienter l'essai vers le bon type de couchage.
            </p>
          </div>
          {/*
            Ces six cartes nommaient des pathologies — sciatique, hernie
            discale, cervicalgies — et faisaient suivre chacune d'une
            « Recommandation » de matelas. Associer un produit à une maladie
            nommée est une allégation de santé. Le contenu décrit désormais
            des SENSATIONS de couchage, et propose une piste de confort.
          */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🦴", title: "Tensions dans le bas du dos", text: "Le bas du dos tire au lever ou après une longue journée debout.", reco: "Fermeté intermédiaire, soutien ferme au niveau du bassin" },
              { icon: "🌀", title: "Points d'appui marqués", text: "Vous sentez vos hanches ou vos épaules porter tout le poids du corps.", reco: "Mémoire de forme, pour répartir la pression" },
              { icon: "💥", title: "Sensation de s'enfoncer", text: "Le milieu du matelas cède, vous avez l'impression de dormir en creux.", reco: "Soutien plus tonique, ressorts ensachés" },
              { icon: "😣", title: "Nuque raide au réveil", text: "La gêne se situe dans le cou plutôt que dans le dos.", reco: "Oreiller à la bonne épaisseur avant tout" },
              { icon: "🤸", title: "Gêne entre les omoplates", text: "Le milieu du dos reste tendu, souvent lié à la posture de la journée.", reco: "Fermeté équilibrée, sommier à lattes actives" },
              { icon: "🛌", title: "Réveils fatigué·e", text: "Vous vous levez plus fatigué·e qu'en vous couchant, sans douleur précise.", reco: "Vérifier l'âge de l'ensemble matelas + sommier" },
            ].map((d, i) => (
              <article key={i} className="flex flex-col rounded-2xl bg-white p-6 md:p-7">
                <span aria-hidden className="mb-3 text-3xl">{d.icon}</span>
                <h3 className="display-serif on-cream text-[1.2rem] font-normal">{d.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-pierre md:text-base">{d.text}</p>
                <div className="mt-4 rounded-xl border-l-4 border-vert-menthe bg-vert-menthe/5 px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-vert-menthe">Piste de confort</div>
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
              Les 4 critères à vérifier
            </h2>
          </div>
          {/*
            Chaque carte portait une ligne « Source : … ». Deux de ces
            références étaient inexploitables — ISO 21929-1 porte sur la
            durabilité des bâtiments, et « École de kinésithérapie de
            l'AP-HP » ne désigne aucun émetteur identifiable — et les
            chiffres qu'elles étayaient (38 %, 45 %, 74 %) n'étaient
            vérifiables nulle part.

            Le champ `source` a été retiré plutôt que remplacé : substituer
            une référence approximative à une référence fausse ne corrige
            rien, cela déplace le problème.
          */}
          <div className="mx-auto max-w-4xl space-y-6">
            {[
              { icon: "⚖️", title: "Une fermeté ni trop ferme, ni trop souple", text: "Un matelas très ferme laisse peu le bassin s'enfoncer et peut donner une sensation de cambrure. Un matelas très souple fait au contraire creuser le milieu du corps. Une fermeté intermédiaire convient à la majorité des dormeurs, mais le ressenti dépend de votre morphologie et de votre poids : c'est le premier critère à tester allongé." },
              { icon: "🎯", title: "L'alignement du corps", text: "Allongé·e sur le côté, la colonne doit rester à peu près rectiligne — sans creux marqué au niveau de la taille ni bosse au niveau des hanches. C'est le repère le plus simple à observer soi-même, ou à faire vérifier par la personne qui vous accompagne en showroom." },
              { icon: "🧊", title: "La répartition de la pression", text: "Sur un couchage trop rigide, le poids se concentre sur les zones saillantes — épaules et hanches — et l'on ressent des points d'appui. Un accueil en mémoire de forme épouse ces zones et étale l'appui sur une plus grande surface. Un modèle à ressorts ensachés privilégie un soutien plus tonique et une meilleure aération." },
              { icon: "🛏️", title: "Un sommier compatible et récent", text: "Le sommier porte une bonne partie du soutien ressenti : un modèle affaissé annule le confort d'un matelas neuf. Nos ensembles matelas + sommier sont assortis pour fonctionner ensemble et bénéficient d'une remise de 20 %." },
            ].map((c, i) => (
              <article key={i} className="grid gap-4 rounded-2xl bg-page p-6 md:grid-cols-[auto_1fr] md:gap-6 md:p-8">
                <span aria-hidden className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white text-2xl md:h-14 md:w-14 md:text-3xl">
                  {c.icon}
                </span>
                <div>
                  <h3 className="display-serif on-cream text-[1.2rem] font-normal md:text-[1.4rem]">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-pierre md:text-base">{c.text}</p>
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
                {backProducts.length} modèles retenus pour leur fermeté intermédiaire à ferme et leur soutien tonique.
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
              <h3 className="display-serif on-cream text-[1.2rem] font-normal">Un matelas ne remplace pas un avis médical</h3>
              <p className="mt-2 text-sm leading-relaxed text-pierre md:text-base">
                {AVERTISSEMENT_SANTE} Nous parlons ici de confort et de soutien de couchage : un médecin,
                un kinésithérapeute ou un ostéopathe est le seul à pouvoir identifier l'origine d'une douleur.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16 md:mb-20">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <span className="eyebrow-editorial on-cream mb-2">FAQ mal de dos & literie</span>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[3rem]">
              {FAQ.length} questions fréquentes en showroom
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

      <SeoCrossLinks
        links={[
          { href: "/matelas", label: "Tous nos matelas" },
          { href: "/matelas-memoire-de-forme", label: "Guide mémoire de forme" },
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
          author: { name: "L'équipe DreamsFly" },
          // `reviewedBy` déclarait « Dr. Julien M., ostéopathe D.O. » à
          // Google. Personne ne relit médicalement cette page : la propriété
          // est retirée tant qu'aucun professionnel de santé n'est réellement
          // engagé. Déclarer une relecture inexistante dans des données
          // structurées est un signal falsifié, pas une approximation.
          articleType: "Article",
        })}
      />
      <JsonLd data={faqSchema(FAQ)} />
    </>
  );
}
