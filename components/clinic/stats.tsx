'use client';

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { stats } from '@/lib/clinic-data';

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(reduceMotion ? value : 0);
  const display = useTransform(count, (latest) => Math.round(latest).toLocaleString('en-US'));

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(count, value, { duration: 2, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, count, value, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section aria-label="Clinic statistics" className="relative bg-brand-600">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(111,209,194,0.25),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 py-16 sm:px-8 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="px-4 py-8 text-center sm:px-8 lg:border-l lg:border-white/15 lg:first:border-l-0"
          >
            <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-sm font-medium text-brand-100 sm:text-base">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
