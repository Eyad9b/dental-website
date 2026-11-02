'use client';

import { motion, useReducedMotion } from 'framer-motion';

const VIEW_WIDTH = 360;
const TOOTH_WIDTH = 34;
const TOOTH_GAP = 6;
const HEIGHTS = [62, 70, 76, 80, 80, 76, 70, 62];
const STAINED = '#ead7a0';
const SPARKLES = [
  { x: 44, y: 34, delay: 0.4 },
  { x: 318, y: 46, delay: 1.3 },
  { x: 178, y: 14, delay: 2.1 },
  { x: 28, y: 128, delay: 2.9 },
  { x: 334, y: 124, delay: 3.6 },
];

const SMILE_ARC_CENTER = (HEIGHTS.length - 1) / 2;

function toothPath(x: number, y: number, width: number, height: number) {
  const body = height * 0.55;
  return `M${x} ${y} H${x + width} V${y + body} Q${x + width} ${y + height} ${x + width / 2} ${y + height} Q${x} ${y + height} ${x} ${y + body} Z`;
}

const teeth = HEIGHTS.map((height, index) => {
  const x = (VIEW_WIDTH - (HEIGHTS.length * TOOTH_WIDTH + (HEIGHTS.length - 1) * TOOTH_GAP)) / 2 + index * (TOOTH_WIDTH + TOOTH_GAP);
  const curve = Math.pow(Math.abs(index - SMILE_ARC_CENTER), 2) * 1.6;
  return { index, x, y: 40 + curve, height };
});

export function HeroSmile() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-brand-900/10 backdrop-blur-xl sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Smile preview</span>
        <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-700">Whitening</span>
      </div>

      <svg
        viewBox={`0 0 ${VIEW_WIDTH} 180`}
        role="img"
        aria-label="Animated illustration of teeth becoming brighter"
        className="h-auto w-full overflow-visible"
      >
        {teeth.map((tooth) => (
          <motion.g
            key={tooth.index}
            initial={reduceMotion ? false : { y: -26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 + tooth.index * 0.08, type: 'spring', stiffness: 140, damping: 14 }}
          >
            <motion.path
              d={toothPath(tooth.x, tooth.y, TOOTH_WIDTH, tooth.height)}
              initial={reduceMotion ? false : { fill: STAINED }}
              animate={{ fill: '#ffffff' }}
              transition={{ duration: 1.4, delay: 1.1 + tooth.index * 0.12, ease: 'easeInOut' }}
              stroke="#c9e0ee"
              strokeWidth="1"
            />
            <motion.ellipse
              cx={tooth.x + 10}
              cy={tooth.y + 12}
              rx={3.5}
              ry={8}
              fill="#ffffff"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0.5] }}
              transition={{ duration: 2.2, delay: 1.6 + tooth.index * 0.12 }}
            />
          </motion.g>
        ))}

        {SPARKLES.map((sparkle) => (
          <g key={`${sparkle.x}-${sparkle.y}`} transform={`translate(${sparkle.x} ${sparkle.y})`}>
            <motion.path
              d="M0 -9 Q1.5 -1.5 9 0 Q1.5 1.5 0 9 Q-1.5 1.5 -9 0 Q-1.5 -1.5 0 -9Z"
              fill="#3cb9a8"
              initial={{ scale: 0, opacity: 0 }}
              animate={reduceMotion ? { scale: 0, opacity: 0 } : { scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2.4, delay: sparkle.delay, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
            />
          </g>
        ))}
      </svg>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Before</span>
          <span>After</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
          <motion.div
            className="h-full origin-left rounded-full bg-gradient-to-r from-accent-400 to-brand-500"
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.4, delay: 1.1, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
}
