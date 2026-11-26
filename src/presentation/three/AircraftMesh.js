import * as THREE from "three";

export class AircraftMesh {
  constructor() {
    this.group = new THREE.Group();
    this.meshes = new Map();
    this.pulseTime = 0;

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
      RED_SELECTED: new THREE.MeshPhysicalMaterial({
        color: 0xff7070,
        emissive: 0xff1744,
        emissiveIntensity: 0.85,
        roughness: 0.15,
      }),
      BLUE_SELECTED: new THREE.MeshPhysicalMaterial({
        color: 0x70b8ff,
        emissive: 0x00b0ff,
        emissiveIntensity: 0.85,
        roughness: 0.15,
      }),
    };
  }

  sync(units) {
    const activeIds = new Set(units.map((u) => u.id));
    for (const [id, mesh] of this.meshes.entries()) {
      if (!activeIds.has(id)) {
        this.group.remove(mesh);
        this.meshes.delete(id);
      }
    }

    units.forEach((u) => {
      let mesh = this.meshes.get(u.id);
      if (!mesh) {
        mesh = this._createUnitMesh(u);
        mesh.position.set(u.worldPos.x, u.worldPos.y, u.worldPos.z);
        mesh.rotation.y = u.rotationY;
        this.meshes.set(u.id, mesh);
        this.group.add(mesh);
      }

      const matKey = u.isSelected ? `${u.team}_SELECTED` : u.team;
      mesh.material = this.materials[matKey];

      mesh.userData.targetPos = { ...u.worldPos };
      mesh.userData.targetRotY = u.rotationY;
    });

    return this.group;
  }

  update(dt) {
    const speed = 10;
    const alpha = 1 - Math.exp(-speed * dt);

    // Плавная пульсация свечения выбранного самолёта
    this.pulseTime += dt * 4.5;
    const intensity = 0.75 + Math.sin(this.pulseTime) * 0.35;
    this.materials.RED_SELECTED.emissiveIntensity = intensity;
    this.materials.BLUE_SELECTED.emissiveIntensity = intensity;

    for (const mesh of this.meshes.values()) {
      const { targetPos, targetRotY } = mesh.userData;
      if (!targetPos) continue;

      mesh.position.x = THREE.MathUtils.lerp(
        mesh.position.x,
        targetPos.x,
        alpha,
      );
      mesh.position.y = THREE.MathUtils.lerp(
        mesh.position.y,
        targetPos.y,
        alpha,
      );
      mesh.position.z = THREE.MathUtils.lerp(
        mesh.position.z,
        targetPos.z,
        alpha,
      );

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
