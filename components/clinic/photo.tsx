'use client';

import { useState } from 'react';

/** Cover image that quietly disappears if the file cannot load, leaving the dark card behind it. */
export function Photo({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={className} />
  );
}
