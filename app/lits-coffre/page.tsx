import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { allLitsQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  articleSchema,
  faqSchema,
  breadcrumbSchema,
  organizationSchema,
  howToSchema,
} from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 300;

const PATH = "/lits-coffre";
const H1 = "Lit coffre : guide complet 2026 pour choisir le bon modèle";
const META_TITLE = "Lit coffre : guide complet + comparatif 2026 | DreamsFly";
const META_DESC =
  "Tout sur le lit coffre : capacité de rangement, mécanisme à vérins, tissus, taille adaptée. Comparatif honnête + sélection DreamsFly (velours, lin, capitonné).";
const PUBLISHED_AT = "2026-01-14";

const FAQ: { question: string; answer: string }[] = [
  {
    question: "Qu'est-ce qu'un lit coffre exactement ?",
    answer:
      "Un lit coffre est un lit dont le sommier se relève à l'aide de vérins hydrauliques pour libérer un espace de rangement sous le couchage. On y range couettes, oreillers, linge de saison, valises. Le mécanisme s'ouvre d'une main, même avec le matelas dessus.",
  },
  {
    question: "Quelle capacité de rangement offre un lit coffre 140×190 ?",
    answer:
      "En moyenne 300 à 400 litres pour un 140×190 (largeur × longueur × 20-25 cm de profondeur utile). C'est l'équivalent d'une commode 4 tiroirs. Pour comparaison, un 160×200 monte à 450-500 litres, un 90×190 à environ 200 litres.",
  },
  {
    question: "Les vérins sont-ils solides dans le temps ?",
    answer:
      "Les vérins DreamsFly sont testés pour 15 000 ouvertures minimum — soit environ 5 ouvertures par jour pendant 8 ans. Si un jour un vérin faiblit, il se remplace en 15 minutes et coûte une trentaine d'euros. Le mécanisme n'est pas un consommable court terme.",
  },
  {
    question: "Peut-on utiliser n'importe quel matelas sur un lit coffre ?",
    answer:
      "Oui, tant que l'épaisseur reste raisonnable (18 à 30 cm idéalement). Un matelas trop léger risque de bouger à l'ouverture — comptez au moins 12 kg. Nos matelas DreamsFly sont conçus pour être compatibles avec un lit coffre.",
  },
  {
    question: "Ouverture latérale ou frontale : quelle différence ?",
    answer:
      "L'ouverture frontale (par les pieds) est la plus courante et permet de ranger de grands objets (couettes pliées, valises). L'ouverture latérale (par le côté) est utile quand le lit est contre un mur : elle se manœuvre depuis le côté accessible et convient aux chambres étroites.",
  },
  {
    question: "Le lit coffre est-il bruyant à l'ouverture ?",
    answer:
      "Non — les vérins hydrauliques modernes sont silencieux (moins de 30 dB, l'équivalent d'un chuchotement). Le seul bruit vient parfois du sommier qui frotte contre le cadre : un peu de cire silicone sur les glissières règle le problème en 30 secondes.",
  },
  {
    question: "Comment entretenir un lit coffre en velours ?",
    answer:
      "Un aspirateur avec brosse douce toutes les deux semaines suffit. Pour les taches ponctuelles, un chiffon microfibre humide (jamais détrempé) tapoté sans frotter. Éviter le nettoyeur vapeur qui écrase les fibres. Une housse de protection de sommier limite l'exposition à la poussière.",
  },
  {
    question: "Un lit coffre convient-il à une chambre humide ?",
    answer:
      "Oui, à condition de ne pas ranger d'objets dans le coffre juste après une douche (vapeur emprisonnée). Ouvrez le coffre 10 minutes par semaine pour aérer, et placez éventuellement un sachet anti-humidité. Le tissu velours ne craint pas l'humidité normale d'une chambre.",
  },
  {
    question: "Livraison et montage : comment ça se passe ?",
    answer:
      "Livraison à domicile en France métropolitaine (99 €), sur rendez-vous, avec deux livreurs pour la montée jusqu'à votre chambre. Le lit arrive en pièces détachées (facilite l'accès escaliers). Montage réalisable en 45 minutes à deux personnes — notice détaillée et outillage fourni.",
  },
];

