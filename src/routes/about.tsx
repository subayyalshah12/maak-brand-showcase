import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/hero-building.jpg";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { SITE } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo("About Us", "Learn about MAAK Enterprises — a Pakistan-based company working in construction, real estate and educational consultancy.", "/about"),
  component: About,
});

function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Building, developing and growing — together" image={hero} />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Who we are" title="A Pakistan-based company with three divisions" />
          <p className="mt-6 text-muted-foreground">MAAK Enterprises brings together construction, real estate and educational consultancy under one name. Each division is led by a dedicated contact so clients always know who to speak to.</p>
          <p className="mt-4 text-muted-foreground">Our construction operations run from Rawalpindi, while our real estate and educational consultancy teams work from Gulberg Greens, Islamabad.</p>
        </div>
        <div className="grid gap-4">
          {SITE.contacts.map((c) => (
            <div key={c.division} className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <p className="eyebrow">{c.division}</p>
              <p className="mt-2 text-2xl font-semibold text-primary" style={{ fontFamily: "var(--font-display)" }}>{c.person}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
