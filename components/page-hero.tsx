import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

type PageHeroProps = {
  title: string;
  description: string;
  backgroundImage?: string;
  breadcrumb?: string;
};

export function PageHero({ title, description, backgroundImage, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-28">
      {/* Background image with overlay */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/75" />
        </div>
      )}

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Gradient accent */}
      <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="container-shell relative max-w-4xl">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-300">{breadcrumb}</span>
          </div>
        )}

        {/* Brand badge */}
        <div className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sky-200">
          <BrandLogo size="sm" withText={false} />
          <span className="ml-2 text-xs font-semibold uppercase tracking-[0.18em]">Intentness Consultancy</span>
        </div>

        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{description}</p>
      </div>
    </section>
  );
}
