import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import hero from "@/assets/realestate.jpg";
import { PageHero } from "@/components/site/PageHero";
import { PropertyCard } from "@/components/site/Cards";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { properties } from "@/lib/sample-data";
import { seo } from "@/lib/seo";
import { filterProperties } from "@/lib/property-search";
import { SITE, contactWhatsappLink } from "@/lib/site";
export const Route = createFileRoute("/real-estate")({
  head: () => seo("Real Estate — Properties for Sale & Rent", "Browse houses, apartments, plots and commercial properties for sale and rent in Islamabad and Rawalpindi with MAAK Enterprises.", "/real-estate"),
  component: RealEstateLayout,
});

function RealEstateLayout() {
  const match = useMatchRoute();
  if (match({ to: "/real-estate/$id" })) return <Outlet />;
  return <RealEstate />;
}

const selectCls = "h-10 rounded-md border border-input bg-background px-3 text-sm";

function RealEstate() {
  const [q, setQ] = useState("");
  const [purpose, setPurpose] = useState("all");
  const [type, setType] = useState("all");
  const [beds, setBeds] = useState("0");
  const list = useMemo(() => filterProperties(properties, { q, purpose, type, beds }), [q, purpose, type, beds]);
  const reset = () => { setQ(""); setPurpose("all"); setType("all"); setBeds("0"); };

  return (
    <>
      <PageHero eyebrow="Real estate" title="Find your next property" intro="Homes, plots and commercial spaces for sale and rent. Contact: Uzair Kazmi, Gulberg Greens, Islamabad." image={hero} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div role="search" className="grid gap-3 rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-card)] md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <label className="relative"><span className="sr-only">Search</span>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or location" className="h-10 pl-9" />
          </label>
          <select aria-label="Sale or rent" className={selectCls} value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option value="all">Sale & rent</option><option value="sale">For sale</option><option value="rent">For rent</option>
          </select>
          <select aria-label="Property type" className={selectCls} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option><option>House</option><option>Apartment</option><option>Plot</option><option>Commercial</option>
          </select>
          <select aria-label="Bedrooms" className={selectCls} value={beds} onChange={(e) => setBeds(e.target.value)}>
            <option value="0">Any beds</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="5">5+</option>
          </select>
          <Button variant="outline" className="h-10" onClick={reset}>Reset</Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{list.length} {list.length === 1 ? "property" : "properties"} · Listings marked [Sample] are placeholders.</p>
        {list.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-lg font-semibold text-primary">No properties match your search</p>
            <Button variant="link" onClick={reset}>Clear filters</Button>
          </div>
        )}
      </section>
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Real Estate Contact
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-primary">
            Uzair Ali Kazmi
          </h2>

          <p className="mt-2 text-muted-foreground">
            Chief Executive Officer (CEO)
          </p>

          <p className="mt-2 text-muted-foreground">03315342214</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href="tel:03315342214">Call Now</a>
            </Button>

            <Button asChild variant="outline">
              <a
                href={contactWhatsappLink(
                  "03315342214",
                  "Hello, I would like to discuss a real estate requirement with MAAK Enterprises."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
