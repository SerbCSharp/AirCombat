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
      RED_ACTIVE: new THREE.MeshPhysicalMaterial({
        color: 0xff4d4d,
        roughness: 0.25,
      }),
      RED_DONE: new THREE.MeshPhysicalMaterial({
        color: 0xff4d4d,
        roughness: 0.25,
        transparent: true,
        opacity: 0.55,
      }),
      BLUE_ACTIVE: new THREE.MeshPhysicalMaterial({
        color: 0x4da6ff,
        roughness: 0.25,
      }),
      BLUE_DONE: new THREE.MeshPhysicalMaterial({
        color: 0x4da6ff,
        roughness: 0.25,
        transparent: true,
        opacity: 0.55,
      }),
      SELECTED: new THREE.MeshPhysicalMaterial({
        color: 0xffeb3b,
        roughness: 0.2,
      }),
    };
  }

  sync(units) {
    const activeIds = new Set(units.map((u) => u.id));

    for (const [id, mesh] of this.meshes.entries()) {
      if (!activeIds.has(id)) mesh.visible = false;
    }

    units.forEach((u) => {
      let mesh = this.meshes.get(u.id);
      if (!mesh) {
        mesh = this._createUnitMesh(u);
        this.meshes.set(u.id, mesh);
        this.group.add(mesh);
      }

      mesh.visible = true;
      mesh.position.set(u.worldPos.x, u.worldPos.y, u.worldPos.z);
      mesh.rotation.y = u.rotationY;

      const matKey = u.isSelected
        ? "SELECTED"
        : `${u.team}_${u.canAct ? "ACTIVE" : "DONE"}`;

      if (mesh.material !== this.materials[matKey]) {
        mesh.material = this.materials[matKey];
      }
    });

    return this.group;
  }

  _createUnitMesh(u) {
    const mesh = new THREE.Mesh(
      this.geometries[u.type],
      this.materials[`${u.team}_ACTIVE`],
    );
    mesh.castShadow = true;
    mesh.userData = { type: "AIRCRAFT", id: u.id };
    return mesh;
  }

  dispose() {
    Object.values(this.geometries).forEach((g) => g.dispose());
    Object.values(this.materials).forEach((m) => m.dispose());
    this.meshes.clear();
  }
}
