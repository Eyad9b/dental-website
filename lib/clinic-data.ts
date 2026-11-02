import {
  Anchor,
  Ambulance,
  Crown,
  Ruler,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from 'lucide-react';

export const clinic = {
  name: 'Crestview Dental',
  tagline: 'Gentle, expert dentistry for healthier, brighter smiles.',
  phone: '+1 (555) 014-2290',
  phoneHref: 'tel:+15550142290',
  email: 'hello@crestviewdental.com',
  address: '120 Harbor Avenue, Suite 4, Riverside',
  hours: [
    { day: 'Monday - Friday', time: '8:00 AM - 7:00 PM' },
    { day: 'Saturday', time: '9:00 AM - 3:00 PM' },
    { day: 'Sunday', time: 'Emergency care only' },
  ],
  whatsappHref: 'https://wa.me/15550142290?text=Hello%2C%20I%27d%20like%20to%20book%20an%20appointment',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=120+Harbor+Avenue+Suite+4+Riverside',
};

export const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: 'Teeth Whitening',
    description: 'Professional in-office whitening that lifts stains safely for a visibly brighter smile in one visit.',
    icon: Sparkles,
  },
  {
    title: 'Dental Implants',
    description: 'Permanent, natural-looking tooth replacements designed around your bite, comfort and long-term health.',
    icon: Anchor,
  },
  {
    title: 'Orthodontics',
    description: 'Clear aligners and braces for all ages, planned with digital scans for precise, comfortable results.',
    icon: Ruler,
  },
  {
    title: 'Root Canal Treatment',
    description: 'Modern, pain-minimised endodontic care that saves your natural tooth and relieves discomfort.',
    icon: Syringe,
  },
  {
    title: 'Cosmetic Dentistry',
    description: 'Veneers, bonding and smile makeovers crafted to harmonise with your face and personal style.',
    icon: Crown,
  },
  {
    title: 'Emergency Dental Care',
    description: 'Same-day appointments for toothaches, broken teeth and urgent problems when you need relief fast.',
    icon: Ambulance,
  },
];

export const stats = [
  { value: 12500, suffix: '+', label: 'Happy patients' },
  { value: 18, suffix: '', label: 'Years of experience' },
  { value: 48000, suffix: '+', label: 'Treatments completed' },
  { value: 1800, suffix: '+', label: 'Positive reviews' },
];

export const whyChooseUs = [
  {
    title: 'Experienced dentists',
    description: 'Board-certified specialists with advanced training and an average of 15 years in practice.',
    icon: Stethoscope,
  },
  {
    title: 'Modern technology',
    description: '3D imaging, digital scanning and low-radiation X-rays for accurate diagnosis and fewer surprises.',
    icon: Smile,
  },
  {
    title: 'Comfortable environment',
    description: 'Calming treatment rooms, noise-reduced equipment and sedation options for anxious patients.',
    icon: Sparkles,
  },
  {
    title: 'Personalised care',
    description: 'Every treatment plan is tailored to your goals, budget and schedule, with clear explanations at each step.',
    icon: Crown,
  },
  {
    title: 'Affordable treatments',
    description: 'Transparent pricing, flexible payment plans and no hidden fees, quoted before any work begins.',
    icon: Ruler,
  },
];

export type Testimonial = {
  name: string;
  treatment: string;
  quote: string;
  rating: number;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Amelia Brooks',
    treatment: 'Teeth Whitening',
    quote: 'I was nervous about my first visit, but the team made me feel completely at ease. My smile has never looked brighter.',
    rating: 5,
    image: 'https://images.pexels.com/photos/16869444/pexels-photo-16869444.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  },
  {
    name: 'Daniel Okafor',
    treatment: 'Dental Implants',
    quote: 'The implant process was planned meticulously from start to finish. I can eat and smile with confidence again.',
    rating: 5,
    image: 'https://images.pexels.com/photos/6102841/pexels-photo-6102841.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  },
  {
    name: 'Priya Raman',
    treatment: 'Orthodontics',
    quote: 'Clear aligners fit perfectly into my busy schedule. The progress updates kept me motivated throughout the whole journey.',
    rating: 5,
    image: 'https://images.pexels.com/photos/27544052/pexels-photo-27544052.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  },
  {
    name: 'Marcus Lindqvist',
    treatment: 'Emergency Dental Care',
    quote: 'I called in pain on a Saturday and was seen within the hour. Professional, kind, and incredibly efficient.',
    rating: 5,
    image: 'https://images.pexels.com/photos/35490806/pexels-photo-35490806.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  },
  {
    name: 'Hannah Whitfield',
    treatment: 'Cosmetic Dentistry',
    quote: 'The veneers look completely natural. Everyone notices my smile now, and the team helped me every step of the way.',
    rating: 5,
    image: 'https://images.pexels.com/photos/35490803/pexels-photo-35490803.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  },
];

export const galleryItems = [
  {
    title: 'Radiant whitening result',
    category: 'Teeth Whitening',
    image: 'https://images.pexels.com/photos/3762402/pexels-photo-3762402.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop',
  },
  {
    title: 'Smile makeover',
    category: 'Cosmetic Dentistry',
    image: 'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop',
  },
  {
    title: 'Comfortable consultation',
    category: 'General Check-up',
    image: 'https://images.pexels.com/photos/8669944/pexels-photo-8669944.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop',
  },
  {
    title: 'Aligned and confident',
    category: 'Orthodontics',
    image: 'https://images.pexels.com/photos/5355723/pexels-photo-5355723.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop',
  },
  {
    title: 'Natural-looking restoration',
    category: 'Dental Implants',
    image: 'https://images.pexels.com/photos/65665/smile-mouth-teeth-laugh-65665.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop',
  },
  {
    title: 'Healthy, lasting smile',
    category: 'Root Canal Treatment',
    image: 'https://images.pexels.com/photos/8727478/pexels-photo-8727478.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop',
  },
];

export const faqs = [
  {
    question: 'How do I book my first appointment?',
    answer: 'Use the booking form on this page or message us on WhatsApp. We will confirm your preferred time by phone or email, usually within one business day.',
  },
  {
    question: 'Do you accept new patients and walk-ins?',
    answer: 'Yes, we welcome new patients. Walk-ins are accepted for emergencies when space allows, but booking ahead guarantees your time.',
  },
  {
    question: 'Is teeth whitening safe?',
    answer: 'Professional whitening is safe when supervised by a dentist. We assess your enamel and gums first and tailor the treatment to protect them.',
  },
  {
    question: 'How long do dental implants last?',
    answer: 'With good daily hygiene and regular check-ups, implants often last a lifetime. Your dentist will explain the care routine that suits you.',
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'We do. Every treatment is quoted upfront, and flexible monthly payment plans are available for larger procedures.',
  },
  {
    question: 'What should I do in a dental emergency?',
    answer: 'Call us directly on the clinic phone line. We keep emergency slots open each day and will advise you on immediate steps while you travel.',
  },
];
