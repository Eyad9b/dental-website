import Image from 'next/image';
import { BadgeCheck, GraduationCap, HeartHandshake } from 'lucide-react';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

const credentials = [
  'Doctor of Dental Surgery, Riverside University',
  'Fellow, International Academy of Cosmetic Dentistry',
  'Advanced implantology and sedation certified',
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 overflow-hidden bg-brand-50/60 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative mx-auto max-w-lg">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-brand-900/15">
              <Image
                src="https://images.pexels.com/photos/37458054/pexels-photo-37458054.jpeg?auto=compress&cs=tinysrgb&w=900&h=1125&fit=crop"
                alt="Dr. Helena Marsh smiling in the treatment room"
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 w-56 overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:-right-10">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.pexels.com/photos/305567/pexels-photo-305567.jpeg?auto=compress&cs=tinysrgb&w=600&h=450&fit=crop"
                  alt="The modern treatment room at Crestview Dental"
                  fill
                  sizes="14rem"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -left-4 top-8 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-xl backdrop-blur-xl sm:-left-8">
              <span className="text-3xl font-bold text-brand-600">18</span>
              <span className="text-xs font-semibold uppercase leading-snug tracking-wider text-brand-800">
                Years of
                <br />
                trusted care
              </span>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            align="left"
            eyebrow="About our clinic"
            title={
              <>
                A calm, modern practice built on <span className="text-brand-500">trust.</span>
              </>
            }
          />
          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              Dr. Helena Marsh founded Crestview Dental with one belief: a visit to the dentist should feel
              calm, clear and considerate. Her team combines advanced technology with a gentle approach, so
              every patient understands their options and feels in control.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Our mission is simple. Deliver the highest standard of care, explain every decision honestly,
              and help you keep a healthy, confident smile for life.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-8 space-y-4">
              {credentials.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-100 text-accent-600">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-slate-700 sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <GraduationCap className="h-6 w-6 text-brand-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-brand-900">Certified specialists</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <HeartHandshake className="h-6 w-6 text-accent-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-brand-900">Patient-first approach</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
