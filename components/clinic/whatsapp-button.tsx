'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { clinic } from '@/lib/clinic-data';

export function WhatsAppButton() {
  return (
    <motion.a
      href={clinic.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-accent-600 py-3 pl-3.5 pr-5 text-white shadow-xl shadow-accent-900/25 sm:bottom-8 sm:right-8"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/30" aria-hidden="true" />
        <MessageCircle className="relative h-5 w-5" aria-hidden="true" />
      </span>
      <span className="hidden text-sm font-semibold sm:block">Chat with us</span>
    </motion.a>
  );
}
