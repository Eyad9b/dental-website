'use client';

import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HeroSmile } from '../hero-smile';
import { DentalScene } from './dental-scene';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Full-bleed 3D dental model. Renders nothing heavy until it is on screen. */
export default function HeroCanvas() {
  const reduceMotion = useReducedMotion() ?? false;
  const wrapper = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => setSupported(hasWebGL()), []);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (supported === false) {
    return (
      <div className="flex h-full items-center justify-center lg:justify-end lg:pr-16">
        <HeroSmile />
      </div>
    );
  }

  return (
    <div
      ref={wrapper}
      role="img"
      aria-label="Slowly rotating 3D model of upper and lower teeth"
      className={`h-full w-full transition-opacity duration-[1400ms] ease-out ${ready ? 'opacity-100' : 'opacity-0'}`}
    >
      {supported && (
        <Canvas
          frameloop={inView ? 'always' : 'never'}
          dpr={[1, 1.75]}
          camera={{ fov: 30, near: 0.1, far: 80, position: [0.6, 3.4, 25] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.08;
          }}
        >
          <DentalScene reduceMotion={reduceMotion} onReady={() => setReady(true)} />
        </Canvas>
      )}
    </div>
  );
}
