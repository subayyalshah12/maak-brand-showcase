import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Bath, BedDouble, Home, MapPin, Ruler } from "lucide-react";
import { properties as sampleProperties } from "@/lib/sample-data";
import type { Property } from "@/lib/sample-data";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/realestate.jpg";
import { formatPKR, whatsappLink } from "@/lib/site";
import { InquiryForm } from "@/components/site/InquiryForm";
import { WhatsAppButton } from "@/components/site/Cards";
import { seo } from "@/lib/seo";
import { ListingImage } from "@/components/site/ListingImage";

export const Route = createFileRoute("/real-estate/$id")({
  loader: ({ params }) => {
    const p = properties.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => loaderData
    ? seo(loaderData.title, `Sample listing for layout demonstration, not a genuine company property. ${loaderData.type} in ${loaderData.location}.`, `/real-estate/${params.id}`, "article")
    : { meta: [{ title: "Property unavailable | MAAK Enterprises" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-4xl text-primary">Property not found</h1><Link to="/real-estate" className="mt-4 inline-block text-primary underline">Back to properties</Link></div>
  ),
  component: PropertyDetail,
});

function PropertyDetail() {
  const p = Route.useLoaderData();
  const wa = whatsappLink(`Hello, I'm interested in "${p.title}" (${p.location}).`);
  const facts = [
    { icon: Home, label: "Type", value: p.type },
    { icon: Ruler, label: "Size", value: p.size },
    { icon: BedDouble, label: "Bedrooms", value: p.bedrooms || "—" },
    { icon: Bath, label: "Bathrooms", value: p.bathrooms || "—" },
  ];
  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/real-estate" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />All properties</Link>
      <div className="mt-6 overflow-hidden rounded-lg"><ListingImage kind="property" referenceId={p.id} src={p.image} alt={p.title} width={1280} height={896} className="aspect-[16/8] w-full object-cover" /></div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <span className="rounded bg-primary px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">For {p.purpose}</span>
          <h1 className="mt-3 text-4xl font-semibold text-primary md:text-5xl">{p.title}</h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground"><MapPin className="size-4" />{p.location}</p>
          <p className="mt-4 text-3xl font-bold text-primary">{formatPKR(p.price)}{p.purpose === "rent" && <span className="text-base font-normal text-muted-foreground"> / month</span>}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-lg border border-border bg-card p-4">
                <f.icon className="size-5 text-gold" /><dt className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{f.label}</dt><dd className="font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
          <h2 className="mt-10 text-2xl font-semibold text-primary">Description</h2>
          <p className="mt-3 text-muted-foreground">{p.description}</p>
          <div className="mt-8"><WhatsAppButton href={wa} /></div>
        </div>
        <aside><InquiryForm type="real_estate" reference={p.title} title="Ask about this property" /></aside>
      </div>
    </article>
  );
}
