/**
 * Bloc « Ce qu'il faut retenir » — encart synthétique en haut de page.
 * Pensé pour les IA (réponse directe extraite par ChatGPT/Perplexity)
 * et pour les utilisateurs pressés.
 */
type Takeaway = { label?: string; value?: string };

export function KeyTakeaways({
  title = "Ce qu'il faut retenir",
  items,
}: {
  title?: string;
  items: Takeaway[];
}) {
  if (!items?.length) return null;
  return (
    <aside
      aria-label={title}
      className="my-10 rounded-2xl border border-aurora/50 bg-aurora/10 p-6 md:p-8"
    >
      <h2 className="mb-4 font-sora text-lg font-semibold tracking-tight text-midnight">
        💡 {title}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3">
            <span className="font-sora text-sm font-bold text-midnight">→</span>
            <span className="text-[15px] leading-relaxed text-ink">
              {it.label && <strong className="font-semibold">{it.label} : </strong>}
              {it.value}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
