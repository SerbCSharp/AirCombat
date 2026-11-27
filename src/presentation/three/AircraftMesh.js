import * as THREE from "three";

export class AircraftMesh {
  constructor() {
    this.group = new THREE.Group();
    this.meshes = new Map();
    this.pulseTime = 0;

    this.materials = {
      RED: new THREE.MeshPhysicalMaterial({
        color: 0xe53935,
        roughness: 0.3,
        metalness: 0.15,
      }),
      BLUE: new THREE.MeshPhysicalMaterial({
        color: 0x1e88e5,
        roughness: 0.3,
        metalness: 0.15,
      }),
      RED_SELECTED: new THREE.MeshPhysicalMaterial({
        color: 0xff6f60,
        emissive: 0xff1744,
        emissiveIntensity: 0.85,
        roughness: 0.2,
      }),
      BLUE_SELECTED: new THREE.MeshPhysicalMaterial({
        color: 0x6ab7ff,
        emissive: 0x00b0ff,
        emissiveIntensity: 0.85,
        roughness: 0.2,
      }),
      COCKPIT: new THREE.MeshPhysicalMaterial({
        color: 0x1c2530,
        roughness: 0.15,
        metalness: 0.6,
      }),
    };

    this.templates = {
      FIGHTER: this._buildFighterTemplate(),
      BOMBER: this._buildBomberTemplate(),
    };
  }

  sync(units) {
    const activeIds = new Set(units.map((u) => u.id));
    for (const [id, root] of this.meshes.entries()) {
      if (!activeIds.has(id)) {
        this.group.remove(root);
        this.meshes.delete(id);
      }
    }

    units.forEach((u) => {
      let root = this.meshes.get(u.id);
      if (!root) {
        root = this._createUnitMesh(u);
        root.position.set(u.worldPos.x, u.worldPos.y, u.worldPos.z);
        root.rotation.y = u.rotationY;
        this.meshes.set(u.id, root);
        this.group.add(root);
      }

      const matKey = u.isSelected ? `${u.team}_SELECTED` : u.team;
      const bodyMat = this.materials[matKey];
      root.traverse((child) => {
        if (child.isMesh && !child.userData.isCockpit) {
          child.material = bodyMat;
        }
      });

      root.userData.targetPos = { ...u.worldPos };
      root.userData.targetRotY = u.rotationY;
    });

    return this.group;
  }

  update(dt) {
    const speed = 10;
    const alpha = 1 - Math.exp(-speed * dt);

    this.pulseTime += dt * 4.5;
    const intensity = 0.75 + Math.sin(this.pulseTime) * 0.35;
    this.materials.RED_SELECTED.emissiveIntensity = intensity;
    this.materials.BLUE_SELECTED.emissiveIntensity = intensity;

    for (const root of this.meshes.values()) {
      const { targetPos, targetRotY } = root.userData;
      if (!targetPos) continue;

      root.position.x = THREE.MathUtils.lerp(root.position.x, targetPos.x, alpha);
      root.position.y = THREE.MathUtils.lerp(root.position.y, targetPos.y, alpha);
      root.position.z = THREE.MathUtils.lerp(root.position.z, targetPos.z, alpha);

      const deltaAngle = Math.atan2(
        Math.sin(targetRotY - root.rotation.y),
        Math.cos(targetRotY - root.rotation.y),
      );
      root.rotation.y += deltaAngle * alpha;
    }
  }

  _createUnitMesh(u) {
    const clone = this.templates[u.type].clone();
    clone.userData.id = u.id;
    return clone;
  }

  _buildFighterTemplate() {
    const root = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.14, 1.15, 10).rotateX(Math.PI / 2),
    );
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, 0.35, 10).rotateX(Math.PI / 2),
    );
    nose.position.z = 0.75;

    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 10, 8),
      this.materials.COCKPIT,
    );
    cockpit.scale.set(0.85, 0.7, 2.2);
    cockpit.position.set(0, 0.1, 0.18);
    cockpit.userData.isCockpit = true;

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.25);
    wingShape.lineTo(0.78, -0.22);
    wingShape.lineTo(0.78, -0.38);
    wingShape.lineTo(0, -0.18);
    wingShape.closePath();

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.04,
      bevelEnabled: false,
    }).rotateX(Math.PI / 2);

    const rightWing = new THREE.Mesh(wingGeo);
    rightWing.position.y = 0.02;

    const leftWing = new THREE.Mesh(wingGeo);
    leftWing.scale.x = -1;
    leftWing.position.y = 0.02;

    const tailH = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.22));
    tailH.position.set(0, 0.02, -0.48);

    const tailV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.24));
    tailV.position.set(0, 0.15, -0.46);

    root.add(body, nose, cockpit, rightWing, leftWing, tailH, tailV);
    root.traverse((c) => {
      if (c.isMesh) c.castShadow = true;
    });

    return root;
  }

  _buildBomberTemplate() {
    const root = new THREE.Group();

    // Широкий длинный фюзеляж
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 1.35, 12).rotateX(Math.PI / 2),
    );
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10));
    nose.scale.set(1, 0.9, 1.6);
    nose.position.z = 0.68;

    // Остекление носовой кабины штурмана
    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 10, 8),
      this.materials.COCKPIT,
    );
    canopy.scale.set(0.95, 0.75, 1.5);
    canopy.position.set(0, 0.09, 0.55);
    canopy.userData.isCockpit = true;

    // Широкие крылья с небольшой стреловидностью назад
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.3);
    wingShape.lineTo(0.95, 0.04);
    wingShape.lineTo(0.95, -0.26);
    wingShape.lineTo(0, -0.15);
    wingShape.closePath();

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.05,
      bevelEnabled: false,
    }).rotateX(Math.PI / 2);

    const rightWing = new THREE.Mesh(wingGeo);
    rightWing.position.y = 0.04;

    const leftWing = new THREE.Mesh(wingGeo);
    leftWing.scale.x = -1;
    leftWing.position.y = 0.04;

    // Две мотогондолы двигателей на крыльях
    const engineGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.44, 10).rotateX(
      Math.PI / 2,
    );
    const leftEngine = new THREE.Mesh(engineGeo);
    leftEngine.position.set(-0.45, 0.0, 0.08);

    const rightEngine = new THREE.Mesh(engineGeo);
    rightEngine.position.set(0.45, 0.0, 0.08);

    // Хвост с одинарным центральным килем
    const tailH = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.04, 0.25));
    tailH.position.set(0, 0.04, -0.58);

    const tailV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 0.3));
    tailV.position.set(0, 0.18, -0.56);

    root.add(
      body,
      nose,
      canopy,
      rightWing,
      leftWing,
      leftEngine,
      rightEngine,
      tailH,
      tailV,
    );
    root.traverse((c) => {
      if (c.isMesh) c.castShadow = true;
    });

    return root;
  }

  dispose() {
    Object.values(this.templates).forEach((tpl) => {
      tpl.traverse((c) => {
        if (c.isMesh) c.geometry.dispose();
      });
    });
    Object.values(this.materials).forEach((m) => m.dispose());
    this.meshes.clear();
  }
}