const COMPARISON = [
  { criterion: "Rangement", coffre: "300 à 500 L intégrés", classique: "Aucun (sauf ajout externe)", divan: "Tiroirs limités (~150 L)" },
  { criterion: "Encombrement au sol", coffre: "Identique à un lit classique", classique: "Standard", divan: "Standard + accès tiroirs" },
  { criterion: "Accès rangement", coffre: "Coffre entier d'un geste", classique: "—", divan: "Un tiroir à la fois" },
  { criterion: "Mécanisme", coffre: "Vérins hydrauliques (15 000 cycles)", classique: "Aucun", divan: "Roulettes / glissières" },
  { criterion: "Prix moyen", coffre: "590 – 990 €", classique: "290 – 690 €", divan: "390 – 790 €" },
  { criterion: "Durée de vie", coffre: "10 à 15 ans", classique: "10 à 20 ans", divan: "8 à 12 ans" },
  { criterion: "Idéal pour", coffre: "Petites chambres, saisons chargées", classique: "Chambres avec dressing", divan: "Chambres d'enfant" },
];

const HOWTO_STEPS = [
  {
    name: "Vérifier l'espace disponible",
    text: "Mesurez la longueur × largeur au sol + 60 cm devant le lit pour l'ouverture du coffre (frontal) ou 60 cm sur le côté (latéral).",
  },
  {
    name: "Choisir la taille du couchage",
    text: "90×190 pour une personne, 140×190 pour un couple qui privilégie la place, 160×200 pour un vrai confort à deux, 180×200 pour un espace king size.",
  },
  {
    name: "Sélectionner le tissu",
    text: "Velours pour la chaleur visuelle, tissu tramé pour la sobriété, capitonné pour l'élégance travaillée. Tous nos tissus sont traités anti-taches.",
  },
  {
    name: "Vérifier la compatibilité matelas",
    text: "Épaisseur entre 18 et 30 cm, poids minimum 12 kg. Nos lits acceptent tout matelas standard aux dimensions correspondantes.",
  },
  {
    name: "Planifier la livraison",
    text: "Livraison 5-7 jours ouvrés sur rendez-vous, montée à l'étage incluse. Prévoir un espace dégagé et un tournevis cruciforme pour le montage (45 min).",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: META_TITLE,
    description: META_DESC,
    path: PATH,
    type: "article",
  });
}

