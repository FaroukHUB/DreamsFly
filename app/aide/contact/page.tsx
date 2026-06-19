import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
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
  const siteSettings = sanityClient
    ? await sanityClient.fetch<any>(siteSettingsQuery).catch(() => null)
    : null;

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

      <main className="mx-auto max-w-site px-6 py-12 md:px-8 md:py-16">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <a href="/" className="hover:text-midnight">Accueil</a>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Contact</span>
        </nav>

        <header className="mb-12 max-w-2xl">
          <div className="eyebrow mb-3">Service client</div>
          <h1 className="font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            Une question ? On est là.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-pierre md:text-xl">
            Nos conseillers experts répondent à toutes vos questions sur le sommeil et la literie.
            Choisissez le canal qui vous convient — réponse rapide garantie.
          </p>
        </header>

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
      className="group flex items-center gap-4 rounded-2xl border border-border bg-ivoire p-5 transition-all hover:-translate-y-0.5 hover:border-midnight md:p-6"
    >
      <span aria-hidden className="text-3xl md:text-4xl">{icon}</span>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-pierre">{subtitle}</div>
        <div className="font-sora text-base font-semibold text-ink md:text-lg">{title}</div>
        <div className="text-sm font-semibold text-midnight group-hover:text-midnight-dark">{ctaLabel} →</div>
      </div>
    </a>
  );
}
