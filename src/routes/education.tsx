import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/education.jpg";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Button } from "@/components/ui/button";
import { SITE, contactWhatsappLink } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/education")({
head: () => seo("Medical Admissions & Healthcare Courses Consultancy", "Guidance for MBBS, BDS, BS Nursing, Pharm-D, DPT, BS Allied Sciences, CNW and LHV admissions in Pakistan.", "/education"),  component: Education,
});

function Education() {
  return (
    <>
<PageHero eyebrow="Educational consultancy" title="Guidance for medical college admissions in Pakistan" intro="Professional guidance for students applying to medical, dental, nursing and allied health science programmes across Pakistan." image={hero} />      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div>
<p className="mt-6 text-muted-foreground">Our consultancy team helps students and families understand the admissions process for MBBS, BDS, BS Nursing, Pharm-D, DPT, BS Allied Sciences, CNW and LHV programmes in Pakistan. Send us your questions and we will guide you on next steps.</p>                   <div className="mt-8 grid gap-5">
  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
  {[
    "MBBS",
    "BDS",
    "BS Nursing",
    "Pharm-D",
    "DPT",
    "BS Allied Sciences",
    "CNW",
    "LHV",
  ].map((course) => (
    <div
      key={course}
      className="rounded-lg border border-border bg-card p-4 text-center font-semibold text-primary shadow-sm"
    >
      {course}
    </div>
  ))}
</div>          
  {SITE.contacts
.filter(
  (person) =>
    person.division === "Educational Consultancy" &&
    person.person === "Uzair Ali Kazmi"
)              .map((person) => (
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
              <div className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Post Project Director
              </p>
              <h3 className="mt-2 text-xl font-semibold text-primary">
                Sohail Ikram
              </h3>
              <p className="mt-2 text-muted-foreground">03369099797</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="tel:03369099797">Call</a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={contactWhatsappLink(
                      "03369099797",
                      "Hello, I would like guidance on admissions with MAAK Enterprises."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <InquiryForm type="education" title="Request admissions guidance" />
      </section>
    </>
  );
}
