import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";
import { groq } from "next-sanity";

export const revalidate = 3600; // 1 heure

export const metadata: Metadata = buildMetadata({
  title: "Plan du site — DreamsFly",
  description:
    "Vue d'ensemble de toutes les pages du site DreamsFly : collections, guides, magasins, aide et service client.",
  path: "/plan-du-site",
});

type MinDoc = { slug: string; title?: string; name?: string };

async function safeFetch<T>(query: string): Promise<T[]> {
  if (!sanityClient) return [];
  try {
    return (await sanityClient.fetch<T[]>(query)) || [];
  } catch {
    return [];
  }
}

export default async function PlanDuSite() {
  const [
    siteSettings,
    products,
    landings,
    guides,
    comparisons,
    glossary,
    showrooms,
  ] = await Promise.all([
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
    safeFetch<{ slug: string; name?: string; title?: string; productType?: string }>(
      groq`*[_type == "product" && defined(slug.current) && defined(images[0]) && defined(variants[0].price)] | order(name asc) { "slug": slug.current, name, title, productType }`,
    ),
    safeFetch<MinDoc & { h1?: string }>(
      groq`*[_type == "landingPage" && defined(slug.current) && defined(publishedAt) && publishedAt <= now() && !(noindex == true)] | order(h1 asc) { "slug": slug.current, h1 }`,
    ),
    safeFetch<MinDoc>(
      groq`*[_type == "guide" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(title asc) { "slug": slug.current, title }`,
    ),
    safeFetch<MinDoc>(
      groq`*[_type == "comparison" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(title asc) { "slug": slug.current, title }`,
    ),
    safeFetch<MinDoc & { term?: string }>(
      groq`*[_type == "glossary" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(term asc) { "slug": slug.current, term }`,
    ),
    safeFetch<MinDoc>(
      groq`*[_type == "showroom" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(name asc) { "slug": slug.current, name }`,
    ),
  ]);

  const productsByType = {
    matelas: products.filter((p) => !p.productType || p.productType === "matelas"),
    lits: products.filter((p) => p.productType === "lit"),
    sommiers: products.filter((p) => p.productType === "sommier"),
    oreillers: products.filter((p) => p.productType === "oreiller"),
  };

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Plan du site", url: "/plan-du-site" },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Navigation complète"
        title="Plan du site"
        lead="Toutes les pages du site DreamsFly, regroupées par thématique — pour trouver rapidement ce que vous cherchez."
        emphasize={0}
      />

      <main className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-14 md:grid-cols-2 md:gap-16 lg:grid-cols-3">
          <Section title="Boutique">
            <SubSection title="Catégories">
              <SiteLink href="/matelas">Tous les matelas</SiteLink>
              <SiteLink href="/lits">Tous les lits</SiteLink>
              <SiteLink href="/sommiers">Tous les sommiers</SiteLink>
              <SiteLink href="/oreillers">Tous les oreillers</SiteLink>
              <SiteLink href="/lits-coffre">Lits coffre — Guide</SiteLink>
            </SubSection>
          </Section>

          {productsByType.matelas.length > 0 && (
            <Section title={`Matelas (${productsByType.matelas.length})`}>
              <SubSection>
                {productsByType.matelas.map((p) => (
                  <SiteLink key={p.slug} href={`/matelas/${p.slug}`}>
                    {p.name || p.title}
                  </SiteLink>
                ))}
              </SubSection>
            </Section>
          )}

          {productsByType.lits.length > 0 && (
            <Section title={`Lits (${productsByType.lits.length})`}>
              <SubSection>
                {productsByType.lits.map((p) => (
                  <SiteLink key={p.slug} href={`/lits/${p.slug}`}>
                    {p.name || p.title}
                  </SiteLink>
                ))}
              </SubSection>
            </Section>
          )}

          {productsByType.sommiers.length > 0 && (
            <Section title={`Sommiers (${productsByType.sommiers.length})`}>
              <SubSection>
                {productsByType.sommiers.map((p) => (
                  <SiteLink key={p.slug} href={`/sommiers/${p.slug}`}>
                    {p.name || p.title}
                  </SiteLink>
                ))}
              </SubSection>
            </Section>
          )}

          {productsByType.oreillers.length > 0 && (
            <Section title={`Oreillers (${productsByType.oreillers.length})`}>
              <SubSection>
                {productsByType.oreillers.map((p) => (
                  <SiteLink key={p.slug} href={`/oreillers/${p.slug}`}>
                    {p.name || p.title}
                  </SiteLink>
                ))}
              </SubSection>
            </Section>
          )}

          <Section title="Guides santé & literie">
            <SubSection>
              <SiteLink href="/matelas-mal-de-dos">Matelas et mal de dos</SiteLink>
              <SiteLink href="/matelas-memoire-de-forme">Matelas mémoire de forme</SiteLink>
            </SubSection>
            {landings.length > 0 && (
              <SubSection title="Autres guides">
                {landings.map((p) => (
                  <SiteLink key={p.slug} href={`/${p.slug}`}>
                    {p.h1 || p.slug}
                  </SiteLink>
                ))}
              </SubSection>
            )}
          </Section>

          {guides.length > 0 && (
            <Section title={`Magazine (${guides.length})`}>
              <SubSection>
                <SiteLink href="/magazine">Tous les articles</SiteLink>
                {guides.map((g) => (
                  <SiteLink key={g.slug} href={`/magazine/${g.slug}`}>
                    {g.title}
                  </SiteLink>
                ))}
              </SubSection>
            </Section>
          )}

          {comparisons.length > 0 && (
            <Section title="Comparatifs">
              <SubSection>
                <SiteLink href="/comparatifs">Tous les comparatifs</SiteLink>
                {comparisons.map((c) => (
                  <SiteLink key={c.slug} href={`/comparatifs/${c.slug}`}>
                    {c.title}
                  </SiteLink>
                ))}
              </SubSection>
            </Section>
          )}

          {glossary.length > 0 && (
            <Section title={`Glossaire (${glossary.length})`}>
              <SubSection>
                <SiteLink href="/glossaire">Voir tous les termes</SiteLink>
                {glossary.slice(0, 20).map((t) => (
                  <SiteLink key={t.slug} href={`/glossaire/${t.slug}`}>
                    {t.term}
                  </SiteLink>
                ))}
                {glossary.length > 20 && (
                  <SiteLink href="/glossaire">
                    Voir les {glossary.length - 20} autres…
                  </SiteLink>
                )}
              </SubSection>
            </Section>
          )}

          <Section title="Nos magasins">
            <SubSection>
              <SiteLink href="/magasins">Tous les showrooms</SiteLink>
              {showrooms.map((s) => (
                <SiteLink key={s.slug} href={`/magasins/${s.slug}`}>
                  {s.name}
                </SiteLink>
              ))}
            </SubSection>
          </Section>

          <Section title="Aide au choix">
            <SubSection>
              <SiteLink href="/quiz">Quiz matelas — 6 questions</SiteLink>
              <SiteLink href="/aide/contact">Nous contacter</SiteLink>
            </SubSection>
          </Section>

          <Section title="Informations légales">
            <SubSection>
              <SiteLink href="/mentions-legales">Mentions légales</SiteLink>
              <SiteLink href="/cgv">Conditions générales de vente</SiteLink>
              <SiteLink href="/confidentialite">Politique de confidentialité</SiteLink>
              <SiteLink href="/cookies">Gestion des cookies</SiteLink>
            </SubSection>
          </Section>
        </div>

        <div className="mt-20 border-t border-ink/10 pt-8 text-center">
          <p className="font-sans text-[13px] uppercase tracking-[0.14em] text-taupe">
            <span className="mr-2 text-or">◆</span>
            Sitemap XML pour les moteurs de recherche disponible sur{" "}
            <a
              href="/sitemap.xml"
              className="border-b border-noir pb-0.5 font-medium text-noir hover:text-or hover:border-or"
            >
              /sitemap.xml
            </a>
          </p>
        </div>
      </main>

      <Footer settings={siteSettings} />
      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="display-serif on-cream mb-6 text-[1.4rem] font-normal md:text-[1.6rem]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      {title && (
        <div className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-taupe">
          {title}
        </div>
      )}
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function SiteLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="font-sans text-[14px] text-ink transition-colors hover:text-or"
      >
        {children}
      </Link>
    </li>
  );
}
