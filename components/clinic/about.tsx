import { ArrowRight, GraduationCap, HeartHandshake } from 'lucide-react';
import { photos, photoUrl, type PhotoRef } from '@/lib/site-images';
import { Photo } from './photo';
import { Reveal } from './reveal';

const credentials = [
  'Doctor of Dental Surgery, Riverside University',
  'Fellow, International Academy of Cosmetic Dentistry',
  'Advanced implantology and sedation certified',
];

function Panel({
  photo,
  size,
  className = '',
  delay = 0,
}: {
  photo: PhotoRef;
  size: [number, number];
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <figure className="group relative h-full w-full overflow-hidden bg-[#0b1218] shadow-[0_18px_40px_-18px_rgba(20,30,40,0.55)] transition-transform duration-700 ease-out hover:-translate-y-1.5">
        <Photo
          src={photoUrl(photo, size[0], size[1])}
          className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
        />
      </figure>
    </Reveal>
  );
}

export function About() {
  return (
    <section id="about" className="scroll-mt-24 overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* copy */}
        <div>
          <Reveal>
            <p className="text-sm font-semibold text-brand-600">About our clinic</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-brand-900 sm:text-5xl lg:text-[3.5rem]">
              A calm, modern practice built on <span className="text-brand-500">trust.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Dr. Helena Marsh founded Crestview Dental with one belief: a visit to the dentist should feel calm,
              clear and considerate. Her team combines advanced technology with a gentle approach, so every patient
              understands their options and feels in control.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Our mission is simple. Deliver the highest standard of care, explain every decision honestly, and help
              you keep a healthy, confident smile for life.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex items-end gap-5 border-t border-brand-900/10 pt-8">
              <span className="text-7xl font-semibold leading-none tracking-tight text-brand-900">18</span>
              <span className="pb-1.5 text-sm font-semibold leading-snug text-brand-700">
                years of
                <br />
                trusted care
              </span>
            </div>
            <ul className="mt-8 divide-y divide-brand-900/10 border-y border-brand-900/10">
              {credentials.map((item, i) => (
                <li key={item} className="flex items-baseline gap-5 py-4">
                  <span className="text-xs font-semibold tabular-nums text-brand-500">0{i + 1}</span>
                  <span className="text-sm font-medium text-slate-700 sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-900/15 px-4 py-2 text-sm font-semibold text-brand-900">
                <GraduationCap className="h-4 w-4 text-brand-600" aria-hidden="true" />
                Certified specialists
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-900/15 px-4 py-2 text-sm font-semibold text-brand-900">
                <HeartHandshake className="h-4 w-4 text-accent-600" aria-hidden="true" />
                Patient-first approach
              </span>
              <a
                href="#book"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
              >
                Book a consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* photo collage */}
        <div className="mx-auto grid w-full max-w-xl grid-cols-[1.12fr_1fr] gap-3 sm:gap-4 lg:max-w-none">
          <div className="flex flex-col gap-3 sm:gap-4">
            <Panel photo={photos.aboutSmile} size={[800, 1150]} className="aspect-[3/4.3]" />
            <Panel photo={photos.aboutConsult} size={[700, 470]} delay={0.15} className="aspect-[3/2] w-[68%] self-end" />
          </div>
          <div className="flex flex-col gap-3 pt-10 sm:gap-4 sm:pt-14">
            <Panel photo={photos.aboutCare} size={[660, 1020]} delay={0.1} className="aspect-[11/17] w-[82%]" />
            <Panel photo={photos.aboutXray} size={[800, 800]} delay={0.25} className="aspect-square" />
          </div>
        </div>
      </div>
    </section>
  );
}
