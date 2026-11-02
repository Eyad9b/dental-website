'use client';

import { CalendarCheck, CheckCircle2, Loader2, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { appointmentSchema, TREATMENTS } from '@/lib/appointment-schema';
import { clinic } from '@/lib/clinic-data';
import { postJson } from '@/lib/post-json';
import { FormField, inputClassName } from './form-field';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  treatment: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const emptyValues: FormValues = {
  fullName: '',
  email: '',
  phone: '',
  preferredDate: '',
  treatment: '',
  message: '',
};

const benefits = [
  'Confirmation within one business day',
  'Choose the treatment and time that suits you',
  'Transparent quotes before any work begins',
];

export function BookingSection() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    setMinDate(new Date().toLocaleDateString('en-CA'));
  }, []);

  const updateField =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((previous) => ({ ...previous, [field]: event.target.value }));
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = appointmentSchema.safeParse(values);
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

    const result = await postJson('/api/appointments', values);
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
    <section id="book" className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-white via-brand-50/70 to-white py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-accent-100/60 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            align="left"
            eyebrow="Book an appointment"
            title={
              <>
                Your next healthy smile starts <span className="text-brand-500">with one request.</span>
              </>
            }
            description="Tell us what you need and when you would like to visit. Our team will confirm your appointment personally."
          />

          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-slate-700 sm:text-base">
                  <CheckCircle2 className="h-5 w-5 flex-none text-accent-500" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href={clinic.phoneHref}
                className="group flex items-center gap-3 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-medium text-slate-500">Call the clinic</span>
                  <span className="block text-sm font-bold text-brand-900">{clinic.phone}</span>
                </span>
              </a>
              <a
                href={clinic.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500 text-white">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-medium text-slate-500">Message on WhatsApp</span>
                  <span className="block text-sm font-bold text-brand-900">Chat with our team</span>
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl shadow-brand-900/10 backdrop-blur sm:p-10">
            {status === 'success' ? (
              <div className="flex flex-col items-center py-10 text-center" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-600">
                  <CalendarCheck className="h-8 w-8" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-brand-900">Thank you, your request is in.</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
                  Our team will review your preferred date and contact you within one business day to confirm
                  your appointment.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-8 rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                >
                  Book another appointment
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <FormField label="Full name" htmlFor="booking-name" error={errors.fullName} required>
                  <input
                    id="booking-name"
                    name="fullName"
                    autoComplete="name"
                    value={values.fullName}
                    onChange={updateField('fullName')}
                    aria-invalid={Boolean(errors.fullName)}
                    placeholder="Jane Doe"
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Email" htmlFor="booking-email" error={errors.email} required>
                  <input
                    id="booking-email"
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

                <FormField label="Phone" htmlFor="booking-phone" error={errors.phone} required>
                  <input
                    id="booking-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={updateField('phone')}
                    aria-invalid={Boolean(errors.phone)}
                    placeholder="+1 (555) 000-0000"
                    className={inputClassName}
                  />
                </FormField>

                <FormField label="Preferred date" htmlFor="booking-date" error={errors.preferredDate} required>
                  <input
                    id="booking-date"
                    name="preferredDate"
                    type="date"
                    min={minDate}
                    value={values.preferredDate}
                    onChange={updateField('preferredDate')}
                    aria-invalid={Boolean(errors.preferredDate)}
                    className={inputClassName}
                  />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Treatment type" htmlFor="booking-treatment" error={errors.treatment} required>
                    <select
                      id="booking-treatment"
                      name="treatment"
                      value={values.treatment}
                      onChange={updateField('treatment')}
                      aria-invalid={Boolean(errors.treatment)}
                      className={inputClassName}
                    >
                      <option value="" disabled>
                        Select a treatment
                      </option>
                      {TREATMENTS.map((treatment) => (
                        <option key={treatment} value={treatment}>
                          {treatment}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField label="Message" htmlFor="booking-message" error={errors.message}>
                    <textarea
                      id="booking-message"
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={updateField('message')}
                      aria-invalid={Boolean(errors.message)}
                      placeholder="Anything we should know before your visit?"
                      className={`${inputClassName} resize-y`}
                    />
                  </FormField>
                </div>

                {status === 'error' && serverError && (
                  <p role="alert" className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {serverError}
                  </p>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-brand-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                    {isSubmitting ? 'Sending your request...' : 'Request appointment'}
                  </button>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    We respect your privacy. Your details are only used to arrange your visit.
                  </p>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
