import * as THREE from "three";

export class BoardMesh {
  constructor() {
    this.group = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    this.planeTexture = textureLoader.load("./plane.jpg");
    this.planeTexture.colorSpace = THREE.SRGBColorSpace;
    this.planeTexture.anisotropy = 8;
  }

  build({ width, height, step }) {
    const worldWidth = width * step;
    const worldHeight = height * step;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(worldWidth, worldHeight),
      new THREE.MeshStandardMaterial({
        map: this.planeTexture,
        roughness: 0.8,
      }),
    );
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    ground.scale.set(1, 1.01, 1);
    this.group.add(ground);

    return this.group;
  }
}
