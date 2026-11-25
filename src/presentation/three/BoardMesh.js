import * as THREE from "three";

export class BoardMesh {
  constructor() {
    this.group = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    this.planeTexture = textureLoader.load("./plane.jpg");
    this.planeTexture.colorSpace = THREE.SRGBColorSpace;
    this.planeTexture.anisotropy = 8;
    this.ground = null;
  }

  build({ width, height, step }) {
    if (this.ground) return this.group;

    const worldWidth = width * step;
    const worldHeight = height * step;

    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(worldWidth, worldHeight),
      new THREE.MeshStandardMaterial({
        map: this.planeTexture,
        roughness: 0.8,
      }),
    );
    this.ground.receiveShadow = true;
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.scale.set(1, 1.01, 1);
    this.ground.userData = { type: "BOARD" };
    this.group.add(this.ground);

    return this.group;
  }

  dispose() {
    if (this.ground) {
      this.ground.geometry.dispose();
      this.ground.material.dispose();
      this.group.remove(this.ground);
      this.ground = null;
    }
    this.planeTexture.dispose();
  }
}
