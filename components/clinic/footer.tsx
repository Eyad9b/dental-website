import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Smile } from 'lucide-react';
import { clinic, navLinks, services } from '@/lib/clinic-data';

const socials = [
  { label: 'Facebook', href: 'https://www.facebook.com', icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400 text-brand-900">
              <Smile className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">{clinic.name}</span>
          </a>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-200">{clinic.tagline}</p>
          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${label}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-400 hover:text-brand-900"
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer quick links">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-accent-300">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Treatments</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((service) => (
              <li key={service.title}>
                <a href="#book" className="transition-colors hover:text-accent-300">
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-accent-300" aria-hidden="true" />
              <span>{clinic.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 flex-none text-accent-300" aria-hidden="true" />
              <a href={clinic.phoneHref} className="transition-colors hover:text-accent-300">
                {clinic.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 flex-none text-accent-300" aria-hidden="true" />
              <a href={`mailto:${clinic.email}`} className="transition-colors hover:text-accent-300">
                {clinic.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>&copy; {new Date().getFullYear()} {clinic.name}. All rights reserved.</p>
          <p>Dental care delivered with precision and compassion.</p>
        </div>
      </div>
    </footer>
  );
}
