import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { fetchPageHeros, pickHeroImageUrl } from "@/lib/sanity/page-heros";
import { Header } from "@/components/header";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { LineIcon, iconNameForEmoji } from "@/components/line-icon";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "Contactez-nous — Service client DreamsFly",
  description: "Téléphone, email, WhatsApp ou en showroom : nos conseillers literie sont à votre écoute 7j/7.",
  path: "/aide/contact",
});

export default async function ContactPage() {
  const [siteSettings, heros] = await Promise.all([
    sanityClient ? sanityClient.fetch<any>(siteSettingsQuery).catch(() => null) : null,
    fetchPageHeros(),
  ]);

  const phone = siteSettings?.contact?.phone || "07 85 88 92 60";
  const email = siteSettings?.contact?.email || "contact@dreamsfly.fr";
  const whatsapp = siteSettings?.contact?.whatsapp || "07 85 88 92 60";

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Aide", url: "/aide/contact" },
    { name: "Contact", url: "/aide/contact" },
  ];

  return (
    <>
      <Header settings={siteSettings} />

      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Service client"
        title="Une question ? On est là."
        lead="Nos conseillers experts répondent à toutes vos questions sur le sommeil et la literie. Choisissez le canal qui vous convient — réponse rapide garantie."
        imageUrl={pickHeroImageUrl(heros.aideContact, "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1400")}
      />

      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Canaux directs */}
          <aside className="space-y-4">
            <ContactCard
              icon="📞"
              title="Par téléphone"
              subtitle="Lun-Sam · 9h-19h"
              cta={`tel:${phone.replace(/\s/g, "")}`}
              ctaLabel={phone}
            />
            <ContactCard
              icon="✉️"
              title="Par email"
              subtitle="Réponse sous 24h ouvrées"
              cta={`mailto:${email}`}
              ctaLabel={email}
            />
            <ContactCard
              icon="💬"
              title="WhatsApp"
              subtitle="Pour discuter sur le pouce"
              cta={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              ctaLabel="Ouvrir WhatsApp"
            />
            <ContactCard
              icon="🏬"
              title="En showroom"
              subtitle="Testez avant d'acheter"
              cta="/magasins"
              ctaLabel="Voir nos 3 boutiques"
            />
          </aside>

          {/* Formulaire */}
          <div className="rounded-3xl border border-border bg-ivoire p-6 md:p-10">
            <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Ou écrivez-nous directement
            </h2>
            <p className="mb-6 text-sm text-pierre md:text-base">
              On vous répond généralement sous 24h ouvrées.
            </p>
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly", email, phone })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}

function ContactCard({ icon, title, subtitle, cta, ctaLabel }: any) {
  return (
    <a
      href={cta}
      className="group flex items-center gap-5 rounded-[24px] border border-ink/10 bg-ivoire p-6 transition-all hover:-translate-y-1 hover:border-noir/40 md:p-7"
    >
      <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-full border border-ink/15 text-noir transition-all group-hover:border-noir group-hover:bg-noir group-hover:text-or">
        <LineIcon name={iconNameForEmoji(icon)} size={20} strokeWidth={1.3} />
      </span>
      <div className="flex-1">
        <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">{subtitle}</div>
        <div className="mt-1 display-serif on-cream text-[1.15rem] font-normal md:text-[1.25rem]">{title}</div>
        <div className="mt-1 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-noir group-hover:text-or">{ctaLabel} →</div>
      </div>
    </a>
  );
}
