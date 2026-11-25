import * as THREE from "three";

export class AircraftMesh {
  constructor() {
    this.group = new THREE.Group();
    this.meshes = new Map();

    this.geometries = {
      FIGHTER: new THREE.ConeGeometry(0.45, 1.3, 4).rotateX(Math.PI / 2),
      BOMBER: new THREE.ConeGeometry(0.6, 1.5, 4).rotateX(Math.PI / 2),
    };

    this.materials = {
      RED: new THREE.MeshPhysicalMaterial({ color: 0xff4d4d, roughness: 0.25 }),
      BLUE: new THREE.MeshPhysicalMaterial({
        color: 0x4da6ff,
        roughness: 0.25,
      }),
    };
  }

  build(units) {
    units.forEach((u) => {
      const mesh = new THREE.Mesh(
        this.geometries[u.type],
        this.materials[u.team],
      );

      mesh.rotation.y = u.rotationY;
      mesh.position.set(u.worldPos.x, u.worldPos.y, u.worldPos.z);
      mesh.castShadow = true;
      mesh.userData = { type: "AIRCRAFT", id: u.id };

      this.meshes.set(u.id, mesh);
      this.group.add(mesh);
    });

    return this.group;
  }
}
