import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, User } from "lucide-react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { SectionHeading } from "@/components/site/PageHero";
import { SITE, contactWhatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";
import { CompanyContact } from "@/components/site/CompanyContact";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact Us", "Contact MAAK Enterprises in Rawalpindi or Gulberg Greens, Islamabad for construction, real estate and educational consultancy.", "/contact"),
  component: Contact,
});

function Contact() {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary md:text-5xl">Let's talk</h1>
        <span className="gold-rule mt-4" />
        <p className="mt-4 text-muted-foreground">Send us a message and the right division will get back to you.</p>
        <a href={`mailto:${SITE.email}`} className="mt-8 flex items-center gap-3 text-lg font-semibold text-primary hover:underline"><Mail className="size-5 text-gold" />{SITE.email}</a>
        <CompanyContact />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SITE.offices.map((o) => (
            <div key={o.city} className="rounded-lg border border-border bg-card p-5"><MapPin className="size-5 text-gold" /><p className="mt-2 font-semibold">{o.city}</p><p className="text-sm text-muted-foreground">{o.focus}</p></div>
          ))}
        </div>
                <div className="mt-10">
          <SectionHeading
            eyebrow="Our team"
            title="Contact the right department"
            intro="Reach the relevant team directly for your requirements."
          />

          <div className="mt-6 grid gap-5">
            {["Construction", "Real Estate", "Educational Consultancy"].map(
              (division) => (
                <div
                  key={division}
                  className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)]"
                >
                  <h3 className="text-xl font-semibold text-primary">
                    {division}
                  </h3>

                  <div className="mt-4 grid gap-4">
                    {SITE.contacts
                      .filter((person) => person.division === division)
                      .map((person) => (
                        <div
                          key={`${division}-${person.person}`}
                          className="border-t border-border pt-4"
                        >
                          <p className="font-semibold">{person.person}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {person.phone}
                          </p>

                          <div className="mt-3 flex gap-3">
                            <Button asChild size="sm">
                              <a href={`tel:${person.phone}`}>Call</a>
                            </Button>

                            <Button asChild size="sm" variant="outline">
                              <a
                                href={contactWhatsappLink(
                                  person.phone,
                                  `Hello, I would like to contact the ${division} department at MAAK Enterprises.`
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
              )
            )}
          </div>
        </div>
      </div>
      <InquiryForm type="general" />
    </section>
  );
}
