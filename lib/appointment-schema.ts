import { z } from 'zod';

export const TREATMENTS = [
  'Teeth Whitening',
  'Dental Implants',
  'Orthodontics',
  'Root Canal Treatment',
  'Cosmetic Dentistry',
  'Emergency Dental Care',
  'General Check-up',
] as const;

function todayIsoDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export const appointmentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(100, 'Name is too long.'),
  email: z
    .string()
    .trim()
    .max(254)
    .email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number.')
    .max(20, 'Phone number is too long.')
    .regex(/^[+()\d\s-]+$/, 'Phone numbers can only contain digits and + ( ) -.'),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a preferred date.')
    .refine((value) => value >= todayIsoDate(), 'Please choose today or a future date.'),
  treatment: z.enum(TREATMENTS, { errorMap: () => ({ message: 'Please choose a treatment.' }) }),
  message: z.string().trim().max(1000, 'Message must be 1000 characters or fewer.').optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
