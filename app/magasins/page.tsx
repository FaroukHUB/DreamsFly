import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { allShowroomsQuery, showroomsPageQuery } from "@/lib/sanity/extra-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
      <main className="mx-auto max-w-site px-8 py-12 md:py-16">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Showrooms</span>
        </nav>

        <header className="mb-16 max-w-3xl">
          <div className="eyebrow mb-3">{heroEyebrow}</div>
          <h1 className="font-sora text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-pierre md:text-xl">
            {heroSubtitle}
          </p>
        </header>

        {showrooms.length === 0 ? (
          <p className="text-pierre">
            Nos showrooms sont en cours d'inauguration. Les adresses seront bientôt publiées.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showrooms.map((s) => (
              <Link
                key={s._id}
                href={`/magasins/${s.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-ivoire transition-all hover:-translate-y-1 hover:border-midnight"
              >
                <div className="relative aspect-[4/3] bg-sable">
                  {s.image ? (
                    <Image
                      src={urlFor(s.image).width(600).quality(85).url()}
                      alt={s.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl opacity-30">🏬</div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-sora text-xl font-semibold tracking-tight text-ink">
                    {s.name}
                  </h2>
                  {s.address && (
                    <p className="mt-2 text-sm text-pierre">
                      {s.address.street}<br />
                      {s.address.postalCode} {s.address.city}
                    </p>
                  )}
                  {s.phone && (
                    <p className="mt-3 text-sm font-semibold text-midnight">{s.phone}</p>
                  )}
                  <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-midnight">
                    Voir le showroom →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {argsItems.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-10 font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {argsTitle}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {argsItems.map((a, i) => (
                <div key={i} className="rounded-2xl border border-border bg-ivoire p-7">
                  {a.icon && <div className="mb-4 text-3xl">{a.icon}</div>}
                  <h3 className="font-sora text-lg font-semibold text-ink">{a.title}</h3>
                  {a.text && <p className="mt-2 text-sm leading-relaxed text-pierre">{a.text}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {faqItems.length > 0 && (
          <section className="mt-24 max-w-3xl">
            <h2 className="mb-8 font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {faqTitle}
            </h2>
            <div className="divide-y divide-border rounded-2xl border border-border bg-ivoire">
              {faqItems.map((f, i) => (
                <details key={i} className="group px-6 py-5">
                  <summary className="cursor-pointer list-none font-sora text-base font-semibold text-ink">
                    {f.question}
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-pierre">
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
