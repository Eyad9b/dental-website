import { About } from '@/components/clinic/about';
import { BookingSection } from '@/components/clinic/booking-section';
import { Contact } from '@/components/clinic/contact';
import { Faq } from '@/components/clinic/faq';
import { Footer } from '@/components/clinic/footer';
import { Gallery } from '@/components/clinic/gallery';
import { Hero } from '@/components/clinic/hero';
import { Navbar } from '@/components/clinic/navbar';
import { Services } from '@/components/clinic/services';
import { Stats } from '@/components/clinic/stats';
import { Testimonials } from '@/components/clinic/testimonials';
import { WhatsAppButton } from '@/components/clinic/whatsapp-button';
import { WhyChooseUs } from '@/components/clinic/why-choose-us';
import { clinic, services } from '@/lib/clinic-data';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: clinic.name,
  description: clinic.tagline,
  telephone: clinic.phone,
  email: clinic.email,
  address: { '@type': 'PostalAddress', streetAddress: clinic.address },
  openingHours: ['Mo-Fr 08:00-19:00', 'Sa 09:00-15:00'],
  medicalSpecialty: services.map((service) => service.title),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <WhyChooseUs />
        <Stats />
        <Testimonials />
        <Gallery />
        <BookingSection />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
