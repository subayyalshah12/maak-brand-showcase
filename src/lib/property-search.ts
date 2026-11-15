import type { Property } from "./sample-data";

export function filterProperties(items: Property[], filters: { q: string; purpose: string; type: string; beds: string }) {
  const q = filters.q.trim().toLowerCase();
  return items.filter((p) =>
    (filters.purpose === "all" || p.purpose === filters.purpose) &&
    (filters.type === "all" || p.type === filters.type) &&
    p.bedrooms >= Number(filters.beds) &&
    (!q || `${p.title} ${p.location}`.toLowerCase().includes(q))
  );
}