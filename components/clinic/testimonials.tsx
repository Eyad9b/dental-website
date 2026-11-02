'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { testimonials } from '@/lib/clinic-data';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

const AUTO_ADVANCE_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;
  const current = testimonials[index];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % total), AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  const goTo = (next: number) => setIndex((next + total) % total);

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-white py-24 sm:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              Stories from patients who <span className="text-brand-500">smile more now.</span>
            </>
          }
          description="Real experiences from people who trusted us with their care."
        />

        <Reveal delay={0.1} className="mt-16">
          <div className="relative mx-auto grid max-w-5xl gap-8 overflow-hidden rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-accent-50 p-8 shadow-xl shadow-brand-900/5 sm:p-12 md:grid-cols-[minmax(0,1fr)_16rem] md:items-center">
            <Quote className="absolute right-8 top-8 h-20 w-20 text-brand-100" aria-hidden="true" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current.name}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="flex items-center gap-0.5" aria-label={`Rated ${current.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`h-5 w-5 ${starIndex < current.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-6 text-xl font-medium leading-relaxed text-brand-900 sm:text-2xl">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <p className="mt-8 text-base font-bold text-brand-900">{current.name}</p>
                <p className="text-sm font-medium text-accent-600">Patient, {current.treatment}</p>
              </motion.div>
            </AnimatePresence>

            <div className="relative flex flex-col items-center gap-6 md:items-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.image}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45 }}
                  className="relative h-40 w-40 overflow-hidden rounded-3xl shadow-xl shadow-brand-900/15 sm:h-48 sm:w-48"
                >
                  <Image src={current.image} alt={`Portrait of ${current.name}`} fill sizes="12rem" className="object-cover" />
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 transition-all hover:-translate-x-0.5 hover:bg-brand-50"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Next testimonial"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition-all hover:translate-x-0.5 hover:bg-brand-700"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((testimonial, dotIndex) => (
              <button
                key={testimonial.name}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`Show testimonial from ${testimonial.name}`}
                onClick={() => goTo(dotIndex)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  dotIndex === index ? 'w-8 bg-brand-600' : 'w-2.5 bg-brand-200 hover:bg-brand-400'
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
