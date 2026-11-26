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
      RED: new THREE.MeshPhysicalMaterial({
        color: 0xff4d4d,
        roughness: 0.25,
      }),
      BLUE: new THREE.MeshPhysicalMaterial({
        color: 0x4da6ff,
        roughness: 0.25,
      }),
    };
  }

  sync(units) {
    units.forEach((u) => {
      let mesh = this.meshes.get(u.id);
      if (!mesh) {
        mesh = this._createUnitMesh(u);
        mesh.position.set(u.worldPos.x, u.worldPos.y, u.worldPos.z);
        mesh.rotation.y = u.rotationY;
        this.meshes.set(u.id, mesh);
        this.group.add(mesh);
      }

      mesh.userData.targetPos = { ...u.worldPos };
      mesh.userData.targetRotY = u.rotationY;
    });

    return this.group;
  }

  update(dt) {
    const speed = 10;
    const alpha = 1 - Math.exp(-speed * dt);

    for (const mesh of this.meshes.values()) {
      const { targetPos, targetRotY } = mesh.userData;
      if (!targetPos) continue;

      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, targetPos.x, alpha);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetPos.y, alpha);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetPos.z, alpha);

      // Кратчайший угол разворота (без кручения через 360°)
      const deltaAngle = Math.atan2(
        Math.sin(targetRotY - mesh.rotation.y),
        Math.cos(targetRotY - mesh.rotation.y),
      );
      mesh.rotation.y += deltaAngle * alpha;
    }
  }

  _createUnitMesh(u) {
    const mesh = new THREE.Mesh(
      this.geometries[u.type],
      this.materials[u.team],
    );
    mesh.castShadow = true;
    mesh.userData.id = u.id;
    return mesh;
  }

  dispose() {
    Object.values(this.geometries).forEach((g) => g.dispose());
    Object.values(this.materials).forEach((m) => m.dispose());
    this.meshes.clear();
  }
}

