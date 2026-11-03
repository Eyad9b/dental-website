'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BadgeCheck, CalendarClock, Star } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// three.js is loaded only on the client, after the headline has painted.
const HeroCanvas = dynamic(() => import('./hero-3d/hero-canvas'), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();
  // Text follows the camera move so the opening reads as one sequence.
  const at = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay: reduceMotion ? 0 : delay, ease },
  });

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-[#051019] text-white lg:flex lg:min-h-[100svh] lg:items-center"
    >
      {/* atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(70%_80%_at_72%_46%,rgba(42,134,187,0.30),transparent_68%),radial-gradient(40%_50%_at_88%_80%,rgba(60,185,168,0.16),transparent_70%),linear-gradient(180deg,#07192a_0%,#051019_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#051019] to-transparent" />

      {/* 3D model: its own block on mobile, full-bleed behind the copy on desktop */}
      <div className="relative -z-10 mt-20 h-[24rem] sm:h-[30rem] lg:absolute lg:inset-0 lg:mt-0 lg:h-full">
        <HeroCanvas />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-4 sm:px-8 lg:pb-20 lg:pt-32">
        <div className="max-w-xl lg:max-w-[34rem]">
          <motion.p {...at(1.1)} className="inline-flex items-center gap-2.5 text-sm font-medium text-brand-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
            </span>
            Now accepting new patients
          </motion.p>

          <motion.h1
            {...at(1.2)}
            className="mt-6 text-4xl font-semibold leading-[1.06] tracking-[-0.025em] sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            Expert care for a smile you&apos;re proud to share.
          </motion.h1>

          <motion.p {...at(1.35)} className="mt-6 max-w-md text-base leading-relaxed text-brand-100/80 sm:text-lg">
            Gentle, modern dentistry from a team that puts your comfort first. From routine check-ups to complete smile
            makeovers, we explain every step so you can feel confident in your care.
          </motion.p>

          <motion.div {...at(1.5)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-400 px-7 py-4 text-base font-semibold text-[#04202a] shadow-xl shadow-accent-400/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Book Appointment
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Us
            </a>
          </motion.div>

          <motion.div {...at(1.7)} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[
                  'https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
                  'https://images.pexels.com/photos/6102841/pexels-photo-6102841.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
                  'https://images.pexels.com/photos/35490806/pexels-photo-35490806.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
                ].map((src) => (
                  <Image key={src} src={src} alt="" width={40} height={40} className="h-10 w-10 rounded-full border-2 border-[#07192a] object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5" aria-label="Rated 4.9 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm text-brand-100/80">Rated 4.9 by 1,800+ patients</p>
              </div>
            </div>
            <p className="flex items-center gap-2 text-sm text-brand-100/80">
              <BadgeCheck className="h-5 w-5 text-accent-400" aria-hidden="true" />
              Board-certified specialists
            </p>
            <p className="flex items-center gap-2 text-sm text-brand-100/80">
              <CalendarClock className="h-5 w-5 text-accent-400" aria-hidden="true" />
              Same-day emergency visits
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
