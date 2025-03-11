import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import mainVertexShader from './shaders/vertex.glsl';
import mainFragmentShader from './shaders/fragment.glsl';

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();

const texture = new THREE.TextureLoader().load( '/textures/plane.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;
texture.anisotropy = 8

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 40);
camera.lookAt(scene.position);

const axes = new THREE.AxesHelper(5);
scene.add(axes);

// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// directionalLight.position.set(5, 5, 15)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.camera.far = 30;
// directionalLight.shadow.camera.top = 15;
// directionalLight.shadow.camera.right = 25;
// directionalLight.shadow.camera.bottom = - 15;
// directionalLight.shadow.camera.left = - 25;
// scene.add(directionalLight);

const planeGeometry = new THREE.PlaneGeometry(28.2,48.6);
//const planeMaterial = new THREE.MeshStandardMaterial( { map: texture } );
const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: mainVertexShader,
    fragmentShader: mainFragmentShader,
    uniforms:
    {
        uTexture: new THREE.Uniform(texture)
    }
})
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.position.set(0, 0, 0);
plane.rotation.z = -0.5*Math.PI;
//plane.receiveShadow = true
scene.add( plane );

// const cubeGeometry = new THREE.BoxGeometry(2, 1, 0.5);
// const cubeMaterialBlue = new THREE.MeshStandardMaterial({ color: '#0000ff' });
// const cubeBlue = new THREE.Mesh(cubeGeometry, cubeMaterialBlue);
// cubeBlue.position.set(1, 1, 0.6);
// cubeBlue.castShadow = true
// scene.add(cubeBlue);

// const cubeMaterialRed = new THREE.MeshStandardMaterial({ color: '#ff0000' });
// const cubeRed = new THREE.Mesh(cubeGeometry, cubeMaterialRed);
// cubeRed.position.set(15, 7, 0.6);
// cubeRed.castShadow = true
// scene.add(cubeRed);

const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true

// const raycaster = new THREE.Raycaster();
// const aircraft = [cubeBlue, cubeRed];
// let currentIntersect = null
// const mouse = new THREE.Vector2();
// window.addEventListener('mousemove', (event) =>
//     {
//         mouse.x = event.clientX / window.innerWidth * 2 - 1
//         mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
//     })

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // raycaster.setFromCamera(mouse, camera);
    // const intersects = raycaster.intersectObjects(aircraft)
    // if(intersects.length)   
    //     currentIntersect = intersects[0] 
    // else
    //     currentIntersect = null

    orbitControls.update();
    renderer.render( scene, camera );
    window.requestAnimationFrame(tick)
}

tick();