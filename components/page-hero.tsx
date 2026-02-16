export function PageHero({ title, description }: { title: string; description: string }) {
  return (
    <section className="section-pad border-b border-slate-200/70">
      <div className="container-shell max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight text-base sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-slate-600">{description}</p>
      </div>
    </section>
  );
}
