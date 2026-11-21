import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { projects } from "@/lib/sample-data";
import { ArrowLeft, MapPin, Building2, Layers, Ruler, Palette } from "lucide-react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const p = projects.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? seo(
          loaderData.title,
          `${loaderData.description} ${loaderData.category} construction project.`,
          `/projects/${params.id}`,
          "article"
        )
      : {
          meta: [
            { title: "Project unavailable | MAAK Enterprises" },
            { name: "robots", content: "noindex" },
          ],
        },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-4xl text-primary">Project not found</h1>
      <Link to="/projects" className="mt-4 inline-block text-primary underline">
        Back to projects
      </Link>
    </div>
  ),
  component: ProjectDetail,
});

function ProjectDetail() {
  const p = Route.useLoaderData();

  const specifications = [
    { label: "Project Type", value: p.category, icon: Building2 },
    { label: "Floors", value: p.floors, icon: Layers },
    { label: "Design Style", value: p.designStyle, icon: Palette },
    { label: "Ground Floor", value: p.groundFloorArea, icon: Ruler },
    { label: "Mumty Area", value: p.mumtyArea, icon: Ruler },
  ].filter((item) => item.value);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        All Projects
      </Link>

      <section className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
        <img
          src={p.image}
          alt={`${p.title} - Complete project overview`}
          className="w-full object-contain"
        />
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0">
          <p className="eyebrow">
            {p.status} · {p.category}
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-primary md:text-5xl">
            {p.title}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            {p.location}
          </p>

          <p className="mt-6 leading-7 text-muted-foreground">
            {p.description}
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-primary">
              Project Overview
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {specifications.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-lg border bg-card p-4"
                  >
                    <div className="rounded-md bg-primary/10 p-3 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-semibold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside>
          <div className="lg:sticky lg:top-24">
            <InquiryForm
              type="construction"
              reference={p.title}
              title="Plan a Similar Project"
            />
          </div>
        </aside>
      </div>
    </article>
  );
}
