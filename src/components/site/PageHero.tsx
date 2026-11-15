export function PageHero({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro?: string; image: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep">
      <img src={image} alt="" width={1280} height={896} className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="hero-overlay absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-primary-foreground animate-rise md:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-primary-foreground/85 animate-rise">{intro}</p>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold text-primary md:text-5xl">{title}</h2>
      <span className="gold-rule mt-4" />
      {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
    </div>
  );
}
