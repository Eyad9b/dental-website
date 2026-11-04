/**
 * Original, hand-built "macro study" illustrations of teeth, drawn as SVG.
 * Each study exists in two palettes: natural light (amber dentin, pale enamel)
 * and fluorescence (cobalt glow). The About section cross-fades between them.
 */

export type StudyMode = 'amber' | 'uv';
export type StudyName = 'incisor' | 'canine' | 'section' | 'crowns';

type Stop = [number, string, number?];

const PALETTE: Record<StudyMode, Record<string, Stop[]>> = {
  amber: {
    enamel: [[0, '#140b05'], [0.35, '#4d2a09'], [0.62, '#9c5f14'], [0.82, '#dfae55'], [0.93, '#f1e6cb'], [1, '#c6d2e6']],
    dentin: [[0, '#0d0703'], [0.4, '#3f2106'], [0.8, '#ba7c24'], [1, '#e8be74']],
    hull: [[0, '#5d6a7d', 0.55], [0.5, '#9fb0c4', 0.5], [1, '#d3dde8', 0.7]],
    core: [[0, '#8a5410'], [0.6, '#e2ae52'], [1, '#f4dca0']],
    ring: [[0, '#1d2a45'], [0.6, '#5a7098'], [1, '#aab9d3']],
    band: [[0, '#d9c28d'], [0.5, '#f4ead2'], [1, '#fffaf0']],
    wide: [[0, '#f6efe0'], [0.45, '#e3b968'], [0.8, '#8a5412'], [1, '#2b1604']],
    edge: [[0, '#ffffff', 0.1], [1, '#cfdcf2', 0.65]],
  },
  uv: {
    enamel: [[0, '#00020f'], [0.4, '#051b7d'], [0.7, '#0c46d8'], [0.9, '#2f8bff'], [1, '#86c4ff']],
    dentin: [[0, '#02072e'], [0.5, '#0a37c2'], [1, '#3da3ff']],
    hull: [[0, '#0620a0', 0.7], [0.5, '#1767ff', 0.55], [1, '#69b8ff', 0.7]],
    core: [[0, '#0a38c9'], [0.6, '#2c86ff'], [1, '#9fd0ff']],
    ring: [[0, '#1a0a5c'], [0.6, '#4a2fd0'], [1, '#9a7cff']],
    band: [[0, '#2f7dff'], [0.5, '#7fbcff'], [1, '#d8ecff']],
    wide: [[0, '#8ec8ff'], [0.45, '#2f8dff'], [0.8, '#0a3ac8'], [1, '#010624']],
    edge: [[0, '#7fc0ff', 0.1], [1, '#bfe0ff', 0.75]],
  },
};

function Grad({ id, stops, x2 = 0, y2 = 1 }: { id: string; stops: Stop[]; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      {stops.map(([o, c, a], i) => (
        <stop key={i} offset={o} stopColor={c} stopOpacity={a ?? 1} />
      ))}
    </linearGradient>
  );
}

function Grain({ id, freq = '0.02 0.45', seed = 3 }: { id: string; freq?: string; seed?: number }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} seed={seed} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  1.4 0 0 0 -0.2" />
    </filter>
  );
}

/* ---------------- incisor: long enamel face with scalloped edge ---------------- */
function Incisor({ mode }: { mode: StudyMode }) {
  const p = PALETTE[mode];
  const k = `inc-${mode}`;
  const outer =
    'M72 -10 C64 120 52 250 56 340 C58 372 64 392 76 404 C92 416 104 396 120 407 C138 418 152 398 170 407 C190 416 204 394 222 403 C238 392 247 366 245 330 C243 240 233 110 227 -10 Z';
  const inner =
    'M104 -10 C96 130 88 250 93 330 C97 362 112 380 150 386 C190 382 206 360 210 328 C214 250 206 130 200 -10 Z';
  return (
    <svg viewBox="0 0 300 440" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <Grad id={`${k}-e`} stops={p.enamel} />
        <Grad id={`${k}-d`} stops={p.dentin} />
        <Grad id={`${k}-s`} stops={p.edge} />
        <Grain id={`${k}-n`} freq="0.01 0.16" />
        <filter id={`${k}-b`}><feGaussianBlur stdDeviation="7" /></filter>
        <clipPath id={`${k}-c`}><path d={outer} /></clipPath>
      </defs>
      <rect width="300" height="440" fill="#000" />
      <path d={outer} fill={`url(#${k}-e)`} />
      <g clipPath={`url(#${k}-c)`}>
        <path d={inner} fill={`url(#${k}-d)`} filter={`url(#${k}-b)`} opacity="0.9" />
        <rect width="300" height="440" filter={`url(#${k}-n)`} opacity="0.2" style={{ mixBlendMode: 'overlay' }} />
        <ellipse cx="120" cy="300" rx="22" ry="130" fill="#fff" opacity="0.07" filter={`url(#${k}-b)`} />
      </g>
      <path d={outer} fill="none" stroke={`url(#${k}-s)`} strokeWidth="1.5" />
    </svg>
  );
}

