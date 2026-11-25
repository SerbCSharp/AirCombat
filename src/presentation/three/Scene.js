import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#98e5fe");

    this.camera = new THREE.PerspectiveCamera(
      45,
      innerWidth / innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(0.1, 35, 0);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    const light = new THREE.DirectionalLight("#FFFFFF", 1.5);
    light.position.set(15, 40, 15);
    light.castShadow = true;
    // Расширяем границы камеры теней, чтобы накрыть всю доску 28x48
    const d = 30;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 100;
    // Повышаем четкость тени, чтобы не было "лесенок"
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    this.scene.add(new THREE.AmbientLight("#FFFFFF", 0.5), light);

    addEventListener("resize", () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  }

  add(obj) {
    this.scene.add(obj);
  }

  runAnimation() {
    const loop = () => {
      requestAnimationFrame(loop);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }
}
