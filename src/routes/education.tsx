import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/education.jpg";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Button } from "@/components/ui/button";
import { SITE, contactWhatsappLink } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/education")({
  head: () => seo("Medical College Admissions Consultancy", "MBBS and BDS admissions consultancy for Pakistani medical colleges, from MAAK Enterprises in Gulberg Greens, Islamabad.", "/education"),
  component: Education,
});

function Education() {
  return (
    <>
      <PageHero eyebrow="Educational consultancy" title="Guidance for medical college admissions in Pakistan" intro="Consultancy for students applying to MBBS and BDS programmes. Contact: Shahzaib, Gulberg Greens, Islamabad." image={hero} />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="How we help" title="MBBS & BDS admissions" />
          <p className="mt-6 text-muted-foreground">Our consultancy team helps students and families understand the admissions process for medical and dental colleges in Pakistan. Send us your questions and we will guide you on next steps.</p>
          <p className="mt-4 rounded-lg border border-border bg-gold-soft p-4 text-sm text-foreground">We provide guidance only. Admission decisions are made by the colleges and admitting authorities — we do not guarantee admission.</p>
                    <div className="mt-8 grid gap-5">
            {SITE.contacts
              .filter((person) => person.division === "Educational Consultancy")
              .map((person) => (
                <div
                  key={person.person}
                  className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)]"
                >
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {person.person === "Uzair Ali Kazmi"
                      ? "Chief Executive Officer (CEO)"
                      : "Project Director"}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-primary">
                    {person.person}
                  </h3>

                  <p className="mt-2 text-muted-foreground">{person.phone}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button asChild>
                      <a href={`tel:${person.phone}`}>Call</a>
                    </Button>

                    <Button asChild variant="outline">
                      <a
                        href={contactWhatsappLink(
                          person.phone,
                          "Hello, I would like guidance on MBBS/BDS admissions with MAAK Enterprises."
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
        </div>
        <InquiryForm type="education" title="Request admissions guidance" />
      </section>
    </>
  );
}
