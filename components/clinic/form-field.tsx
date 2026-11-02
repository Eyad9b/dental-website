import type { ReactNode } from 'react';

export const inputClassName =
  'mt-2 w-full rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-brand-900">
        {label}
        {required && <span className="ml-0.5 text-accent-600">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
