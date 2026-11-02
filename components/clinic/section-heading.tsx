import type { ReactNode } from 'react';
import { Reveal } from './reveal';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
};

export function SectionHeading({ eyebrow, title, description, align = 'center', tone = 'light' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left';
  const isDark = tone === 'dark';

  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      <p
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
          isDark ? 'border-white/15 bg-white/10 text-accent-300' : 'border-brand-100 bg-white text-brand-600'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-5 text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl ${
          isDark ? 'text-white' : 'text-brand-900'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${isDark ? 'text-brand-100' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
