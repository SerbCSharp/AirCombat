import * as THREE from "three";

export class AircraftMesh {
  constructor() {
    this.group = new THREE.Group();
    this.meshes = new Map();

    // Создаем общие геометрии и материалы один раз
    this.geometries = {
      FIGHTER: new THREE.ConeGeometry(0.45, 1.3, 4).rotateX(Math.PI / 2),
      BOMBER: new THREE.ConeGeometry(0.6, 1.5, 4).rotateX(Math.PI / 2),
    };

    this.materials = {
      RED: new THREE.MeshStandardMaterial({ color: 0xff4d4d }),
      BLUE: new THREE.MeshStandardMaterial({ color: 0x4da6ff }),
    };
  }

  build(units) {
    units.forEach((u) => {
      const mesh = new THREE.Mesh(
        this.geometries[u.type],
        this.materials[u.team]
      );

      mesh.rotation.y = u.rotationY;
      mesh.position.set(u.x, 0.7, u.z);
      mesh.userData = { type: "AIRCRAFT", id: u.id };

      this.meshes.set(u.id, mesh);
      this.group.add(mesh);
    });

    return this.group;
  }
}
