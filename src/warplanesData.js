import * as THREE from 'three';

export const PLANE_Z = 0.05;

const redSpecs = [
  // Крупные (scale: 1.5)
  ...[
    [30, 18],
    [30, 15],
    [30, 12],
    [33, 18],
    [33, 15],
    [33, 12],
  ].map((p) => ({ p, scale: 1.5 })),
  // Малые (scale: 1)
  ...[
    [33, -9],
    [30, -12],
    [30, -15],
    [30, -18],
    [33, -12],
    [33, -15],
    [33, -18],
    [36, -12],
    [36, -15],
    [36, -18],
  ].map((p) => ({ p, scale: 1 })),
];

export const INITIAL_AIRCRAFT = [
  ...redSpecs.map(({ p: [x, y], scale }, i) => ({
    id: i + 1,
    position: [x, y, PLANE_Z + scale * 0.5],
    color: "red",
    scale,
  })),
  ...redSpecs.map(({ p: [x, y], scale }, i) => ({
    id: i + 17,
    position: [-x, -y, PLANE_Z + scale * 0.5], // Зеркалим красных
    color: "blue",
    scale,
  })),
];

export const TEAM_MATERIALS = {
  red: new THREE.MeshStandardMaterial({ color: '#e63946' }),
  blue: new THREE.MeshStandardMaterial({ color: '#3a86ff' }),
};