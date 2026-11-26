import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#262b33");
    this.animationFrameId = null;

    this.camera = new THREE.PerspectiveCamera(
      42,
      innerWidth / innerHeight,
      0.1,
      500,
    );
    this.camera.position.set(7, 41, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2.35;
    this.controls.minDistance = 14;
    this.controls.maxDistance = 65;
    this.controls.target.set(0, 0, 0);

    this._setupLights();
    window.addEventListener("resize", this._onResize);
  }

  _setupLights() {
    const hemiLight = new THREE.HemisphereLight(0xfff8ee, 0x3b4252, 0.75);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff5e4, 1.8);
    dirLight.position.set(18, 36, 20);
    dirLight.castShadow = true;

    const frustum = 32;
    dirLight.shadow.camera.left = -frustum;
    dirLight.shadow.camera.right = frustum;
    dirLight.shadow.camera.top = frustum;
    dirLight.shadow.camera.bottom = -frustum;
    dirLight.shadow.camera.near = 5;
    dirLight.shadow.camera.far = 90;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.bias = -0.0005;

    this.scene.add(dirLight);
  }

  _onResize = () => {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  };

  add(obj) {
    this.scene.add(obj);
  }

  runAnimation(onTick) {
    let lastTime = performance.now();

    const loop = (now) => {
      this.animationFrameId = requestAnimationFrame(loop);
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      onTick?.(dt);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }


  dispose() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener("resize", this._onResize);
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
