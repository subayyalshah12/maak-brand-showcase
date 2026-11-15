export function seo(title: string, description: string, path: string, type = "website") {
  const full = `${title} | MAAK Enterprises`;
  const url = new URL(path, "https://maak-brand-showcase.lovable.app").href;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
