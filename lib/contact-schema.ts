import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name.').max(100, 'Name is too long.'),
  email: z.string().trim().max(254).email('Please enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least 10 characters.')
    .max(2000, 'Message must be 2000 characters or fewer.'),
});

export type ContactInput = z.infer<typeof contactSchema>;
