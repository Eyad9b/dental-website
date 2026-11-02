# Project memory

## Product intent & audience

- Premium, conversion-focused dental clinic website designed to build trust, communicate expertise, and drive appointment requests.
- Primary audience: prospective dental patients seeking a modern, comfortable, professional clinic.
- Single-page marketing experience with clear paths to booking, contact, services, testimonials, and clinic information.
- Appointment and contact submissions are persisted server-side; public visitors cannot access other patients’ data.

## Brand personality & voice

- Trustworthy, reassuring, polished, and human.
- High-end healthcare positioning without feeling cold or overly clinical.
- Messaging emphasizes expert care, patient comfort, modern technology, personalized treatment, and confidence in outcomes.
- Current clinic identity, provider details, contact information, and social profiles are placeholders pending real business content.

## Visual design & UX direction

- Clean premium healthcare aesthetic using white, blue, and soft teal/accent tones.
- Spacious layouts, strong hierarchy, professional typography, subtle shadows, selective glassmorphism, and polished card treatments.
- Hero uses a full-width marketing layout with headline/content on the left and a custom animated smile card on the right.
- Hero smile animation presents teeth rising into a curved smile arrangement one by one, transitioning from a yellowed shade to bright white.
- Animated smile card includes a whitening progress bar and looping teal sparkle effects; floating trust badges appear on larger screens.
- On mobile, the smile card stacks below the hero copy and floating badges are hidden to preserve clarity and space.
- Sticky navigation with anchor links and prominent booking CTA.
- Responsive mobile-first layout across hero, services, about, benefits, statistics, testimonials, gallery, booking, FAQ, contact, and footer.
- Smooth scroll-triggered animations and restrained micro-interactions; avoid distracting or excessive motion.
- Gallery supports interactive before/after browsing with a lightbox.
- FAQ uses expandable accordion behavior.
- Forms include inline validation, loading feedback, and clear success messaging.
- Floating WhatsApp contact affordance is included.
- Map is currently a styled contact panel with directions CTA rather than an embedded interactive map.
- Accessibility and performance are intended priorities: semantic structure, optimized/lazy imagery, clear contrast, and production-safe client/server boundaries.
- Current implementation does not include dark mode.

## Decisions, constraints & rationale

- Built as a Next.js/React single-page clinic site with Tailwind CSS, shared components, Lucide icons, and Framer Motion animations.
- Existing project framework/version was retained; Next.js 15 upgrade was not performed.
- Appointment and contact requests use database-backed API routes and locked-down tables; visitors can submit but cannot read other submissions.
- Shared server-side database helper, request utility, form-field component, validation, and structured clinic content were added for consistency.
- Hero animation was implemented directly in the hero rather than relying on an external visual/UI package.
- Production build passes after resolving Tailwind configuration duplication, animation/class issues, and the hero animation integration.
- SEO metadata and FAQ structured data are wired into the page; smooth anchor scrolling is enabled.
- Stock photography is currently used for hero, about, gallery, and testimonial imagery. “Before and after” assets must be replaced with authentic, consented patient images before launch.
- Avoid exposing sample clinic details or implying stock/gallery images represent real patients.
- The updated hero animation has not been browser-verified in the current work session; visual polish, sizing, timing, and responsive behavior still need preview review.

## Open questions & assumptions

- Confirm real clinic name, logo/branding, provider biographies, credentials, address, phone, email, hours, social links, and WhatsApp number.
- Decide whether to upgrade the project to Next.js 15 and whether online booking requires availability management beyond request submission.
- Supply approved clinic photography, authentic testimonials, and legally consented before/after cases.
- Replace the styled map panel with a live map/embed if required.
- Confirm production database environment, notification workflow for new bookings/contact messages, spam protection, and privacy/consent requirements.
- Browser-test the new smile animation on desktop and mobile, including reduced-motion behavior, readability, card balance, and interaction with hero CTAs.
- Browser-test responsive layouts, motion behavior, forms, lightbox, navigation, contrast, and mobile usability before release.
- Validate final SEO copy, metadata, analytics, domain, and local search details with the clinic.