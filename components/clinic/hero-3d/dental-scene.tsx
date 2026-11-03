'use client';

import { Environment, Lightformer, Sparkles } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { buildGumGeometry, layoutArch, type ArchLayout } from './arch';
import { createEnamelMaterial, createGumMaterial } from './materials';
import { buildToothGeometry, LOWER_TEETH, UPPER_TEETH } from './tooth-geometry';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

const FOV = 30;
const CAMERA_REST = new THREE.Vector3(0, 0.9, 18.5);
const CAMERA_START = new THREE.Vector3(0.6, 3.0, 26);
const GAP_REST = 2.3;
const GAP_START = 3.9;
const ARCH_HALF_WIDTH = 3.9;

interface ArchData {
  layout: ArchLayout;
  geometries: THREE.BufferGeometry[];
  gum: THREE.BufferGeometry;
}

function buildArch(specs: typeof UPPER_TEETH, ratio: number): ArchData {
  const layout = layoutArch(specs, ratio);
  return {
    layout,
    geometries: layout.teeth.map((t) => buildToothGeometry(t.spec)),
    gum: buildGumGeometry(layout),
  };
}

interface Props {
  reduceMotion: boolean;
  onReady?: () => void;
}

export function DentalScene({ reduceMotion, onReady }: Props) {
  const size = useThree((s) => s.size);

  const { upper, lower, enamel, gumMat } = useMemo(
    () => ({
      upper: buildArch(UPPER_TEETH, 1.5),
      lower: buildArch(LOWER_TEETH, 1.58),
      enamel: createEnamelMaterial(),
      gumMat: createGumMaterial(),
    }),
    [],
  );

  useEffect(
    () => () => {
      [upper, lower].forEach((a) => {
        a.geometries.forEach((g) => g.dispose());
        a.gum.dispose();
      });
      enamel.bumpMap?.dispose();
      gumMat.bumpMap?.dispose();
      enamel.dispose();
      gumMat.dispose();
    },
    [upper, lower, enamel, gumMat],
  );

  const placement = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const upperGroup = useRef<THREE.Group>(null);
  const lowerGroup = useRef<THREE.Group>(null);
  const toothRefs = useRef<{ upper: (THREE.Group | null)[][]; lower: (THREE.Group | null)[][] }>({
    upper: [[], []],
    lower: [[], []],
  });
  const keyLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.SpotLight>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const motion = useRef({ t0: -1, frames: 0, mx: 0, my: 0, ready: false });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduceMotion]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const m = motion.current;
    const time = state.clock.elapsedTime;

    // wait a few frames so shader compilation hitches don't eat the intro
    m.frames += 1;
    if (m.t0 < 0 && m.frames > 3) m.t0 = time;
    const E = reduceMotion ? 99 : m.t0 < 0 ? -1 : time - m.t0;
    if (!m.ready && E >= 0) {
      m.ready = true;
      onReady?.();
    }
    const e = Math.max(E, 0);

    // ---- responsive placement: model sits in the free right half on wide screens
    const aspect = size.width / size.height;
    const halfH = CAMERA_REST.z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const halfW = halfH * aspect;
    const wide = aspect > 1.15;
    const fit = wide ? (halfW * 1.0) / 2 / ARCH_HALF_WIDTH : (halfW * 0.94) / ARCH_HALF_WIDTH;
    const scale = clamp(fit * 0.86, 0.5, 1.05);
    if (placement.current) {
      placement.current.scale.setScalar(scale);
      placement.current.position.set(wide ? halfW * 0.5 : 0, wide ? 0 : 0.1, 0);
    }

    // ---- camera dolly (the cinematic opening)
    const cam = easeOutQuart(clamp(e / 3.6));
    state.camera.position.lerpVectors(CAMERA_START, CAMERA_REST, cam);
    // tiny parallax on top of the dolly
    const px = reduceMotion ? 0 : m.mx;
    const py = reduceMotion ? 0 : m.my;
    state.camera.position.x += px * 0.5;
    state.camera.position.y += -py * 0.3;
    state.camera.lookAt(placement.current?.position.x ? placement.current.position.x * 0.35 : 0, 0, 0);

    // ---- cursor follow (damped, frame-rate independent)
    m.mx = THREE.MathUtils.damp(m.mx, pointer.current.x, 2.4, dt);
    m.my = THREE.MathUtils.damp(m.my, pointer.current.y, 2.4, dt);

    // ---- rig: opening turn, slow idle sweep, cursor tilt
    if (rig.current) {
      const introYaw = (1 - easeOutQuart(clamp(e / 3.4))) * -1.15;
      const idle = reduceMotion ? 0 : Math.sin(e * 0.27) * 0.52;
      const base = reduceMotion ? -0.28 : -0.12;
      rig.current.rotation.y = base + introYaw + idle + m.mx * (reduceMotion ? 0 : 0.3);
      rig.current.rotation.x = 0.07 + (reduceMotion ? 0 : -m.my * 0.12 + Math.sin(e * 0.21) * 0.035);
      rig.current.rotation.z = reduceMotion ? 0 : m.mx * 0.025;
      rig.current.position.y = reduceMotion ? 0 : Math.sin(e * 0.5) * 0.07;
    }

    // ---- jaw: opens into rest position, then breathes very slightly
    const gap = mix(GAP_START, GAP_REST, easeOutCubic(clamp((e - 0.2) / 2.2))) + (reduceMotion ? 0 : Math.sin(e * 0.36) * 0.05);
    if (upperGroup.current) upperGroup.current.position.y = gap / 2;
    if (lowerGroup.current) lowerGroup.current.position.y = -gap / 2;

    // ---- teeth erupt from the gum line, centre outward
    const reveal = (archDelay: number, refs: (THREE.Group | null)[][]) => {
      refs.forEach((side) =>
        side.forEach((g, rank) => {
          if (!g) return;
          const p = easeOutCubic(clamp((e - 0.55 - archDelay - rank * 0.1) / 1.1));
          g.visible = p > 0.002;
          g.scale.set(0.88 + 0.12 * p, Math.max(p, 0.001), 0.88 + 0.12 * p);
        }),
      );
    };
    reveal(0, toothRefs.current.lower);
    reveal(0.14, toothRefs.current.upper);

    const gumP = easeOutCubic(clamp((e - 0.05) / 1.2));
    gumMat.opacity = gumP;
    gumMat.transparent = gumP < 0.999;

    // ---- drifting light so highlights travel across the enamel
    if (keyLight.current) {
      const a = reduceMotion ? 0.6 : e * 0.2 + 0.6;
      keyLight.current.position.set(Math.cos(a) * 7, 6.5, 6 + Math.sin(a) * 3);
    }
    if (rimLight.current) {
      const a = reduceMotion ? 0 : e * 0.15;
      rimLight.current.position.set(-6 + Math.sin(a) * 1.5, 3, -6);
    }
  });

  const renderArch = (data: ArchData, key: 'upper' | 'lower') => (
    <>
      <mesh geometry={data.gum} material={gumMat} />
      {[1, -1].map((side, si) => (
        <group key={side} scale={[side, 1, 1]}>
          {data.layout.teeth.map((t, i) => (
            <group
              key={t.spec.id}
              ref={(el) => {
                toothRefs.current[key][si][t.rank] = el;
              }}
              position={[t.x, 0, t.z]}
              rotation={[0, t.rotY, 0]}
            >
              <mesh geometry={data.geometries[i]} material={enamel} />
            </group>
          ))}
        </group>
      ))}
    </>
  );

  return (
    <>
      <ambientLight intensity={0.12} color="#9cc7e0" />
      <directionalLight ref={keyLight} intensity={2.3} color="#fff4e6" position={[4, 6.5, 7]} />
      <spotLight ref={rimLight} intensity={90} angle={0.7} penumbra={1} color="#7fd0ff" position={[-6, 3, -6]} />
      <pointLight intensity={14} distance={30} color="#3cb9a8" position={[7, -1, 3]} />

      <Environment resolution={256} frames={1} environmentIntensity={1}>
        <Lightformer form="rect" intensity={3.2} color="#fff6ea" position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[-8, 1, 4]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#bfe6ff" position={[8, 2, -2]} rotation-y={-Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer form="ring" intensity={2.4} color="#d6f6f0" position={[0, 1, -9]} scale={7} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[0, -6, 3]} rotation-x={-Math.PI / 2} scale={[10, 4, 1]} />
      </Environment>

      <group ref={placement}>
        <group ref={rig}>
          {/* centre the arches around their shared midpoint */}
          <group position={[0, 0, 1.95]}>
            <group ref={upperGroup} rotation={[0, 0, Math.PI]} position={[0, GAP_START / 2, 0.14]}>
              {renderArch(upper, 'upper')}
            </group>
            <group ref={lowerGroup} position={[0, -GAP_START / 2, 0]}>
              {renderArch(lower, 'lower')}
            </group>
          </group>
        </group>
      </group>

      <Sparkles
        count={reduceMotion ? 0 : 36}
        scale={[16, 9, 8]}
        size={2.2}
        speed={0.18}
        opacity={0.35}
        color="#a8e4f0"
        position={[0, 0, -2]}
      />
    </>
  );
}
