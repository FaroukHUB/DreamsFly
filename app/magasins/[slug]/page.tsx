import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import {
  showroomBySlugQuery,
  allShowroomSlugsQuery,
} from "@/lib/sanity/extra-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  breadcrumbSchema,
  localBusinessSchema,
  organizationSchema,
} from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 600;

type Params = { slug: string };

export async function generateStaticParams() {
  if (!sanityClient) return [];
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(allShowroomSlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!sanityClient) return buildMetadata({ path: `/magasins/${slug}` });
  const s = await sanityClient.fetch<any>(showroomBySlugQuery, { slug }).catch(() => null);
  if (!s) return buildMetadata({ path: `/magasins/${slug}`, noindex: true });

  return buildMetadata({
    title: `${s.name} — Showroom DreamsFly`,
    description: `Venez tester nos matelas DreamsFly au showroom ${s.address?.city}. ${s.address?.street}, ${s.address?.postalCode} ${s.address?.city}.`,
    path: `/magasins/${slug}`,
    image: s.images?.[0] ? urlFor(s.images[0]).width(1200).height(630).url() : undefined,
  });
}

const DAYS_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default async function ShowroomPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!sanityClient) notFound();

  const [s, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(showroomBySlugQuery, { slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  if (!s) notFound();

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Showrooms", url: "/magasins" },
    { name: s.name, url: `/magasins/${slug}` },
  ];

  const mapsUrl = buildMapsUrl(s);

  // Trier les horaires
  const sortedHours =
    s.openingHours
      ?.slice()
      .sort((a: any, b: any) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)) || [];

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamsfly.fr";

  return (
    <>
      <Header settings={siteSettings} />
      <EditorialPageHeader
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Showrooms", url: "/magasins" },
          { name: s.name, url: `/magasins/${s.slug}` },
        ]}
        eyebrow="Showroom DreamsFly"
        title={s.name}
        emphasize={0}
        lead={s.address?.city ? `${s.address.street} · ${s.address.postalCode} ${s.address.city}` : undefined}
      />
      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Images */}
          <div>
            {s.images && s.images.length > 0 ? (
              <div className="grid gap-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-sable">
                  <Image
                    src={urlFor(s.images[0]).width(1200).quality(85).url()}
                    alt={s.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                    className="object-cover"
                  />
                </div>
                {s.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {s.images.slice(1, 4).map((img: any, i: number) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-sable">
                        <Image
                          src={urlFor(img).width(400).url()}
                          alt={`${s.name} ${i + 2}`}
                          fill
                          sizes="20vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center rounded-3xl bg-sable text-7xl opacity-30">
                🏬
              </div>
            )}

            {/* Description */}
            {s.description && (
              <div className="prose-content mt-10 max-w-3xl">
                <PortableText value={s.description} />
              </div>
            )}
          </div>

          {/* Infos pratiques */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-border bg-ivoire p-6">
              <h2 className="mb-5 font-sora text-xl font-semibold tracking-tight text-ink">
                Infos pratiques
              </h2>

              {s.address && (
                <div className="mb-5">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-pierre">Adresse</div>
                  <address className="not-italic text-[15px] leading-relaxed text-ink">
                    {s.address.street}<br />
                    {s.address.postalCode} {s.address.city}
                  </address>
                </div>
              )}

              {s.phone && (
                <div className="mb-5">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-pierre">Téléphone</div>
                  <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-[15px] font-semibold text-midnight hover:text-midnight-dark">
                    {s.phone}
                  </a>
                </div>
              )}

              {s.email && (
                <div className="mb-5">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-pierre">Email</div>
                  <a href={`mailto:${s.email}`} className="text-[15px] text-midnight hover:underline">
                    {s.email}
                  </a>
                </div>
              )}

              {sortedHours.length > 0 && (
                <div className="mb-5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-pierre">Horaires</div>
                  <ul className="space-y-1 text-[14px]">
                    {sortedHours.map((h: any) => (
                      <li key={h.day} className="flex justify-between">
                        <span className="text-pierre">{h.day}</span>
                        <span className="font-medium text-ink">
                          {h.closed ? "Fermé" : `${h.open} – ${h.close}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-pill bg-midnight px-5 py-3 font-sora text-sm font-semibold text-white transition-colors hover:bg-midnight-dark"
                >
                  <PinIcon />
                  Itinéraire Google Maps
                </a>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={localBusinessSchema({
          name: `DreamsFly ${s.name}`,
          url: `${SITE_URL}/magasins/${slug}`,
          street: s.address?.street,
          postalCode: s.address?.postalCode,
          city: s.address?.city,
          country: s.address?.country,
          phone: s.phone,
          email: s.email,
          lat: s.coordinates?.lat,
          lng: s.coordinates?.lng,
          openingHours: s.openingHours,
          images: s.images?.map((img: any) => urlFor(img).width(1200).url()).slice(0, 3),
        })}
      />
    </>
  );
}

/**
 * Lien « Itinéraire » vers Google Maps, construit à partir de la meilleure
 * information disponible.
 *
 * Trois sources, par ordre de fiabilité décroissante :
 *
 *  1. Le Google Place ID — désigne l'établissement lui-même. C'est le seul
 *     qui reste juste si l'adresse est mal saisie ou si la rue est mal
 *     géocodée. Format d'URL officiel de Google.
 *  2. Les coordonnées GPS — précises, mais pointent un point au sol sans
 *     rattacher la fiche de l'établissement.
 *  3. L'adresse postale — le repli, tributaire de l'interprétation de Google.
 *
 * Auparavant seules les coordonnées étaient utilisées : un showroom
 * renseigné uniquement par son Place ID n'affichait aucun bouton.
 */
function buildMapsUrl(s: any): string | null {
  const placeId = typeof s?.googlePlaceId === "string" ? s.googlePlaceId.trim() : "";
  const parts = [s?.name, s?.address?.street, s?.address?.postalCode, s?.address?.city]
    .filter(Boolean)
    .join(" ");

  if (placeId) {
    // Google exige un `query` même lorsque le place_id est fourni : il sert
    // de libellé et de repli si l'identifiant n'est plus valide.
    const query = encodeURIComponent(parts || placeId);
    return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${encodeURIComponent(placeId)}`;
  }

  const { lat, lng } = s?.coordinates || {};
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  if (parts) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}`;
  }

  return null;
}

/** Épingle de carte — remplace l'emoji, hors charte du site. */
function PinIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
