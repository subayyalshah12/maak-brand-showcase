import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/construction.jpg";
import { PageHero } from "@/components/site/PageHero";
import { ProjectCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/sample-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/projects")({
  head: () => seo("Construction Projects", "Completed and ongoing construction projects by MAAK Enterprises in Rawalpindi and Islamabad.", "/projects"),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  const match = useMatchRoute();
  if (match({ to: "/projects/$id" })) return <Outlet />;
  return <Projects />;
}

function Projects() {
  const [status, setStatus] = useState<"All" | "Completed" | "Ongoing">("All");
  const list = projects.filter((p) => status === "All" || p.status === status);
  return (
    <>
      <PageHero eyebrow="Projects" title="Our construction work" image={hero} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {(["All", "Completed", "Ongoing"] as const).map((s) => (
            <Button key={s} variant={status === s ? "default" : "outline"} aria-pressed={status === s} onClick={() => setStatus(s)}>{s}</Button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Projects marked [Sample] are placeholders.</p>
        {list.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
        ) : <p className="mt-10 text-center text-muted-foreground">No projects in this category yet.</p>}
      </section>
    </>
  );
}
