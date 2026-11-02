import { ArrowUpRight } from 'lucide-react';
import { services } from '@/lib/clinic-data';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Our services"
          title={
            <>
              Comprehensive dentistry, <span className="text-brand-500">under one roof.</span>
            </>
          }
          description="From preventive check-ups to advanced restorations, every treatment is delivered with precision, comfort and clear communication."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={(index % 3) * 0.08}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-brand-100/80 bg-gradient-to-b from-white to-brand-50/60 p-8 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/10">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-100/0 blur-2xl transition-all duration-500 group-hover:bg-accent-100/80" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="relative mt-6 text-xl font-bold text-brand-900">{service.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{service.description}</p>
                  <a
                    href="#book"
                    className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-500"
                  >
                    Book this treatment
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