/* ---------------- canine: translucent hull around a golden core ---------------- */
function Canine({ mode }: { mode: StudyMode }) {
  const p = PALETTE[mode];
  const k = `can-${mode}`;
  const outer = 'M-5 -8 C70 6 128 36 156 112 C182 176 204 252 214 342 L150 350 C118 262 62 166 42 92 C28 48 10 20 -5 -8 Z';
  const inner = 'M18 4 C74 22 118 52 138 116 C158 178 176 250 186 330 L158 334 C128 250 80 172 60 100 C46 56 32 28 18 4 Z';
  return (
    <svg viewBox="0 0 220 340" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <Grad id={`${k}-h`} stops={p.hull} x2={1} y2={0.4} />
        <Grad id={`${k}-k`} stops={p.core} x2={0.6} y2={1} />
        <Grain id={`${k}-n`} freq="0.25 0.02" seed={9} />
        <filter id={`${k}-b`}><feGaussianBlur stdDeviation="3" /></filter>
        <filter id={`${k}-b2`}><feGaussianBlur stdDeviation="1.3" /></filter>
        <clipPath id={`${k}-c`}><path d={outer} /></clipPath>
      </defs>
      <rect width="220" height="340" fill="#000" />
      <path d={outer} fill={`url(#${k}-h)`} />
      <g clipPath={`url(#${k}-c)`}>
        <path d={inner} fill={`url(#${k}-k)`} filter={`url(#${k}-b)`} />
        <path d="M50 40 C90 90 120 160 150 300" fill="none" stroke="#050301" strokeWidth="9" strokeLinecap="round" filter={`url(#${k}-b2)`} opacity="0.92" />
        <rect width="220" height="340" filter={`url(#${k}-n)`} opacity="0.2" style={{ mixBlendMode: 'overlay' }} />
      </g>
      <path d={outer} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" />
    </svg>
  );
}

/* ---------------- section: enamel rods in cross-section ---------------- */
function Section({ mode }: { mode: StudyMode }) {
  const p = PALETTE[mode];
  const k = `sec-${mode}`;
  return (
    <svg viewBox="0 0 210 140" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <Grad id={`${k}-r`} stops={p.ring} x2={1} y2={1} />
        <Grad id={`${k}-b`} stops={p.band} x2={1} y2={0} />
        <Grain id={`${k}-n`} freq="0.9" seed={5} />
        <filter id={`${k}-bl`}><feGaussianBlur stdDeviation="1.2" /></filter>
        <clipPath id={`${k}-c`}><ellipse cx="105" cy="72" rx="112" ry="56" transform="rotate(-12 105 72)" /></clipPath>
      </defs>
      <rect width="210" height="140" fill="#000" />
      <ellipse cx="105" cy="72" rx="112" ry="56" transform="rotate(-12 105 72)" fill={`url(#${k}-r)`} />
      <g clipPath={`url(#${k}-c)`}>
        <rect width="210" height="140" filter={`url(#${k}-n)`} opacity="0.55" style={{ mixBlendMode: 'overlay' }} />
        <path d="M14 104 C44 44 126 34 196 66 C150 58 92 66 62 108 Z" fill={`url(#${k}-b)`} filter={`url(#${k}-bl)`} />
        <ellipse cx="108" cy="82" rx="46" ry="13" transform="rotate(-14 108 82)" fill="#05080f" opacity="0.88" filter={`url(#${k}-bl)`} />
      </g>
    </svg>
  );
}

/* ---------------- crowns: two stacked lateral views ---------------- */
function Crowns({ mode }: { mode: StudyMode }) {
  const p = PALETTE[mode];
  const k = `crw-${mode}`;
  const top = 'M-10 24 H246 C292 24 322 46 326 90 V150 C300 176 130 160 64 170 C22 176 -10 152 -10 152 Z';
  const bottom = 'M-10 222 C44 194 210 204 326 214 V340 H-10 Z';
  return (
    <svg viewBox="0 0 320 330" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <Grad id={`${k}-w`} stops={p.wide} x2={1} y2={0.15} />
        <Grain id={`${k}-n`} freq="0.02 0.1" seed={12} />
        <filter id={`${k}-bl`}><feGaussianBlur stdDeviation="5" /></filter>
        <clipPath id={`${k}-t`}><path d={top} /></clipPath>
        <clipPath id={`${k}-u`}><path d={bottom} /></clipPath>
      </defs>
      <rect width="320" height="330" fill="#000" />
      <path d={top} fill={`url(#${k}-w)`} />
      <g clipPath={`url(#${k}-t)`}>
        <rect width="320" height="330" filter={`url(#${k}-n)`} opacity="0.2" style={{ mixBlendMode: 'overlay' }} />
        <path d="M40 60 C120 40 200 56 290 70" stroke="#fff" strokeOpacity="0.28" strokeWidth="10" fill="none" filter={`url(#${k}-bl)`} />
        <path d="M30 110 C110 96 190 108 280 122" stroke="#000" strokeOpacity="0.25" strokeWidth="1.2" fill="none" />
        <path d="M60 138 C130 128 200 136 270 146" stroke="#000" strokeOpacity="0.2" strokeWidth="1" fill="none" />
      </g>
      <path d={bottom} fill={`url(#${k}-w)`} />
      <g clipPath={`url(#${k}-u)`}>
        <rect width="320" height="330" filter={`url(#${k}-n)`} opacity="0.2" style={{ mixBlendMode: 'overlay' }} />
        <path d="M30 246 C110 232 200 240 300 250" stroke="#fff" strokeOpacity="0.22" strokeWidth="9" fill="none" filter={`url(#${k}-bl)`} />
      </g>
    </svg>
  );
}

const STUDIES = { incisor: Incisor, canine: Canine, section: Section, crowns: Crowns };

export function ToothStudy({ study, mode }: { study: StudyName; mode: StudyMode }) {
  const Study = STUDIES[study];
  return <Study mode={mode} />;
}
