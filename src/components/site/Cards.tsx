import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import type { Project, Property } from "@/lib/sample-data";
import { formatPKR } from "@/lib/site";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link to="/real-estate/$id" params={{ id: p.id }} className="group overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={p.image} alt={p.title} loading="lazy" width={1280} height={896} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded bg-primary px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">For {p.purpose}</span>
      </div>
      <div className="p-5">
        <p className="text-lg font-bold text-primary">{formatPKR(p.price)}{p.purpose === "rent" && <span className="text-sm font-normal text-muted-foreground"> / month</span>}</p>
        <h3 className="mt-1 text-xl font-semibold">{p.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" />{p.location}</p>
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Ruler className="size-4 text-gold" />{p.size}</span>
          {p.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="size-4 text-gold" />{p.bedrooms} bed</span>}
          {p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="size-4 text-gold" />{p.bathrooms} bath</span>}
        </div>
      </div>
    </Link>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link to="/projects/$id" params={{ id: p.id }} className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-navy-deep">
      <img src={p.image} alt={p.title} loading="lazy" width={1280} height={896} className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
        <span className="eyebrow">{p.status} · {p.category}</span>
        <h3 className="mt-2 text-2xl font-semibold">{p.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-primary-foreground/80"><MapPin className="size-4" />{p.location}</p>
      </div>
    </Link>
  );
}

export function WhatsAppButton({ href, label = "Ask on WhatsApp" }: { href: string | null; label?: string }) {
  if (!href) return <p className="text-sm text-muted-foreground">WhatsApp number coming soon — please use the form or email us.</p>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-md bg-gold px-6 font-semibold text-navy-deep hover:bg-gold/90">{label}</a>;
}
