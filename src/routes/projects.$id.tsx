import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { projects } from "@/lib/sample-data";
import { InquiryForm } from "@/components/site/InquiryForm";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const p = projects.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => loaderData
    ? seo(loaderData.title.replace("[Sample] ", ""), `${loaderData.category} construction project in ${loaderData.location} — ${loaderData.status}.`, `/projects/${params.id}`, "article")
    : { meta: [{ title: "Project unavailable | MAAK Enterprises" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-4xl text-primary">Project not found</h1><Link to="/projects" className="mt-4 inline-block text-primary underline">Back to projects</Link></div>
  ),
  component: ProjectDetail,
});

function ProjectDetail() {
  const p = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" />All projects</Link>
      <div className="mt-6 overflow-hidden rounded-lg"><img src={p.image} alt={p.title} width={1280} height={896} className="aspect-[16/8] w-full object-cover" /></div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="eyebrow">{p.status} · {p.category}</p>
          <h1 className="mt-3 text-4xl font-semibold text-primary md:text-5xl">{p.title}</h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground"><MapPin className="size-4" />{p.location}</p>
          <p className="mt-6 text-muted-foreground">{p.description}</p>
        </div>
        <aside><InquiryForm type="construction" reference={p.title} title="Plan a similar project" /></aside>
      </div>
    </article>
  );
}
