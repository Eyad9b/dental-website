/**
 * All site photography lives here so it is easy to swap.
 *
 * Every entry is a free-to-use Pexels photo. For the most authentic result,
 * replace these with real photos of YOUR clinic, team and patients:
 *   - drop files in /public/photos and use e.g. { src: '/photos/implants.jpg' }
 *   - or change the Pexels ids below.
 */
export type PhotoRef = { id: number; slug?: string } | { src: string };

export function photoUrl(ref: PhotoRef, w: number, h: number): string {
  if ('src' in ref) return ref.src;
  const slug = ref.slug ?? `pexels-photo-${ref.id}`;
  return `https://images.pexels.com/photos/${ref.id}/${slug}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}

export const photos = {
  // services
  implants: { id: 5355730 }, // dentist showing a patient imaging on a tablet
  cosmetic: { id: 3762453 },
  orthodontics: { id: 5355723 },
  whitening: { id: 3762402 },
  rootCanal: { id: 6502039 }, // person looking at an X-ray image of teeth
  emergency: { id: 6502029 }, // dentist explaining dental results
  // about collage
  aboutSmile: { id: 65665, slug: 'smile-mouth-teeth-laugh-65665' },
  aboutCare: { id: 8727478 },
  aboutConsult: { id: 8669944 },
  aboutXray: { id: 6529219 }, // dentist showing an X-ray image to a patient
} satisfies Record<string, PhotoRef>;
