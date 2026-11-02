'use client';

import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { galleryItems } from '@/lib/clinic-data';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const total = galleryItems.length;
  const active = activeIndex !== null ? galleryItems[activeIndex] : null;

  const step = (delta: number) => {
    setActiveIndex((value) => (value === null ? null : (value + delta + total) % total));
  };

  return (
    <section id="gallery" className="scroll-mt-24 bg-brand-50/60 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title={
            <>
              Real smiles, <span className="text-brand-500">real transformations.</span>
            </>
          }
          description="Browse a selection of results from our patients. Select any photo to view it larger."
        />

        <div className="mt-16 grid auto-rows-[14rem] grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <Reveal
              key={item.title}
              delay={(index % 3) * 0.08}
              className={index === 0 || index === 4 ? 'row-span-2' : ''}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View larger: ${item.title}`}
                className="group relative h-full w-full overflow-hidden rounded-3xl bg-brand-100 text-left shadow-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-brand-900/20"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">{item.category}</p>
                    <p className="mt-1 text-base font-bold text-white sm:text-lg">{item.title}</p>
                  </div>
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-brand-700">
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-4xl border-0 bg-brand-900 p-0 text-white sm:rounded-3xl">
          {active && (
            <>
              <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
                <Image
                  key={active.image}
                  src={active.image}
                  alt={active.title}
                  fill
                  sizes="(min-width: 1024px) 60rem, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div>
                  <DialogTitle className="text-lg font-bold">{active.title}</DialogTitle>
                  <DialogDescription className="text-sm text-brand-100">
                    {active.category} | {(activeIndex ?? 0) + 1} of {total}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
