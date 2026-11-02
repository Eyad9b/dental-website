'use client';

import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone, Send, Loader2 } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { contactSchema } from '@/lib/contact-schema';
import { clinic } from '@/lib/clinic-data';
import { postJson } from '@/lib/post-json';
import { FormField, inputClassName } from './form-field';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

type FormValues = { fullName: string; email: string; message: string };
type FieldErrors = Partial<Record<keyof FormValues, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const emptyValues: FormValues = { fullName: '', email: '', message: '' };

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              We would love to <span className="text-brand-500">hear from you.</span>
            </>
          }
          description="Send us a question or visit us in person. Our front desk team replies within one business day."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <ContactDetails />
            <MapPanel />
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactDetails() {
  const items = [
    { icon: MapPin, label: 'Visit us', value: clinic.address },
    { icon: Phone, label: 'Call us', value: clinic.phone, href: clinic.phoneHref },
    { icon: Mail, label: 'Email us', value: clinic.email, href: `mailto:${clinic.email}` },
  ];

  return (
    <Reveal className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
      {items.map(({ icon: Icon, label, value, href }) => {
        const content = (
          <>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
            <span className="mt-1 block break-words text-sm font-bold text-brand-900 sm:text-base">{value}</span>
          </>
        );
        const className =
          'group block rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md';
        return href ? (
          <a key={label} href={href} className={className}>
            {content}
          </a>
        ) : (
          <div key={label} className={className}>
            {content}
          </div>
        );
      })}
      <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5 sm:col-span-3 lg:col-span-1 xl:col-span-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Clock className="h-4 w-4" aria-hidden="true" />
          Opening hours
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {clinic.hours.map((slot) => (
            <li key={slot.day}>
              <p className="text-xs font-medium text-slate-500">{slot.day}</p>
              <p className="text-sm font-bold text-brand-900">{slot.time}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function MapPanel() {
  return (
    <Reveal delay={0.1}>
      <div className="group relative overflow-hidden rounded-3xl border border-brand-100 bg-brand-100 shadow-sm">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full text-brand-200 transition-transform duration-1000 ease-out group-hover:scale-105"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 600 340"
        >
          <rect width="600" height="340" fill="#e6f1f8" />
          <g stroke="currentColor" strokeWidth="14" fill="none" strokeLinecap="round">
            <path d="M-20 90 C 150 60, 300 130, 620 80" />
            <path d="M-20 240 C 180 280, 380 200, 620 260" />
            <path d="M160 -20 C 190 120, 130 220, 200 360" />
            <path d="M430 -20 L 470 360" />
          </g>
          <g stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.9">
            <path d="M-20 170 L 620 150" />
            <path d="M320 -20 L 300 360" />
            <path d="M60 -20 L 80 360" />
          </g>
          <rect x="60" y="200" width="70" height="40" rx="8" fill="#cde5f2" />
          <rect x="380" y="110" width="90" height="46" rx="8" fill="#d3f2ec" />
        </svg>

        <div className="relative flex h-80 flex-col justify-between p-6 sm:h-96">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-800 shadow-sm backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            Riverside, Harbor District
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute -inset-4 animate-ping rounded-full bg-brand-500/30" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-900/30 ring-4 ring-white transition-transform duration-300 group-hover:scale-110">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <div>
              <p className="text-sm font-bold text-brand-900">{clinic.name}</p>
              <p className="text-xs text-slate-600">{clinic.address}</p>
            </div>
            <a
              href={clinic.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-700"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Get directions
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function ContactForm() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  const updateField =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((previous) => ({ ...previous, [field]: event.target.value }));
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormValues | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setServerError('');
    setStatus('submitting');

    const result = await postJson('/api/contact', values);
    if (result.ok) {
      setValues(emptyValues);
      setStatus('success');
    } else {
      setServerError(result.error);
      setStatus('error');
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <Reveal delay={0.15}>
      <div className="h-full rounded-3xl border border-brand-100 bg-gradient-to-b from-white to-brand-50/50 p-6 shadow-sm sm:p-10">
        {status === 'success' ? (
          <div role="status" className="flex h-full flex-col items-center justify-center py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-600">
              <MessageCircle className="h-7 w-7" aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-xl font-bold text-brand-900">Message sent</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
              Thank you for reaching out. We will reply to your email within one business day.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-8 rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <h3 className="text-xl font-bold text-brand-900">Send us a message</h3>

            <FormField label="Full name" htmlFor="contact-name" error={errors.fullName} required>
              <input
                id="contact-name"
                name="fullName"
                autoComplete="name"
                value={values.fullName}
                onChange={updateField('fullName')}
                aria-invalid={Boolean(errors.fullName)}
                placeholder="Jane Doe"
                className={inputClassName}
              />
            </FormField>

            <FormField label="Email" htmlFor="contact-email" error={errors.email} required>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={updateField('email')}
                aria-invalid={Boolean(errors.email)}
                placeholder="jane@example.com"
                className={inputClassName}
              />
            </FormField>

            <FormField label="Message" htmlFor="contact-message" error={errors.message} required>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={updateField('message')}
                aria-invalid={Boolean(errors.message)}
                placeholder="How can we help you?"
                className={`${inputClassName} resize-y`}
              />
            </FormField>

            {status === 'error' && serverError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-5 w-5" aria-hidden="true" />
              )}
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </Reveal>
  );
}
