'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BadgeCheck, CalendarClock, Star } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { HeroSmile } from './hero-smile';

const HERO_IMAGE =
  'https://images.pexels.com/photos/3845553/pexels-photo-3845553.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-brand-50 pt-28 pb-20 sm:pt-32"
    >
      <motion.div
        className="absolute inset-0 -z-10 h-[120%] -top-[10%]"
        style={reduceMotion ? undefined : { y: imageY }}
      >
        <Image
          src={HERO_IMAGE}
          alt="A dentist reviewing a treatment plan with a smiling patient in a bright clinic"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-200/50 blur-3xl animate-float-slow" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-10 -z-10 h-72 w-72 rounded-full bg-brand-200/60 blur-3xl animate-float-slow [animation-delay:-4s]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <motion.div
          style={reduceMotion ? undefined : { y: contentY, opacity: fade }}
          className="lg:col-span-7"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 shadow-sm backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
            </span>
            Now accepting new patients
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-brand-900 sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Expert care for a smile you&apos;re proud to share.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            Gentle, modern dentistry from a team that puts your comfort first. From routine check-ups to
            complete smile makeovers, we explain every step so you can feel confident in your care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-brand-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-2xl"
            >
              Book Appointment
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white/80 px-7 py-4 text-base font-semibold text-brand-800 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:bg-white"
            >
              Contact Us
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[
                'https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
                'https://images.pexels.com/photos/6102841/pexels-photo-6102841.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
                'https://images.pexels.com/photos/35490806/pexels-photo-35490806.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
              ].map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5" aria-label="Rated 4.9 out of 5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>
              <p className="text-sm font-medium text-slate-700">Rated 4.9 by 1,800+ patients</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative flex h-[28rem] items-center justify-center lg:col-span-5 lg:h-[32rem]">
          <HeroSmile />
          <motion.div
            initial={{ opacity: 0, x: 24, y: -12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="absolute -right-2 top-0 hidden animate-float rounded-2xl sm:block border border-white/70 bg-white/70 px-5 py-4 shadow-xl shadow-brand-900/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-brand-900">Board-certified</p>
                <p className="text-xs text-slate-600">Specialist dentists</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="absolute -left-2 bottom-4 hidden animate-float-slow rounded-2xl sm:block border border-white/70 bg-white/70 px-5 py-4 shadow-xl shadow-brand-900/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <CalendarClock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-brand-900">Same-day visits</p>
                <p className="text-xs text-slate-600">Emergency slots daily</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
