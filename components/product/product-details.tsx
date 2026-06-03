import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

type Product = {
  name?: string;
  title?: string;
  tagline?: string;
  thicknessCm?: number;
  description?: any;
  composition?: { label: string }[];
  features?: any;
};

/** Composition du matelas en couches (visuel + liste). */
export function ProductComposition({ composition }: { composition?: { label: string }[] }) {
  if (!composition?.length) return null;
  return (
    <section>
      <h2 className="mb-2 font-sora text-3xl font-semibold tracking-tight text-ink">
        Composition couche par couche
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Du tissu d'accueil à la base de soutien, chaque couche joue un rôle précis dans votre confort.
      </p>
      <ol className="space-y-3">
        {composition.map((c, i) => (
          <li key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-ivoire p-5">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-midnight font-sora text-sm font-bold text-white">
              {i + 1}
            </span>
            <span className="text-[15.5px] leading-relaxed text-ink">{c.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Spécifications techniques (tableau). */
export function ProductSpecs({ product }: { product: any }) {
  const specs: { label: string; value?: string | number }[] = [
    { label: "Type", value: product.type ? TYPE_LABELS[product.type] : undefined },
    { label: "Fermeté", value: product.firmness ? FIRMNESS_LABELS[product.firmness] : undefined },
    { label: "Accueil", value: product.welcome },
    { label: "Épaisseur", value: product.thicknessCm ? `${product.thicknessCm} cm` : undefined },
    { label: "Mémoire de forme", value: product.features?.memoireDeForme ? "Oui" : "Non" },
    { label: "Hypoallergénique", value: product.features?.hypoallergenique ? "Oui" : "Non" },
    { label: "Certification", value: product.features?.oekoTex ? "OEKO-TEX Standard 100" : undefined },
    { label: "Indépendance de couchage", value: product.features?.independanceCouchage },
    { label: "Fabrication", value: product.features?.fabriqueEurope ? "Europe" : undefined },
    { label: "Garantie", value: product.features?.garantieAns ? `${product.features.garantieAns} ans` : undefined },
  ].filter((s) => s.value !== undefined && s.value !== null && s.value !== "");

  if (!specs.length) return null;

  return (
    <section>
      <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight text-ink">
        Caractéristiques techniques
      </h2>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <tbody>
            {specs.map((s, i) => (
              <tr key={i} className={i % 2 ? "bg-sable" : "bg-ivoire"}>
                <th className="w-1/3 border-b border-border p-4 text-left font-sora font-semibold text-ink">
                  {s.label}
                </th>
                <td className="border-b border-border p-4 text-pierre">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const TYPE_LABELS: Record<string, string> = {
  "mousse-polyurethane": "Mousse polyuréthane",
  "mousse-hr-ressorts": "Mousse HR + ressorts ensachés",
  "memoire-ressorts": "Mémoire de forme + ressorts ensachés",
  "mousse-ressorts": "Mousse + ressorts ensachés",
};
const FIRMNESS_LABELS: Record<string, string> = {
  moelleux: "Moelleux",
  equilibre: "Équilibré",
  "mi-ferme": "Mi-ferme",
  ferme: "Ferme",
  "tres-ferme": "Très ferme",
};

/** Description longue produit en portable text. */
export function ProductDescription({ description }: { description?: any }) {
  if (!description?.length) return null;
  return (
    <section>
      <h2 className="mb-4 font-sora text-3xl font-semibold tracking-tight text-ink">
        Pourquoi choisir ce matelas ?
      </h2>
      <div className="prose-content max-w-3xl">
        <PortableText value={description} />
      </div>
    </section>
  );
}

/** Grille des produits liés. */
export function RelatedProducts({ products }: { products: any[] }) {
  if (!products?.length) return null;
  return (
    <section>
      <h2 className="mb-6 font-sora text-3xl font-semibold tracking-tight text-ink">
        Vous aimerez aussi
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/matelas/${p.slug}`}
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
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
