import { ArrowRight } from 'lucide-react';
import { services, type Service } from '@/lib/clinic-data';
import { photoUrl } from '@/lib/site-images';
import { Photo } from './photo';
import { Reveal } from './reveal';

// Display order for the bento: flagship treatment first (the large tile), urgent care last (the wide strip).
const ORDER = [
  'Dental Implants',
  'Cosmetic Dentistry',
  'Orthodontics',
  'Teeth Whitening',
  'Root Canal Treatment',
  'Emergency Dental Care',
];

type Layout = { span: string; title: string; size: [number, number]; showDescription: boolean };

function layoutFor(index: number): Layout {
  if (index === 0)
    return { span: 'sm:col-span-2 sm:row-span-2 lg:col-span-2', title: 'text-3xl sm:text-4xl', size: [1100, 1100], showDescription: true };
  if (index === 5)
    return { span: 'sm:col-span-2 lg:col-span-4', title: 'text-2xl sm:text-3xl', size: [1600, 560], showDescription: true };
  return { span: '', title: 'text-xl sm:text-2xl', size: [700, 700], showDescription: false };
}

function Tile({ service, index }: { service: Service; index: number }) {
  const l = layoutFor(index);
  return (
    <Reveal delay={(index % 4) * 0.07} className={`${l.span} h-full`}>
      <a
        href="#book"
        aria-label={`${service.title}: book this treatment`}
        className="group relative block h-full overflow-hidden rounded-3xl bg-[#101a24] shadow-[0_20px_40px_-24px_rgba(20,30,40,0.6)] transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
      >
        <Photo
          src={photoUrl(service.photo, l.size[0], l.size[1])}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#050a10]/90 via-[#050a10]/35 to-[#050a10]/10" />

        <span className="absolute right-6 top-5 text-sm font-semibold tabular-nums text-white/60">0{index + 1}</span>

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <h3 className={`${l.title} max-w-md font-semibold leading-[1.1] tracking-[-0.02em] text-white`}>{service.title}</h3>
          {l.showDescription && (
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">{service.description}</p>
          )}
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-white/75 transition-colors group-hover:text-white">
            {service.kicker}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
          </p>
        </div>
      </a>
    </Reveal>
  );
}

export function Services() {
  const ordered = ORDER.map((title) => services.find((s) => s.title === title)).filter((s): s is Service => Boolean(s));

  return (
    <section id="services" className="scroll-mt-24 bg-[#f1ece4] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-600">Our services</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-brand-900 sm:text-5xl lg:text-6xl">
              Find the care <span className="text-brand-500">you need.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
            From preventive check-ups to advanced restorations, every treatment is delivered with precision, comfort and
            clear communication.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[17rem] gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 sm:auto-rows-[16rem] lg:grid-cols-4">
          {ordered.map((service, i) => (
            <Tile key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
