import * as THREE from 'three';
import { gridIndices, weldNormals, type ToothSpec } from './tooth-geometry';

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const spow = (v: number, p: number) => Math.sign(v) * Math.pow(Math.abs(v), p);

export interface ArchSample {
  x: number;
  z: number;
  /** unit tangent (towards the back of the mouth) */
  tx: number;
  tz: number;
}

export interface ArchTooth {
  spec: ToothSpec;
  rank: number;
  x: number;
  z: number;
  rotY: number;
  /** arc-length centre and width, used for gum festoons */
  arc: number;
  w: number;
}

export interface ArchLayout {
  teeth: ArchTooth[];
  total: number;
  sample: (s: number) => ArchSample;
}

/**
 * Lays one half arch along a super-ellipse, spacing teeth by arc length so
 * they just touch. Origin is the front midline; the arch runs toward -z.
 */
export function layoutArch(specs: ToothSpec[], ratio = 1.55, n = 2.5): ArchLayout {
  const total = specs.reduce((sum, s) => sum + s.width, 0);
  const M = 600;
  const pts: { x: number; z: number; l: number }[] = [];
  let len = 0;
  for (let m = 0; m <= M; m++) {
    const phi = (m / M) * (Math.PI / 2);
    const x = spow(Math.sin(phi), 2 / n);
    const z = ratio * spow(Math.cos(phi), 2 / n) - ratio;
    if (m > 0) len += Math.hypot(x - pts[m - 1].x, z - pts[m - 1].z);
    pts.push({ x, z, l: len });
  }
  const k = total / len;

  const sample = (sIn: number): ArchSample => {
    const s = Math.max(0, sIn);
    const target = s / k;
    if (target >= len) {
      const e = pts[M];
      const p = pts[M - 1];
      const d = Math.hypot(e.x - p.x, e.z - p.z) || 1;
      const tx = (e.x - p.x) / d;
      const tz = (e.z - p.z) / d;
      const extra = s - total;
      return { x: e.x * k + tx * extra, z: e.z * k + tz * extra, tx, tz };
    }
    let lo = 0;
    let hi = M;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (pts[mid].l <= target) lo = mid;
      else hi = mid;
    }
    const a = pts[lo];
    const b = pts[hi];
    const f = (target - a.l) / Math.max(b.l - a.l, 1e-9);
    const d = Math.hypot(b.x - a.x, b.z - a.z) || 1;
    return {
      x: mix(a.x, b.x, f) * k,
      z: mix(a.z, b.z, f) * k,
      tx: (b.x - a.x) / d,
      tz: (b.z - a.z) / d,
    };
  };

  let cursor = 0;
  const teeth: ArchTooth[] = specs.map((spec, rank) => {
    const arc = cursor + spec.width / 2;
    cursor += spec.width;
    const p = sample(arc);
    return { spec, rank, x: p.x, z: p.z, rotY: Math.atan2(-p.tz, p.tx), arc, w: spec.width };
  });

  return { teeth, total, sample };
}

/* ------------------------------------------------------------------ */
/* Gum                                                                 */
/* ------------------------------------------------------------------ */

const G_MARGIN = new THREE.Color('#f2aeb1');
const G_ATTACHED = new THREE.Color('#e98f98');
const G_DEEP = new THREE.Color('#c25566');
const G_BASE = new THREE.Color('#a63f55');

/**
 * Sweeps a rounded cross-section along the whole horseshoe. The top edge
 * rises into papillae between teeth, which gives the scalloped gum line.
 */
export function buildGumGeometry(layout: ArchLayout) {
  const { total, teeth, sample } = layout;
  const ext = 0.75;
  const halfLen = total + ext;
  const N = 420;
  const M = 64;
  const rows = N + 1;
  const cols = M + 1;
  const papilla = 0.3;
  const marginY = 0.05;
  const bottom = -1.0;
  const halfWidth = 0.8;
  const nq = 3.2;
  const qCenter = 0.06;

  const festoon = (sAbs: number) => {
    if (sAbs > total) return papilla * 0.18;
    for (const t of teeth) {
      if (sAbs <= t.arc + t.w / 2 + 1e-6) {
        const u = (sAbs - t.arc) / (t.w / 2);
        return papilla * Math.pow(Math.abs(u), 2.3);
      }
    }
    return papilla * 0.18;
  };

  const positions = new Float32Array(rows * cols * 3);
  const colors = new Float32Array(rows * cols * 3);
  const uvs = new Float32Array(rows * cols * 2);
  const c = new THREE.Color();

  for (let r = 0; r < rows; r++) {
    const s = -halfLen + (r / N) * halfLen * 2;
    const sAbs = Math.abs(s);
    const side = s < 0 ? -1 : 1;
    const p = sample(sAbs);
    const px = side * p.x;
    const pz = p.z;
    // outward normal (mirrored on the left side)
    const nx = side * -p.tz;
    const nz = p.tx;

    const endT = sAbs > total ? Math.sqrt(Math.max(0, 1 - Math.pow((sAbs - total) / ext, 2))) : 1;
    const top = marginY + festoon(sAbs);
    const yc = (top + bottom) / 2;
    const hr = (top - bottom) / 2;

    for (let m = 0; m < cols; m++) {
      const a = (m / M) * TAU;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const qn = spow(ca, 2 / nq);
      const yn = spow(sa, 2 / nq);
      const q = qCenter + halfWidth * qn * endT;
      const yy = yc + hr * yn * endT;

      const idx = r * cols + m;
      positions[idx * 3] = px + nx * q;
      positions[idx * 3 + 1] = yy;
      positions[idx * 3 + 2] = pz + nz * q;
      uvs[idx * 2] = sAbs * 0.5 * side + 40;
      uvs[idx * 2 + 1] = (m / M) * 2;

      // colour by depth below the gum margin: pale margin → attached gum → deep mucosa
      const depth = clamp((top - yy) / (top - bottom));
      c.copy(G_MARGIN)
        .lerp(G_ATTACHED, smooth(0.0, 0.12, depth))
        .lerp(G_DEEP, smooth(0.2, 0.6, depth))
        .lerp(G_BASE, smooth(0.65, 1, depth));
      // contact shadow where teeth emerge from the gum
      const around = Math.abs(q - qCenter);
      const crevice = Math.exp(-Math.pow((Math.abs(q) - 0.42) / 0.16, 2)) * smooth(0.55, 0.0, depth) * (sa > 0 ? 1 : 0);
      c.multiplyScalar(1 - 0.32 * crevice - 0.0 * around);
      colors[idx * 3] = c.r;
      colors[idx * 3 + 1] = c.g;
      colors[idx * 3 + 2] = c.b;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(gridIndices(rows, cols, false));
  geometry.computeVertexNormals();
  weldNormals(geometry, rows, cols, false);
  // weld the pinched ends
  const n = geometry.getAttribute('normal') as THREE.BufferAttribute;
  for (const r of [0, rows - 1]) {
    const v = new THREE.Vector3();
    for (let m = 0; m < cols; m++) v.add(new THREE.Vector3(n.getX(r * cols + m), n.getY(r * cols + m), n.getZ(r * cols + m)));
    v.normalize();
    for (let m = 0; m < cols; m++) n.setXYZ(r * cols + m, v.x, v.y, v.z);
  }
  geometry.computeBoundingSphere();
  return geometry;
}
