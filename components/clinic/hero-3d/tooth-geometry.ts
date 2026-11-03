import * as THREE from 'three';

/**
 * Procedural, anatomically-informed tooth geometry.
 *
 * Local tooth space (units ≈ centimetres):
 *   +x  mesiodistal (towards the back of the mouth)
 *   +y  towards the biting surface (root is at negative y)
 *   +z  labial / buccal (the visible face of the tooth)
 *
 * Each tooth is one closed, smooth parametric surface:
 *   root tip → root → cervical line → crown wall → occlusal cap
 * with a super-elliptical cross-section so incisors read flat-fronted and
 * molars read boxy, plus cusps, fissures and incisal edges on the cap.
 */

export type ToothKind = 'incisor' | 'canine' | 'premolar' | 'molar';

export interface ToothSpec {
  id: string;
  kind: ToothKind;
  /** crown width, mesiodistal */
  width: number;
  /** crown depth, labiolingual */
  depth: number;
  /** crown wall height up to the cap rim */
  height: number;
  /** extra height contributed by the cap (cusps / incisal edge) */
  capHeight: number;
  /** root length (hidden inside the gum) */
  root: number;
  /** relative cervical width, 0..1 */
  taper: number;
  /** height fraction where the crown is widest */
  widest: number;
  /** how much the crown narrows toward the biting surface */
  topNarrow: number;
  /** how much the lingual side recedes towards the biting surface */
  lingualTaper: number;
  /** 1 keeps the labial face vertical (incisors); 0 keeps the tooth symmetric */
  labialAnchor: number;
  /** shifts the cap apex toward the labial side */
  labialShift: number;
  /** cap radial shaping exponents (small px = long flat incisal edge) */
  capPx: number;
  capPz: number;
  /** incisal corner rounding */
  edgeDrop: number;
  /** super-ellipse exponent: 2 = ellipse, higher = squarer */
  squareness: number;
  /** deterministic per-tooth variation */
  seed: number;
}

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const spow = (v: number, p: number) => Math.sign(v) * Math.pow(Math.abs(v), p);

// Enamel / dentin palette. THREE.Color converts sRGB hex to linear for us.
const C_ROOT = new THREE.Color('#cdbd9b');
const C_CERVICAL = new THREE.Color('#dcc9a0');
const C_BODY = new THREE.Color('#f3e9d3');
const C_MID = new THREE.Color('#f9f5ec');
const C_EDGE = new THREE.Color('#e4edf0');

