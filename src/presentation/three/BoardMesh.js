import * as THREE from "three";

export class BoardMesh {
  constructor() {
    this.group = new THREE.Group();
  }

  build({ width, height, step }) {
    const worldWidth = width * step;
    const worldHeight = height * step;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(worldWidth, worldHeight, width, height),
      new THREE.MeshStandardMaterial({ color: 0x558b2f, wireframe: true })
    );
    ground.rotation.x = -Math.PI / 2;
    this.group.add(ground);

    return this.group;
  }
}