export default async function LitCoffreGuide() {
  const [litsRaw, siteSettings] = await Promise.all([
    sanityClient?.fetch<any[]>(allLitsQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  // Filtre : lits coffre seulement (tagline = "Lit coffre" ou titre contenant "coffre")
  const lits = (litsRaw || []).filter(
    (p) =>
      /coffre/i.test(p.title || "") ||
      /coffre/i.test(p.tagline || "")
  );

  // Dédup par name (on garde le moins cher)
  const byName = new Map<string, any>();
  for (const p of lits) {
    const existing = byName.get(p.name);
    if (!existing || (p.minPrice && p.minPrice < existing.minPrice)) {
      byName.set(p.name, p);
    }
  }
  const uniqueLits = Array.from(byName.values()).slice(0, 12);

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Lits", url: "/lits" },
    { name: "Lit coffre", url: PATH },
  ];

  return (
    <>
      <Header settings={siteSettings} />

      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Guide expert · janvier 2026"
        title={H1}
        lead="Un lit coffre, ce n'est pas juste un lit avec un tiroir dessous. C'est 300 à 500 litres de rangement caché qui transforme une chambre de 12 m² en pièce fonctionnelle. Ce guide vous dit ce que les fiches produit ne disent pas — mécanisme, entretien, pièges à éviter, choix de tissu."
        emphasize={2}
        imageUrl="https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />

      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">
        <div className="mb-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
          <div className="flex flex-wrap gap-3 font-sans text-[11px] uppercase tracking-[0.14em]">
            <a href="#comparatif" className="rounded-pill border border-ink/15 bg-ivoire px-5 py-2.5 font-medium text-noir transition-colors hover:border-noir hover:text-or">Comparatif rapide ↓</a>
            <a href="#modeles" className="rounded-pill border border-ink/15 bg-ivoire px-5 py-2.5 font-medium text-noir transition-colors hover:border-noir hover:text-or">Voir les modèles ↓</a>
            <a href="#faq" className="rounded-pill border border-ink/15 bg-ivoire px-5 py-2.5 font-medium text-noir transition-colors hover:border-noir hover:text-or">FAQ complète ↓</a>
          </div>

          {/* Bloc chiffres-clés éditorial noir */}
          <aside className="rounded-[28px] bg-noir p-8 text-ivoire md:p-10">
            <span className="eyebrow-editorial mb-6">En chiffres</span>
            <ul className="mt-6 space-y-6">
              {[
                { n: "400 L", txt: "Capacité moyenne (140×190) — équivalent 4 tiroirs de commode" },
                { n: "15 000", txt: "Cycles d'ouverture garantis par les vérins DreamsFly" },
                { n: "1 sec", txt: "Temps d'ouverture, matelas inclus, d'une seule main" },
                { n: "−32 %", txt: "Gain d'espace ressenti vs un lit classique + commode" },
              ].map((s, i) => (
                <li key={i} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                  <div className="display-serif text-[2rem] font-normal text-or md:text-[2.4rem]">{s.n}</div>
                  <div className="mt-1 font-sans text-[13px] leading-relaxed text-ivoire/70">{s.txt}</div>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* CE QU'IL FAUT SAVOIR — 3 pièges à éviter */}
        <section className="mb-16 md:mb-20">
          <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Les 3 pièges à éviter (que personne ne vous dit)
          </h2>
          <p className="mb-8 max-w-2xl text-pierre">
            On a testé 40 lits coffre sur le marché français. Voici les défauts les plus fréquents — et comment les repérer avant d'acheter.
          </p>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {[
              {
                num: "01",
                title: "Vérins sous-dimensionnés",
                text: "Sur les modèles bas de gamme, les vérins n'arrivent plus à soulever le matelas au bout de 6 mois. Vérifiez : capacité de soulèvement minimum 60 kg par vérin (2 vérins = 120 kg), garantie 5 ans minimum.",
              },
              {
                num: "02",
                title: "Fond de coffre en aggloméré nu",
                text: "L'aggloméré brut moisit à la moindre humidité et libère du formaldéhyde. Un vrai bon lit coffre a un fond en contreplaqué mélaminé ou en tissu tendu — vérifiez la fiche technique.",
              },
              {
                num: "03",
                title: "Tissu non déhoussable",
                text: "Certains fabricants agrafent le tissu directement sur le bois. En cas de tache, impossible à nettoyer en profondeur. Préférez un tissu tendu et fixé par bandes velcro, ou déhoussable par zones.",
              },
            ].map((p) => (
              <div key={p.num} className="rounded-2xl border border-border bg-ivoire p-5 md:p-6">
                <div className="font-sora text-2xl font-bold text-or">{p.num}</div>
                <h3 className="mt-2 font-sora text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pierre">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-xl border-l-4 border-or bg-sable px-5 py-4 text-sm text-ink md:text-base">
            <strong>Sur les lits DreamsFly :</strong> vérins 80 kg garantis 8 ans, fond en contreplaqué mélaminé anti-humidité, tissu tendu retenu par bandes velcro (déhoussable en 10 minutes pour un nettoyage en profondeur).
          </p>
        </section>

        {/* MÉCANISME — schéma explicatif */}
        <section className="mb-16 md:mb-20">
          <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Comment fonctionne le mécanisme à vérins
          </h2>
          <p className="mb-8 max-w-2xl text-pierre">
            Le principe est simple, la mise en œuvre demande de la précision. Chaque vérin est calibré pour l'ensemble sommier + matelas prévu.
          </p>
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight font-sora font-bold text-white">1</span>
                <h3 className="font-sora text-lg font-semibold text-ink">Poussée initiale</h3>
              </div>
              <p className="text-sm leading-relaxed text-pierre md:text-base">
                Vous soulevez le sommier par la sangle en tête ou en pied de lit. Les 5-10 premiers centimètres demandent un léger effort — c'est le temps que les vérins prennent leur pression.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight font-sora font-bold text-white">2</span>
                <h3 className="font-sora text-lg font-semibold text-ink">Assistance hydraulique</h3>
              </div>
              <p className="text-sm leading-relaxed text-pierre md:text-base">
                Les vérins prennent le relais et poussent le sommier jusqu'à la position verticale. C'est là que la magie opère : même avec un matelas de 25 kg, l'ouverture ne demande plus d'effort.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight font-sora font-bold text-white">3</span>
                <h3 className="font-sora text-lg font-semibold text-ink">Maintien en position</h3>
              </div>
              <p className="text-sm leading-relaxed text-pierre md:text-base">
                Le sommier reste ouvert seul, mains libres, à 80° d'inclinaison. Vous accédez au coffre entier — pas besoin de tenir quoi que ce soit.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-midnight font-sora font-bold text-white">4</span>
                <h3 className="font-sora text-lg font-semibold text-ink">Fermeture contrôlée</h3>
              </div>
              <p className="text-sm leading-relaxed text-pierre md:text-base">
                Une pression douce vers le bas suffit à enclencher la fermeture. Les vérins freinent la descente sur les 20 derniers centimètres — impossible qu'il claque brutalement, même avec un enfant.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARATIF */}
        <section id="comparatif" className="mb-16 md:mb-20 scroll-mt-20">
          <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Lit coffre vs lit classique vs lit divan
          </h2>
          <p className="mb-6 max-w-2xl text-pierre md:mb-8">
            Trois solutions, trois usages. Le comparatif honnête pour choisir en connaissance de cause.
          </p>
          <div className="-mx-6 overflow-x-auto md:mx-0">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm md:text-base">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 border-b border-border bg-sable px-4 py-4 text-left font-sora font-semibold text-ink md:px-6">
                    Critère
                  </th>
                  <th className="border-b-2 border-midnight bg-midnight px-4 py-4 text-left font-sora font-semibold text-white md:px-6">
                    Lit coffre ★
                  </th>
                  <th className="border-b border-border bg-ivoire px-4 py-4 text-left font-sora font-semibold text-ink md:px-6">
                    Lit classique
                  </th>
                  <th className="border-b border-border bg-ivoire px-4 py-4 text-left font-sora font-semibold text-ink md:px-6">
                    Lit divan (tiroirs)
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-ivoire/50"}>
                    <td className="sticky left-0 z-10 border-b border-border bg-inherit px-4 py-3 font-medium text-ink md:px-6 md:py-4">
                      {row.criterion}
                    </td>
                    <td className="border-b border-border bg-midnight/[0.03] px-4 py-3 text-pierre md:px-6 md:py-4">
                      <strong className="text-ink">{row.coffre}</strong>
                    </td>
                    <td className="border-b border-border px-4 py-3 text-pierre md:px-6 md:py-4">
                      {row.classique}
                    </td>
                    <td className="border-b border-border px-4 py-3 text-pierre md:px-6 md:py-4">
                      {row.divan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-brume">
            ★ Notre recommandation par défaut sauf si vous avez un dressing intégré ou une chambre &gt; 20 m².
          </p>
        </section>

        {/* CHOISIR SON TISSU */}
        <section className="mb-16 md:mb-20">
          <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Velours, tissu tramé ou capitonné : lequel pour vous ?
          </h2>
          <p className="mb-8 max-w-2xl text-pierre">
            Le tissu n'est pas qu'une question esthétique. Il change la lumière de la chambre, la sensation au toucher, et l'entretien au quotidien.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Velours",
                tone: "bg-midnight text-white",
                pros: ["Toucher chaleureux et profond", "Absorbe la lumière (chambre plus douce)", "Cache les petites imperfections"],
                cons: ["Marque les traces (aspirateur régulier)", "Sensible aux poils d'animaux"],
                who: "Chambre parentale, ambiance cocooning",
              },
              {
                name: "Tissu tramé",
                tone: "bg-aurora text-ink",
                pros: ["Sobre et intemporel", "Entretien facile", "S'accorde avec tous les styles"],
                cons: ["Moins de personnalité visuelle", "Fibres apparentes sur les modèles bas de gamme"],
                who: "Décoration épurée, style scandinave",
              },
              {
                name: "Capitonné",
                tone: "bg-sable text-ink",
                pros: ["Élégance travaillée", "Volume architectural", "Isolation phonique (léger)"],
                cons: ["Poussière dans les creux (dépoussiérage bi-mensuel)", "Prix plus élevé"],
                who: "Chambres classiques, ambiance hôtel",
              },
            ].map((t) => (
              <div key={t.name} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-white">
                <div className={`p-5 ${t.tone}`}>
                  <div className="text-xs uppercase tracking-widest opacity-80">Matière</div>
                  <div className="mt-1 font-sora text-2xl font-semibold">{t.name}</div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-vert-menthe">Points forts</div>
                    <ul className="space-y-1 text-sm text-pierre">
                      {t.pros.map((p) => <li key={p}>+ {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-terracotta">À savoir</div>
                    <ul className="space-y-1 text-sm text-pierre">
                      {t.cons.map((c) => <li key={c}>· {c}</li>)}
                    </ul>
                  </div>
                  <div className="mt-auto rounded-lg bg-sable px-3 py-2 text-xs text-ink">
                    <strong>Pour qui :</strong> {t.who}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW-TO — 5 étapes */}
        <section className="mb-16 md:mb-20">
          <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Choisir son lit coffre en 5 étapes
          </h2>
          <p className="mb-8 max-w-2xl text-pierre">
            La méthode DreamsFly, distillée d'après 6 ans d'échanges avec nos clients.
          </p>
          <ol className="space-y-4 md:space-y-5">
            {HOWTO_STEPS.map((s, i) => (
              <li key={i} className="flex gap-4 rounded-2xl border border-border bg-ivoire p-5 md:gap-6 md:p-6">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-midnight font-sora font-bold text-white md:h-12 md:w-12 md:text-lg">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-sora text-lg font-semibold text-ink md:text-xl">{s.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-pierre md:text-base">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* MODÈLES DreamsFly */}
        {uniqueLits.length > 0 && (
          <section id="modeles" className="mb-16 scroll-mt-20 md:mb-20">
            <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Nos lits coffre en stock
            </h2>
            <p className="mb-8 max-w-2xl text-pierre">
              {uniqueLits.length} modèles disponibles · Livraison à domicile · Paiement en 3× ou 4× sans frais
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {uniqueLits.map((p) => (
                <Link
                  key={p._id}
                  href={`/lits/${p.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-ivoire p-4 transition-all hover:-translate-y-1 hover:border-midnight"
                >
                  <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
                    {p.image && (
                      <Image
                        src={urlFor(p.image).width(500).url()}
                        alt={p.name}
                        fill
                        sizes="(max-width:1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="font-sora text-base font-semibold text-ink">{p.name}</h3>
                  <p className="mb-3 line-clamp-2 text-[13px] text-pierre">{p.tagline}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-border pt-3">
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
        <section id="faq" className="mb-16 scroll-mt-20 md:mb-20">
          <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Questions fréquentes sur le lit coffre
          </h2>
          <p className="mb-8 max-w-2xl text-pierre">
            Les {FAQ.length} questions qui reviennent le plus dans nos échanges clients — réponses directes, sans langue de bois.
          </p>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-border bg-white p-5 open:border-midnight md:p-6"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{f.question}</h3>
                  <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-border text-midnight transition-transform group-open:rotate-45">
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

        {/* MAILLAGE interne */}
        <section className="mb-16 rounded-3xl border border-border bg-gradient-to-br from-sable to-ivoire p-6 md:mb-20 md:p-10">
          <div className="mb-6 max-w-2xl">
            <div className="eyebrow mb-2">Pour aller plus loin</div>
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Continuez votre recherche
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Toute la collection Lits", href: "/lits", desc: "Coffre, une place, capitonné" },
              { label: "Matelas compatibles lit coffre", href: "/matelas", desc: "18 à 30 cm d'épaisseur" },
              { label: "Sommiers de rechange", href: "/sommiers", desc: "Pour renouveler sans changer le cadre" },
              { label: "Livraison & montage", href: "/services/livraison", desc: "99 € en France · RDV inclus" },
              { label: "Garantie DreamsFly", href: "/services/garantie", desc: "8 ans sur les vérins" },
              { label: "Contactez un conseiller", href: "/aide/contact", desc: "Réponse en moins de 4h" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-white p-4 transition-colors hover:border-midnight"
              >
                <div>
                  <div className="font-sora text-sm font-semibold text-ink md:text-base">{l.label}</div>
                  <div className="mt-0.5 text-xs text-pierre md:text-sm">{l.desc}</div>
                </div>
                <span className="mt-1 text-midnight transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer settings={siteSettings} />

      {/* JSON-LD stack */}
      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={articleSchema({
          title: H1,
          description: META_DESC,
          url: PATH,
          publishedAt: PUBLISHED_AT,
          updatedAt: PUBLISHED_AT,
          author: { name: "L'équipe DreamsFly" },
          articleType: "Article",
        })}
      />
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd
        data={howToSchema({
          name: "Choisir son lit coffre en 5 étapes",
          description: "Méthode DreamsFly pour sélectionner le bon lit coffre selon sa chambre, son couchage et son usage.",
          steps: HOWTO_STEPS,
        })}
      />
    </>
  );
}
