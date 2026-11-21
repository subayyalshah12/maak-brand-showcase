
import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, ArrowRight, HardHat } from "lucide-react";
import hero from "@/assets/construction.jpg";
import { PageHero } from "@/components/site/PageHero";
import { ProjectCard } from "@/components/site/Cards";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/sample-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/projects")({
  head: () =>
    seo(
      "Construction Projects",
      "Explore residential and commercial construction projects by MAAK Enterprises.",
      "/projects"
    ),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  const match = useMatchRoute();
  if (match({ to: "/projects/$id" })) return <Outlet />;
  return <Projects />;
}

function Projects() {
  const [status, setStatus] = useState<"All" | "Completed" | "Ongoing">("All");
  const list = projects.filter(
    (p) => status === "All" || p.status === status
  );
  const featured = projects.find((p) => p.featured);

  return (
    <>
      <PageHero
        eyebrow="Our Portfolio"
        title="Projects built with purpose"
        image={hero}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="max-w-3xl">
          <p className="eyebrow">MAAK Enterprises</p>
          <h2 className="mt-3 text-3xl font-semibold text-primary md:text-4xl">
            Our Construction Portfolio
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Explore our residential and commercial construction work,
            architectural designs and project progress. Each project
            showcases our approach to planning, quality and execution.
          </p>
        </div>

        {featured && (
          <div className="mt-10 grid overflow-hidden rounded-xl border bg-card shadow-sm lg:grid-cols-2">
            <div className="min-h-[260px]">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-9">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                <HardHat className="mr-2 inline size-4" />
                Featured Project · {featured.status}
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-primary md:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {featured.location}
              </p>
              <p className="mt-4 leading-7 text-muted-foreground">
                {featured.description}
              </p>
              <Button asChild className="mt-6 w-fit" variant="gold">
                <a href={`/projects/${featured.id}`}>
                  Explore Project <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </div>
        )}

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-primary">
              All Projects
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse our ongoing and completed work.
            </p>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {(["All", "Completed", "Ongoing"] as const).map((s) => (
              <Button
                key={s}
                variant={status === s ? "default" : "outline"}
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {list.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-muted-foreground">
            No projects in this category yet.
          </p>
        )}
      </section>
    </>
  );
}