export function buildToothGeometry(spec: ToothSpec, segT = 72, segS = 76): THREE.BufferGeometry {
  const cols = segT + 1;
  const rows = segS + 1;
  const positions = new Float32Array(cols * rows * 3);
  const colors = new Float32Array(cols * rows * 3);
  const uvs = new Float32Array(cols * rows * 2);

  const sRoot = 0.16;
  const sCrown = 0.8;
  const H = spec.height;
  const totalCrown = spec.height + spec.capHeight;
  const aMax = spec.width / 2;
  const bMax = spec.depth / 2;
  const shapeExp = 2 / spec.squareness;
  const edgeAmount = spec.kind === 'incisor' || spec.kind === 'canine' ? 1 : 0.35;
  const warmth = (hash(spec.seed) - 0.5) * 0.035;

  const wallA = (t: number) =>
    aMax *
    (spec.taper + (1 - spec.taper) * Math.pow(Math.sin((Math.PI / 2) * Math.min(1, t / spec.widest)), 0.75)) *
    (1 - spec.topNarrow * smooth(spec.widest, 1, t));
  const wallB = (t: number) =>
    bMax *
    (0.62 + 0.38 * Math.pow(Math.sin((Math.PI / 2) * Math.min(1, t / 0.4)), 0.8)) *
    (1 - spec.lingualTaper * smooth(0.45, 1, t));
  const wallZc = (t: number) => spec.labialAnchor * (bMax - wallB(t));

  const tmp = new THREE.Color();

  for (let j = 0; j < rows; j++) {
    const s = j / segS;
    for (let i = 0; i < cols; i++) {
      const theta = (i / segT) * TAU;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const ex = spow(cosT, shapeExp);
      const ez = spow(sinT, shapeExp);
      const asym = 1 + 0.035 * ex; // distal side a touch fuller than mesial

      let x: number;
      let y: number;
      let z: number;
      let region: 'root' | 'wall' | 'cap' = 'wall';
      let fissure = 1;

      if (s < sRoot) {
        region = 'root';
        const u = s / sRoot;
        const rf = Math.pow(u, 0.55);
        x = wallA(0) * rf * ex * 0.92;
        z = wallZc(0) + wallB(0) * rf * ez * 0.9;
        y = -spec.root * (1 - u);
      } else if (s <= sCrown) {
        const t = (s - sRoot) / (sCrown - sRoot);
        x = wallA(t) * ex * asym;
        z = wallZc(t) + wallB(t) * ez;
        y = t * H - spec.edgeDrop * H * Math.pow(Math.abs(ex * asym), 3) * smooth(0.7, 1, t);
      } else {
        region = 'cap';
        const rho = 1 - (s - sCrown) / (1 - sCrown);
        const aTop = wallA(1);
        const bTop = wallB(1);
        x = aTop * ex * asym * Math.pow(rho, spec.capPx);
        z = wallZc(1) + spec.labialShift * bTop * (1 - rho) + bTop * ez * Math.pow(rho, spec.capPz);
        const yRim = H - spec.edgeDrop * H * Math.pow(Math.abs(ex * asym), 3);
        let hc = 0;
        let yOverride: number | null = null;
        if (spec.kind === 'incisor') {
          // flat incisal ridge whose height depends on actual x, so no pole spike
          const xr = Math.abs(x) / Math.max(aTop, 0.001);
          const ripple = 0.5 + 0.5 * Math.cos((3 * Math.PI * x) / Math.max(aTop, 0.001));
          yOverride = H - spec.edgeDrop * H * Math.pow(xr, 3) + spec.capHeight * (1 - Math.pow(rho, 3)) + 0.012 * ripple * (1 - rho);
        } else if (spec.kind === 'canine') {
          hc = spec.capHeight * (1 - Math.pow(rho, 2.2)) * (1 + 0.1 * ex);
        } else {
          const prof = Math.exp(-Math.pow((rho - 0.6) / 0.32, 2)) * (1 - smooth(0.8, 1.0, rho));
          let full: number;
          if (spec.kind === 'premolar') {
            const A = 0.5 + 0.5 * Math.cos(2 * (theta - Math.PI / 2));
            const lingual = mix(0.78, 1, smooth(-0.3, 0.3, sinT));
            full = (0.3 + 0.7 * Math.pow(A, 1.2)) * lingual;
          } else {
            const A4 = 0.5 + 0.5 * Math.cos(4 * (theta - Math.PI / 4));
            full = 0.3 + 0.7 * Math.pow(A4, 1.1);
          }
          const modAmt = smooth(0.05, 0.5, rho);
          const mod = mix(1, full, modAmt);
          fissure = mix(1, full, modAmt);
          hc = spec.capHeight * prof * mod;
        }
        y = yOverride !== null ? yOverride : yRim + hc;
      }

      const idx = j * cols + i;
      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;
      uvs[idx * 2] = i / segT;
      uvs[idx * 2 + 1] = s;

      // ---- vertex colour: dentin-warm at the neck, enamel body, cool translucent edge
      if (y < 0) {
        tmp.copy(C_ROOT);
      } else {
        const yn = y / totalCrown;
        if (yn < 0.18) tmp.copy(C_CERVICAL).lerp(C_BODY, smooth(0, 0.18, yn));
        else if (yn < 0.7) tmp.copy(C_BODY).lerp(C_MID, smooth(0.18, 0.7, yn));
        else tmp.copy(C_MID).lerp(C_EDGE, smooth(0.78, 1.0, yn) * edgeAmount);
      }
      tmp.r += warmth;
      tmp.b -= warmth * 0.8;

      // baked contact shading: interproximal gaps, cervical shadow, fissures
      const yn2 = clamp(y / totalCrown);
      let ao = 1;
      ao -= 0.22 * smooth(0.55, 1.0, Math.abs(ex)) * (1 - smooth(0, 0.9, yn2));
      ao -= 0.14 * (1 - smooth(0, 0.15, yn2));
      if (region === 'cap') ao -= 0.18 * (1 - fissure);
      tmp.multiplyScalar(clamp(ao, 0.5, 1));

      colors[idx * 3] = tmp.r;
      colors[idx * 3 + 1] = tmp.g;
      colors[idx * 3 + 2] = tmp.b;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(gridIndices(rows, cols));
  geometry.computeVertexNormals();
  weldNormals(geometry, rows, cols, true);
  geometry.computeBoundingSphere();
  geometry.computeBoundingBox();
  return geometry;
}

/** Quad-grid triangle indices; winding chosen so normals face outward. */
export function gridIndices(rows: number, cols: number, flip = false): number[] {
  const indices: number[] = [];
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = (j + 1) * cols + i;
      const d = c + 1;
      if (flip) indices.push(a, b, c, b, d, c);
      else indices.push(a, c, b, b, c, d);
    }
  }
  return indices;
}

