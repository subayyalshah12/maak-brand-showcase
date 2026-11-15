import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, User } from "lucide-react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { SectionHeading } from "@/components/site/PageHero";
import { SITE } from "@/lib/site";
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
        <ul className="mt-6 space-y-2">
          {SITE.contacts.map((c) => <li key={c.division} className="flex items-center gap-2 text-sm"><User className="size-4 text-gold" /><strong>{c.division}:</strong> {c.person}</li>)}
        </ul>
      </div>
      <InquiryForm type="general" />
    </section>
  );
}
