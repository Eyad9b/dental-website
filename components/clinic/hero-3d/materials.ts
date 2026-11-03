import * as THREE from 'three';

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Fine horizontal growth lines (perikymata) plus soft mottling for enamel. */
function enamelBump() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const rnd = seeded(7);
  ctx.fillStyle = 'rgb(128,128,128)';
  ctx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 3) {
    const v = 128 + (rnd() - 0.5) * 46;
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, y, size, 1 + Math.floor(rnd() * 2));
  }
  for (let i = 0; i < 900; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = 6 + rnd() * 22;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const v = rnd() > 0.5 ? 255 : 0;
    g.addColorStop(0, `rgba(${v},${v},${v},0.05)`);
    g.addColorStop(1, `rgba(${v},${v},${v},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  tex.anisotropy = 4;
  return tex;
}

/** Orange-peel stippling of attached gingiva. */
function gumBump() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const rnd = seeded(23);
  ctx.fillStyle = 'rgb(150,150,150)';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = 1.2 + rnd() * 2.2;
    for (const [ox, oy] of [[0, 0], [size, 0], [-size, 0], [0, size], [0, -size]]) {
      const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r);
      g.addColorStop(0, 'rgba(255,255,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x + ox - r, y + oy - r, r * 2, r * 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.4, 1.4);
  tex.anisotropy = 4;
  return tex;
}

export function createEnamelMaterial() {
  return new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.3,
    metalness: 0,
    ior: 1.6,
    specularIntensity: 0.85,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
    // cool grazing-angle tint approximates enamel translucency
    sheen: 0.7,
    sheenRoughness: 0.45,
    sheenColor: new THREE.Color('#9fd3e6'),
    bumpMap: enamelBump(),
    bumpScale: 0.35,
    envMapIntensity: 1.15,
  });
}

export function createGumMaterial() {
  return new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.46,
    metalness: 0,
    clearcoat: 0.75,
    clearcoatRoughness: 0.32,
    sheen: 0.6,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color('#ff9fb0'),
    // faint warm glow stands in for subsurface scattering in wet tissue
    emissive: new THREE.Color('#7a1d33'),
    emissiveIntensity: 0.12,
    bumpMap: gumBump(),
    bumpScale: 0.5,
    envMapIntensity: 0.85,
  });
}