/**
 * computeVertexNormals leaves a lighting seam where the grid wraps and
 * at collapsed poles. Average those normals so the surface shades smoothly.
 */
export function weldNormals(geometry: THREE.BufferGeometry, rows: number, cols: number, poles: boolean) {
  const n = geometry.getAttribute('normal') as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let j = 0; j < rows; j++) {
    const a = j * cols;
    const b = a + cols - 1;
    v.set(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize();
    n.setXYZ(a, v.x, v.y, v.z);
    n.setXYZ(b, v.x, v.y, v.z);
  }
  if (poles) {
    for (const j of [0, rows - 1]) {
      v.set(0, 0, 0);
      for (let i = 0; i < cols; i++) v.add(new THREE.Vector3(n.getX(j * cols + i), n.getY(j * cols + i), n.getZ(j * cols + i)));
      v.normalize();
      for (let i = 0; i < cols; i++) n.setXYZ(j * cols + i, v.x, v.y, v.z);
    }
  }
  n.needsUpdate = true;
}

function hash(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* ------------------------------------------------------------------ */
/* Tooth catalogue (one half arch: midline outward)                    */
/* ------------------------------------------------------------------ */

const base = {
  taper: 0.68,
  widest: 0.76,
  topNarrow: 0.06,
  lingualTaper: 0.1,
  labialAnchor: 0.5,
  labialShift: 0.1,
  capPx: 1,
  capPz: 1,
  edgeDrop: 0,
  squareness: 2.6,
};

const incisor = {
  ...base,
  kind: 'incisor' as const,
  lingualTaper: 0.5,
  labialAnchor: 1,
  labialShift: 0.85,
  capPx: 0.25,
  edgeDrop: 0.09,
  squareness: 3.0,
};
const canine = {
  ...base,
  kind: 'canine' as const,
  lingualTaper: 0.28,
  labialAnchor: 0.8,
  labialShift: 0.35,
  squareness: 2.5,
  topNarrow: 0.14,
};
const premolar = { ...base, kind: 'premolar' as const, topNarrow: 0.12, squareness: 2.5 };
const molar = { ...base, kind: 'molar' as const, topNarrow: 0.16, taper: 0.74, widest: 0.62, squareness: 2.9 };

export const UPPER_TEETH: ToothSpec[] = [
  { ...incisor, id: 'u-central', width: 0.86, depth: 0.74, height: 1.0, capHeight: 0.06, root: 0.55, seed: 1 },
  { ...incisor, id: 'u-lateral', width: 0.66, depth: 0.64, height: 0.88, capHeight: 0.05, root: 0.54, seed: 2 },
  { ...canine, id: 'u-canine', width: 0.78, depth: 0.9, height: 0.74, capHeight: 0.32, root: 0.55, seed: 3 },
  { ...premolar, id: 'u-pm1', width: 0.72, depth: 0.94, height: 0.62, capHeight: 0.2, root: 0.54, seed: 4 },
  { ...premolar, id: 'u-pm2', width: 0.68, depth: 0.92, height: 0.6, capHeight: 0.19, root: 0.54, seed: 5 },
  { ...molar, id: 'u-m1', width: 1.06, depth: 1.12, height: 0.54, capHeight: 0.22, root: 0.50, seed: 6 },
  { ...molar, id: 'u-m2', width: 0.98, depth: 1.06, height: 0.5, capHeight: 0.2, root: 0.45, seed: 7 },
];

export const LOWER_TEETH: ToothSpec[] = [
  { ...incisor, id: 'l-central', width: 0.54, depth: 0.6, height: 0.9, capHeight: 0.04, root: 0.54, edgeDrop: 0.06, seed: 11 },
  { ...incisor, id: 'l-lateral', width: 0.6, depth: 0.64, height: 0.94, capHeight: 0.04, root: 0.54, edgeDrop: 0.07, seed: 12 },
  { ...canine, id: 'l-canine', width: 0.68, depth: 0.8, height: 0.76, capHeight: 0.3, root: 0.55, seed: 13 },
  { ...premolar, id: 'l-pm1', width: 0.7, depth: 0.8, height: 0.62, capHeight: 0.2, root: 0.50, seed: 14 },
  { ...premolar, id: 'l-pm2', width: 0.72, depth: 0.84, height: 0.6, capHeight: 0.2, root: 0.50, seed: 15 },
  { ...molar, id: 'l-m1', width: 1.12, depth: 1.02, height: 0.54, capHeight: 0.22, root: 0.50, seed: 16 },
  { ...molar, id: 'l-m2', width: 1.04, depth: 1.0, height: 0.5, capHeight: 0.2, root: 0.45, seed: 17 },
];
