/**
 * Layout du Studio Sanity embarqué.
 * Les exports metadata + viewport doivent vivre dans un Server Component,
 * c'est pourquoi ils sont ici (pas dans page.tsx qui est "use client").
 */
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
