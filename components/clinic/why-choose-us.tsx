import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { whyChooseUs } from '@/lib/clinic-data';

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-brand-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-brand-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Why choose us"
          title={
            <>
              Care that is <span className="text-accent-300">expert, modern and kind.</span>
            </>
          }
          description="Five commitments that shape every visit, from your first consultation to your long-term health."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 3) * 0.08} className="h-full">
                <div className="group h-full bg-brand-900 p-8 transition-colors duration-500 hover:bg-brand-800 sm:p-10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-accent-300 ring-1 ring-white/15 transition-all duration-500 group-hover:scale-110 group-hover:bg-accent-400 group-hover:text-brand-900">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-100 sm:text-base">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
