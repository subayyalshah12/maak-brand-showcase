import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/lib/sample-data";
import { ArrowRight, Building2, GraduationCap, HardHat } from "lucide-react";
import hero from "@/assets/hero-building.jpg";
import construction from "@/assets/construction.jpg";
import realestate from "@/assets/realestate.jpg";
import education from "@/assets/education.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/PageHero";
import { PropertyCard, ProjectCard } from "@/components/site/Cards";
import { properties, projects } from "@/lib/sample-data";
import { Logo } from "@/components/site/Logo";
import { seo } from "@/lib/seo";
import { SITE, contactWhatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => seo("Construction, Real Estate & Education Consultancy", "MAAK Enterprises brings construction, real estate and medical college admissions consultancy together under one trusted name in Rawalpindi and Islamabad.", "/"),
  component: Home,
});

const divisions = [
  { to: "/construction", icon: HardHat, title: "Construction", text: "Residential and commercial construction, managed from our Rawalpindi office.", image: construction },
  { to: "/real-estate", icon: Building2, title: "Real Estate", text: "Properties for sale and rent across Islamabad and Rawalpindi.", image: realestate },
  { to: "/education", icon: GraduationCap, title: "Educational Consultancy", text: "Guidance for MBBS and BDS admissions to Pakistani medical colleges.", image: education },
] as const;

function Home() {
    const featuredQuery = useQuery({
    queryKey: ["homepage-featured-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "published")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((item): Property => ({
        id: item.id,
        title: item.title,
        type: item.type as Property["type"],
        purpose: item.purpose as Property["purpose"],
        price: Number(item.price),
        location: item.location,
        size: item.size,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        description: item.description,
        image: hero,
        featured: item.featured,
      }));
    },
  });

  const featuredProperties =
    featuredQuery.data && featuredQuery.data.length > 0
      ? featuredQuery.data
      : properties.filter((p) => p.featured);
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-deep">
        <img src={hero} alt="Modern building in Islamabad at sunset" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-24 sm:px-6 md:py-36 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow animate-rise">Build • Develop • Grow</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.05] text-primary-foreground animate-rise md:text-7xl">
              One trusted name for building, property and your future.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/85 animate-rise">
              MAAK Enterprises serves Rawalpindi and Islamabad through three dedicated divisions — construction, real estate and educational consultancy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-rise">
              <Button asChild variant="gold" size="lg"><Link to="/real-estate">View properties</Link></Button>
              <Button asChild variant="heroOutline" size="lg"><Link to="/contact">Talk to our team</Link></Button>
            </div>
          </div>
          <div className="hidden justify-center lg:flex">
            <Logo linked={false} className="h-72 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Our divisions" title="Three businesses, one standard" intro="Choose the division you need — each has its own dedicated team." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {divisions.map((d) => (
            <Link key={d.to} to={d.to} className="group overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]">
              <div className="aspect-[16/10] overflow-hidden"><img src={d.image} alt="" loading="lazy" width={1280} height={896} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
              <div className="p-6">
                <d.icon className="size-8 text-gold" />
                <h3 className="mt-3 text-2xl font-semibold text-primary">{d.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Our leadership"
          title="Meet the leadership team"
          intro="Connect directly with the people leading MAAK Enterprises."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SITE.leadership
            .filter((person) =>
              person.role.includes("Chief Executive") ||
              person.role.includes("Chief Operating")
            )
            .map((person) => (
              <div
                key={person.role}
                className="rounded-lg border border-border bg-card p-8 shadow-[var(--shadow-card)]"
              >
                <div className="flex size-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {person.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {person.role}
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-primary">
                  {person.name}
                </h3>

                <p className="mt-2 text-muted-foreground">{person.phone}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild variant="default">
                    <a href={`tel:${person.phone}`}>Call</a>
                  </Button>

                  <Button asChild variant="outline">
                    <a
                      href={contactWhatsappLink(
                        person.phone,
                        `Hello ${person.name}, I would like to contact MAAK Enterprises.`
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

        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to="/about">Meet the full leadership team</Link>
          </Button>
        </div>
      </section>
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Real estate" title="Featured properties" />
            <Button asChild variant="outline"><Link to="/real-estate">All properties</Link></Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((p) => (
  <PropertyCard key={p.id} p={p} />
))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Construction" title="Our projects" />
          <Button asChild variant="outline"><Link to="/projects">All projects</Link></Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-primary-foreground md:text-4xl">Planning to build, buy or study?</h2>
            <p className="mt-2 text-primary-foreground/80">Tell us what you need and the right team will reply.</p>
          </div>
          <Button asChild variant="gold" size="lg"><Link to="/contact">Send an inquiry</Link></Button>
        </div>
      </section>
    </>
  );
}
