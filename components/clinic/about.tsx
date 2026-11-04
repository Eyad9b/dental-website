'use client';

import { ArrowRight, GraduationCap, HeartHandshake } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from './reveal';
import { ToothStudy, type StudyMode, type StudyName } from './tooth-studies';

const credentials = [
  'Doctor of Dental Surgery, Riverside University',
  'Fellow, International Academy of Cosmetic Dentistry',
  'Advanced implantology and sedation certified',
];

const CAPTIONS: Record<StudyMode, Record<StudyName, string>> = {
  amber: {
    incisor: 'Enamel, labial view',
    canine: 'Dentin and pulp canal',
    section: 'Rods, cross-section',
    crowns: 'Crown surface texture',
  },
  uv: {
    incisor: 'Enamel under UV light',
    canine: 'Dentin fluorescence',
    section: 'Rods under UV',
    crowns: 'Surface under UV light',
  },
};

function Panel({
  study,
  mode,
  className = '',
  delay = 0,
}: {
  study: StudyName;
  mode: StudyMode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <figure className="group relative h-full w-full overflow-hidden bg-black shadow-[0_18px_40px_-18px_rgba(40,28,16,0.55)] transition-transform duration-700 ease-out hover:-translate-y-1.5">
        {(['amber', 'uv'] as const).map((m) => (
          <div
            key={m}
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-in-out ${mode === m ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="h-full w-full transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]">
              <ToothStudy study={study} mode={m} />
            </div>
          </div>
        ))}
        <figcaption className="pointer-events-none absolute bottom-3 left-3 hidden text-[10px] sm:block font-semibold uppercase tracking-[0.18em] text-white/60">
          {CAPTIONS[mode][study]}
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function About() {
  const [mode, setMode] = useState<StudyMode>('amber');

  return (
    <section id="about" className="scroll-mt-24 overflow-hidden bg-[#f8f3ee] py-24 sm:py-32">
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

        {/* collage */}
        <div>
          <div className="mx-auto grid max-w-xl grid-cols-[1.12fr_1fr] gap-3 sm:gap-4 lg:max-w-none">
            <div className="flex flex-col gap-3 sm:gap-4">
              <Panel study="incisor" mode={mode} className="aspect-[3/4.3]" />
              <Panel study="section" mode={mode} delay={0.15} className="aspect-[3/2] w-[68%] self-end" />
            </div>
            <div className="flex flex-col gap-3 pt-10 sm:gap-4 sm:pt-14">
              <Panel study="canine" mode={mode} delay={0.1} className="aspect-[11/17] w-[82%]" />
              <Panel study="crowns" mode={mode} delay={0.25} className="aspect-square" />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-end">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">View under</span>
            <div role="group" aria-label="Lighting for tooth studies" className="flex rounded-full border border-brand-900/15 bg-white/60 p-1">
              {(
                [
                  ['amber', 'Natural light'],
                  ['uv', 'Fluorescence'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mode === value}
                  onClick={() => setMode(value)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 ${
                    mode === value ? 'bg-brand-900 text-white' : 'text-brand-800 hover:text-brand-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
