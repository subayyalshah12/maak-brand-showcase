import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/construction.jpg";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";
import { ProjectCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/sample-data";
import { seo } from "@/lib/seo";
import { SITE, contactWhatsappLink } from "@/lib/site";
export const Route = createFileRoute("/construction")({
  head: () => seo("Construction Services", "Residential and commercial construction services by MAAK Enterprises, operating from Rawalpindi, Pakistan.", "/construction"),
  component: Construction,
});

const services = [
  "Residential Construction",
  "Commercial Construction",
  "Grey Structure",
  "Finishing Works",
  "Renovation",
  "Project Management",
  "Design Work",
  "Project Consultancy",
  "Project Construction and Supervision",
  "Project Survey",
];

function Construction() {
  return (
    <>
      <PageHero eyebrow="Construction" title="Built with care, delivered with discipline" intro="Our construction operations are based in Rawalpindi. Contact: Umair Kazmi." image={hero} />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Services" title="What we build" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => <li key={s} className="rounded-lg border-l-4 border-gold bg-card p-6 text-lg font-semibold text-primary shadow-[var(--shadow-card)]">{s}</li>)}
        </ul>
      </section>
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Contact our team"
          title="Speak with our construction leadership"
          intro="Get in touch with our team to discuss your construction requirements."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SITE.contacts
            .filter((person) => person.division === "Construction")
            .map((person) => (
              <div
                key={person.person}
                className="rounded-lg border border-border bg-card p-8 shadow-[var(--shadow-card)]"
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {person.person === "Umair Ali Kazmi"
                    ? "Chief Operating Officer (COO)"
                    : "Chief Executive Officer (CEO)"}
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-primary">
                  {person.person}
                </h3>

                <p className="mt-2 text-muted-foreground">{person.phone}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild>
                    <a href={`tel:${person.phone}`}>Call</a>
                  </Button>

                  <Button asChild variant="outline">
                    <a
                      href={contactWhatsappLink(
                        person.phone,
                        "Hello, I would like to discuss a construction project with MAAK Enterprises."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </section>
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Portfolio" title="Completed & ongoing projects" />
            <Button asChild variant="outline"><Link to="/projects">View all</Link></Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{projects.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6"><InquiryForm type="construction" title="Discuss your construction project" /></section>
    </>
  );
}
