import { faqs } from '@/lib/clinic-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Faq() {
  return (
    <section className="bg-brand-50/60 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title={
              <>
                Questions, <span className="text-brand-500">answered.</span>
              </>
            }
            description="Everything you need to know before your first visit. Can't find your answer? Call or message us anytime."
          />
        </div>

        <Reveal delay={0.1} className="lg:col-span-8">
          <Accordion type="single" collapsible className="rounded-3xl border border-brand-100 bg-white px-6 shadow-sm sm:px-10">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="border-brand-100 last:border-b-0">
                <AccordionTrigger className="text-left text-base font-semibold text-brand-900 hover:text-brand-600 hover:no-underline sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
