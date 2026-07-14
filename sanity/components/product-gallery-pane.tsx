"use client";
import { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import { Badge, Box, Button, Card, Flex, Grid, Spinner, Stack, Text, TextInput } from "@sanity/ui";

type ProductDoc = {
  _id: string;
  _updatedAt: string;
  name?: string;
  title?: string;
  featured?: boolean;
  productType?: string;
  imageUrl?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: string;
  hasDraft?: boolean;
};

type Options = {
  productType?: string; // "matelas" | "lit" | "sommier" | ... | undefined = tous
  includeLegacy?: boolean; // pour matelas : inclut aussi les docs sans productType
  title?: string;
};

/**
 * Grille galerie custom façon Mobilier Malin.
 * Affiche image + nom + prix + badges (Publié/Brouillon/Mis en avant/Rupture).
 * Clic sur une carte → ouvre le document dans le pane suivant.
 */
export function ProductGalleryPane(props: { options?: Options }) {
  const { productType, includeLegacy, title } = props.options || {};
  const client = useClient({ apiVersion: "2024-01-01" });
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let filter = `_type == "product"`;
    if (productType) {
      filter += includeLegacy
        ? ` && (productType == "${productType}" || !defined(productType))`
        : ` && productType == "${productType}"`;
    }
    const query = `{
      "docs": *[${filter}] | order(name asc, _updatedAt desc){
        _id, _updatedAt, name, title, featured, productType,
        "imageUrl": images[0].asset->url,
        "price": variants[0].price,
        "compareAtPrice": variants[0].compareAtPrice,
        "stock": variants[0].stockStatus
      }
    }`;
    const sub = client.observable.fetch(query).subscribe({
      next: (result: any) => {
        const raw: ProductDoc[] = result?.docs || [];
        // Dédup drafts/published : garde une seule ligne par baseId,
        // priorité au brouillon (plus récent) + flag hasDraft
        const byBase = new Map<string, ProductDoc>();
        for (const d of raw) {
          const isDraft = d._id.startsWith("drafts.");
          const baseId = isDraft ? d._id.slice(7) : d._id;
          const existing = byBase.get(baseId);
          if (!existing) {
            byBase.set(baseId, { ...d, hasDraft: isDraft });
          } else {
            // Merge : garde image/prix de celui qui les a
            const merged: ProductDoc = {
              ...existing,
              ...d,
              _id: baseId, // toujours ouvrir le doc publié
              imageUrl: d.imageUrl ?? existing.imageUrl,
              price: d.price ?? existing.price,
              compareAtPrice: d.compareAtPrice ?? existing.compareAtPrice,
              stock: d.stock ?? existing.stock,
              name: d.name ?? existing.name,
              title: d.title ?? existing.title,
              featured: d.featured ?? existing.featured,
              hasDraft: existing.hasDraft || isDraft,
            };
            byBase.set(baseId, merged);
          }
        }
        setProducts(Array.from(byBase.values()));
        setLoading(false);
      },
      error: (err) => {
        console.error("[ProductGalleryPane]", err);
        setLoading(false);
      },
    });
    return () => sub.unsubscribe();
  }, [client, productType, includeLegacy]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.title || "").toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <Flex direction="column" style={{ height: "100%", minHeight: "100vh" }}>
      {/* Header sticky */}
      <Box
        padding={4}
        style={{
          borderBottom: "1px solid var(--card-border-color)",
          background: "var(--card-bg-color)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Stack space={3}>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Flex align="center" gap={2}>
              <Text size={3} weight="semibold">
                🖼️ {title || "Galerie produits"}
              </Text>
              <Badge tone="primary">{filtered.length} éléments</Badge>
            </Flex>
            <IntentLink
              intent="create"
              params={{ type: "product", ...(productType ? { template: `product-${productType}` } : {}) }}
              style={{ textDecoration: "none" }}
            >
              <Button text="+ Créer un produit" tone="primary" mode="default" />
            </IntentLink>
          </Flex>
          <TextInput
            placeholder="Rechercher par nom…"
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </Stack>
      </Box>

      {/* Grille */}
      <Box padding={3} style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <Flex justify="center" align="center" padding={5}>
            <Spinner muted />
          </Flex>
        ) : filtered.length === 0 ? (
          <Flex justify="center" align="center" padding={5}>
            <Text muted>Aucun produit trouvé dans cette catégorie.</Text>
          </Flex>
        ) : (
          <Grid columns={[2, 3, 4, 5, 6]} gap={2}>
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </Grid>
        )}
      </Box>
    </Flex>
  );
}

function ProductCard({ product: p }: { product: ProductDoc }) {
  const discount =
    p.compareAtPrice && p.price && p.compareAtPrice > p.price
      ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
      : null;
  const isOutOfStock = p.stock === "rupture";

  return (
    <IntentLink
      intent="edit"
      params={{ id: p._id, type: "product" }}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
    <Card
      padding={0}
      radius={3}
      shadow={1}
      style={{ cursor: "pointer", overflow: "hidden" }}
    >
      {/* Image */}
      <Box
        style={{
          position: "relative",
          aspectRatio: "1/1",
          background: "#f4f2ee",
          overflow: "hidden",
        }}
      >
        {p.imageUrl ? (
          <img
            src={`${p.imageUrl}?w=400&auto=format`}
            alt={p.name || p.title || ""}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Text size={5} muted>
              📷
            </Text>
          </Flex>
        )}

        {/* Badges top-right : Publié / Brouillon */}
        <Box style={{ position: "absolute", top: 6, right: 6 }}>
          <Badge tone={p.hasDraft ? "caution" : "positive"} fontSize={0}>
            {p.hasDraft ? "Brouillon" : "Publié"}
          </Badge>
        </Box>

        {/* Badges top-left : Mis en avant + Rupture */}
        <Stack space={1} style={{ position: "absolute", top: 6, left: 6 }}>
          {p.featured && (
            <Badge tone="primary" fontSize={0}>
              ⭐ Mis en avant
            </Badge>
          )}
          {isOutOfStock && (
            <Badge tone="critical" fontSize={0}>
              Rupture
            </Badge>
          )}
        </Stack>

        {/* Discount badge bottom-left */}
        {discount && discount > 0 && (
          <Box
            style={{
              position: "absolute",
              bottom: 6,
              left: 6,
              background: "#D32F2F",
              color: "white",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            -{discount}%
          </Box>
        )}
      </Box>

      {/* Infos */}
      <Stack padding={2} space={2}>
        <Text size={1} weight="semibold" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {p.name || "(sans nom)"}
        </Text>
        <Flex align="center" justify="space-between" gap={1}>
          <Text size={1} weight="bold" style={{ color: "#D32F2F" }}>
            {p.price ? `${p.price} €` : "—"}
          </Text>
          {p.compareAtPrice && p.price && p.compareAtPrice > p.price && (
            <Text size={0} muted style={{ textDecoration: "line-through" }}>
              {p.compareAtPrice} €
            </Text>
          )}
        </Flex>
      </Stack>
    </Card>
    </IntentLink>
  );
}
