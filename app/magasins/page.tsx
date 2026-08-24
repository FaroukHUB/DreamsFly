import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { allShowroomsQuery, showroomsPageQuery } from "@/lib/sanity/extra-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema, faqSchema } from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 600;

type ShowroomsPageData = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  argumentsTitle?: string;
  argumentsItems?: { icon?: string; title?: string; text?: string }[];
  faqTitle?: string;
  faqItems?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
} | null;

const DEFAULTS = {
  heroEyebrow: "Venez nous voir",
  heroTitle: "Trois showrooms pour tester nos matelas.",
  heroSubtitle:
    "Le matelas est l'achat le plus intime de votre maison. Venez le tester en boutique, échanger avec nos conseillers et faire votre choix en toute sérénité.",
  argumentsTitle: "Pourquoi essayer en showroom",
  metaTitle: "Nos showrooms — Venez tester nos matelas",
  metaDescription:
    "Trois magasins physiques DreamsFly pour tester nos matelas avant achat. Nos conseillers experts vous accompagnent en boutique.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = (await sanityClient?.fetch<ShowroomsPageData>(showroomsPageQuery).catch(() => null)) ?? null;
  return buildMetadata({
    title: data?.metaTitle || DEFAULTS.metaTitle,
    description: data?.metaDescription || DEFAULTS.metaDescription,
    path: "/magasins",
  });
}

export default async function ShowroomsHub() {
  const [showrooms, siteSettings, page] = await Promise.all([
    sanityClient?.fetch<any[]>(allShowroomsQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
    sanityClient?.fetch<ShowroomsPageData>(showroomsPageQuery).catch(() => null) ?? null,
  ]);

  const heroEyebrow = page?.heroEyebrow || DEFAULTS.heroEyebrow;
  const heroTitle = page?.heroTitle || DEFAULTS.heroTitle;
  const heroSubtitle = page?.heroSubtitle || DEFAULTS.heroSubtitle;
  const argsTitle = page?.argumentsTitle || DEFAULTS.argumentsTitle;
  const argsItems = (page?.argumentsItems || []).filter((a) => a.title || a.text);
  const faqTitle = page?.faqTitle || "Vos questions sur la visite en magasin";
  const faqItems = (page?.faqItems || []).filter((f) => f.question && f.answer);

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Showrooms", url: "/magasins" },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <ScrollReveal />
      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow={heroEyebrow}
        title={heroTitle}
        lead={heroSubtitle}
      />
      <main className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-24">
        {showrooms.length === 0 ? (
          <p className="text-pierre">
            Nos showrooms sont en cours d'inauguration. Les adresses seront bientôt publiées.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showrooms.map((s, i) => (
              <Link
                key={s._id}
                href={`/magasins/${s.slug}`}
                style={{ transitionDelay: `${i * 80}ms` }}
                className="group reveal flex flex-col overflow-hidden rounded-[24px] border border-ink/10 bg-ivoire transition-all hover:-translate-y-1 hover:border-noir"
              >
                <div className="relative aspect-[4/3] bg-creme">
                  {s.image ? (
                    <Image
                      src={urlFor(s.image).width(600).quality(85).url()}
                      alt={s.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl opacity-25">🏬</div>
                  )}
                </div>
                <div className="p-7">
                  <span className="num-editorial !text-[26px] !text-or">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display-serif on-cream mt-3 text-[1.6rem] font-normal leading-tight">
                    {s.name}
                  </h2>
                  {s.address && (
                    <p className="mt-3 font-sans text-[14px] leading-relaxed text-taupe">
                      {s.address.street}<br />
                      {s.address.postalCode} {s.address.city}
                    </p>
                  )}
                  {s.phone && (
                    <p className="mt-3 font-sans text-[14px] font-medium text-noir">{s.phone}</p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-2 border-b border-noir pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-noir">
                    Voir le showroom
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {argsItems.length > 0 && (
          <section className="mt-28 md:mt-40">
            <div className="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end reveal">
              <div>
                <span className="eyebrow-editorial on-cream mb-3">Chapitre II · L'expérience showroom</span>
                <h2 className="display-serif on-cream mt-4 text-[2rem] font-normal md:text-[3.2rem]">
                  {argsTitle.split(" ").length > 2 ? emphasizeLast(argsTitle) : argsTitle}
                </h2>
              </div>
            </div>
            <div className="rule-cream mb-12" />
            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {argsItems.map((a, i) => (
                <div key={i} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="mb-5 flex items-baseline gap-4">
                    <span className="num-editorial !text-[34px] !text-or">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {a.icon && <span aria-hidden className="text-xl">{a.icon}</span>}
                  </div>
                  <h3 className="display-serif on-cream text-[1.3rem] font-normal leading-tight">{a.title}</h3>
                  {a.text && <p className="mt-3 max-w-[38ch] font-sans text-[14px] leading-relaxed text-taupe md:text-[15px]">{a.text}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {faqItems.length > 0 && (
          <section className="mt-28 max-w-4xl md:mt-40">
            <div className="mb-12 reveal">
              <span className="eyebrow-editorial on-cream mb-3">Chapitre III · Questions fréquentes</span>
              <h2 className="display-serif on-cream mt-4 text-[2rem] font-normal md:text-[3.2rem]">
                {faqTitle.split(" ").length > 2 ? emphasizeLast(faqTitle) : faqTitle}
              </h2>
            </div>
            <div className="divide-y divide-ink/10 border-y border-ink/10">
              {faqItems.map((f, i) => (
                <details key={i} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-[19px] font-normal text-noir md:text-[22px]">
                    <span className="flex-1">{f.question}</span>
                    <span className="text-or transition-transform group-open:rotate-45" aria-hidden>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5v14M5 12h14"/></svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-[64ch] whitespace-pre-line font-sans text-[14px] leading-relaxed text-taupe md:text-[15px]">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}
    </>
  );
}

function emphasizeLast(title: string): React.ReactNode {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return title;
  const last = words.pop() as string;
  return (
    <>
      {words.join(" ")} <em>{last}</em>
    </>
  );
}
