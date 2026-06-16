import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

/**
 * Debug
 */

const gui = new GUI();

/**
 * Base
 */
const canvas = document.querySelector('#canvas');

// Scene
const scene = new THREE.Scene();


// Textures
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('../static/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('../static/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('../static/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('../static/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('../static/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('../static/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('../static/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('../static/textures/matcaps/1.png');
const gradientTexture = textureLoader.load('../static/textures/gradients/5.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Objects
 */
// MeshBasic Material
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color('red');
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();

// MeshPhongMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// MeshToonMaterial
// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// MeshStandardMaterial
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// material.side = THREE.DoubleSide;

// gui.add(material, 'metalness').min(0).max(1).step(0.0001).name('metalness');
// gui.add(material, 'roughness').min(0).max(1).step(0.0001).name('roughness');

// MeshPhysicalMaterial
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 1;
material.roughness = 1;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = doorAlphaTexture;

material.side = THREE.DoubleSide;

gui.add(material, 'metalness').min(0).max(1).step(0.0001).name('metalness');
gui.add(material, 'roughness').min(0).max(1).step(0.0001).name('roughness');

// Clearcoat
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;

// gui.add(material, 'clearcoat').min(0).max(1).step(0.0001).name('clearcoat');
// gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001).name('clearcoatRoughness');

// sheen
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(0x1188ff);

// gui.add(material, 'sheen').min(0).max(1).step(0.0001).name('sheen');
// gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001).name('sheenRoughness');
// gui.addColor(material, 'sheenColor').name('sheenColor');

// Iridescene
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];

// gui.add(material, 'iridescence').min(0).max(1).step(0.0001).name('iridescence');
// gui.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001).name('iridescenceIOR');
// gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1).name('iridescenceThicknessRange0');
// gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1).name('iridescenceThicknessRange1');

// Transmission
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

gui.add(material, 'transmission').min(0).max(1).step(0.0001).name('transmission');
gui.add(material, 'ior').min(1).max(10).step(0.0001).name('ior');
gui.add(material, 'thickness').min(0).max(1).step(0.0001).name('thickness');

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 28), material);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

/**
 * Environment map 
*/
const rgbeLoader = new RGBELoader();
rgbeLoader.load('../static/textures/environmentMap/2k.hdr', (texture) => { 
    console.log(texture);
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update render
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

/*
* Controls
*/
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update Objects
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    //Update Controls
    controls.update();

    //Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();

