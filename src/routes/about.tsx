import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/hero-building.jpg";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { SITE, contactWhatsappLink } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo(
    "About Us",
    "Learn about MAAK Enterprises — a Pakistan-based company working in construction, real estate and educational consultancy.",
    "/about"
  ),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Building, developing and growing — together"
        image={hero}
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Who we are"
            title="A Pakistan-based company with three divisions"
          />
          <p className="mt-6 text-muted-foreground">
            MAAK Enterprises brings together construction, real estate and
            educational consultancy under one name. Our experienced leadership
            team is committed to delivering professional services and building
            lasting client relationships.
          </p>
          <p className="mt-4 text-muted-foreground">
            Our construction operations run from Rawalpindi, while our real
            estate and educational consultancy teams work from Gulberg Greens,
            Islamabad.
          </p>
        </div>

        <div className="grid gap-4">
          {SITE.offices.map((office) => (
            <div
              key={office.city}
              className="rounded-lg border border-border bg-card p-5"
            >
              <p className="font-semibold text-primary">{office.city}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {office.focus}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Our leadership"
            title="Meet the people behind MAAK"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SITE.leadership.map((person) => (
              <div
                key={person.role}
                className="rounded-lg border border-border bg-card p-7 shadow-[var(--shadow-card)]"
              >
                <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {person.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {person.role}
                </p>

                <h3 className="mt-2 text-xl font-semibold text-primary">
                  {person.name}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground">
                  {person.phone}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`tel:${person.phone}`}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Call
                  </a>

                  <a
                    href={contactWhatsappLink(
                      person.phone,
                      `Hello ${person.name}, I would like to contact you regarding MAAK Enterprises.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-primary"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
