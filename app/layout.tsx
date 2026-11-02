import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = 'https://crestviewdental.com';
const description =
  'Crestview Dental offers gentle, expert dentistry including teeth whitening, dental implants, orthodontics, root canal treatment, cosmetic dentistry and emergency care. Book your appointment online.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Crestview Dental | Expert Dentistry & Gentle Care',
    template: '%s | Crestview Dental',
  },
  description,
  keywords: [
    'dentist',
    'dental clinic',
    'teeth whitening',
    'dental implants',
    'orthodontics',
    'root canal',
    'cosmetic dentistry',
    'emergency dentist',
  ],
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Crestview Dental',
    title: 'Crestview Dental | Expert Dentistry & Gentle Care',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crestview Dental | Expert Dentistry & Gentle Care',
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
