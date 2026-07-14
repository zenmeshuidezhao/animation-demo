import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import GUI from "lil-gui";

const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();

const gui = new GUI();

const global = {
  envMapIntensity: 1,
};

const canvas = document.querySelector("canvas.webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (!child.isMesh) return;

    // 单材质
    if (child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;
      child.material.needsUpdate = true;
    }

    // 多材质
    if (Array.isArray(child.material)) {
      child.material.forEach((material) => {
        if (material.isMeshStandardMaterial) {
          material.envMapIntensity = global.envMapIntensity;
          material.needsUpdate = true;
        }
      });
    }
  });
};

/**
 * Environment
 */

scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;
scene.environmentIntensity = 1;

gui
  .add(scene, "backgroundBlurriness")
  .min(0)
  .max(1)
  .step(0.01)
  .name("背景模糊");

gui
  .add(scene, "backgroundIntensity")
  .min(0)
  .max(10)
  .step(0.01)
  .name("背景强度");

gui
  .add(scene, "environmentIntensity")
  .min(0)
  .max(10)
  .step(0.01)
  .name("环境光强度");

gui
  .add(global, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.01)
  .name("物体反射强度")
  .onChange(updateAllMaterials);

/**
 * Cube Environment Map
 */

const environmentMap = cubeTextureLoader.load([
  "/environmentMaps/0/px.png",
  "/environmentMaps/0/nx.png",
  "/environmentMaps/0/py.png",
  "/environmentMaps/0/ny.png",
  "/environmentMaps/0/pz.png",
  "/environmentMaps/0/nz.png",
]);

environmentMap.colorSpace = THREE.SRGBColorSpace;

environmentMap.generateMipmaps = true;

environmentMap.minFilter = THREE.LinearMipmapLinearFilter;

environmentMap.magFilter = THREE.LinearFilter;

scene.environment = environmentMap;

scene.background = environmentMap;

/**
 * HDR Environment (可选)
 */

// rgbeLoader.load(
// 	'/environmentMaps/2/2k.hdr',
// 	(environmentMap)=>{
//
// 		environmentMap.mapping = THREE.EquirectangularReflectionMapping
//
// 		scene.environment = environmentMap
// 		scene.background = environmentMap
//
// 	}
// )

/**
 * Torus Knot
 */

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),

  new THREE.MeshStandardMaterial({
    color: "#aaaaaa",

    metalness: 1,

    roughness: 0.3,

    envMapIntensity: global.envMapIntensity,
  }),
);

torusKnot.position.x = -4;

scene.add(torusKnot);

/**
 * Flight Helmet
 */

gltfLoader.load(
  "/models/FlightHelmet/glTF/FlightHelmet.gltf",

  (gltf) => {
    gltf.scene.scale.set(8, 8, 8);

    gltf.scene.position.y = -3;

    scene.add(gltf.scene);

    // 查看模型材质
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log(child.name, child.material);
      }
    });

    updateAllMaterials();
  },
);

/**
 * Sizes
 */

const sizes = {
  width: window.innerWidth,

  height: window.innerHeight,
};

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  75,

  sizes.width / sizes.height,

  0.1,

  100,
);

camera.position.set(0, 0, 5);

scene.add(camera);

/**
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
 * Resize
 */

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;

  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;

  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Animation
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
