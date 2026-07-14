import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import GUI from "lil-gui"

// loaders
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// debug
const gui = new GUI()
const debugObject = {
  envMapIntensity: 5
}

// canvas
const canvas = document.querySelector("canvas.webgl")

// scene
const scene = new THREE.Scene()

// update all materials
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate = true

      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

// environment map
const environmentMap = cubeTextureLoader.load([
  "/environmentMaps/0/px.png",
  "/environmentMaps/0/nx.png",
  "/environmentMaps/0/py.png",
  "/environmentMaps/0/ny.png",
  "/environmentMaps/0/pz.png",
  "/environmentMaps/0/nz.png",
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
// apply envMap to all objects/materials
scene.environment = environmentMap

// models
gltfLoader.load(
  "/models/FlightHelmet/glTF/FlightHelmet.gltf",
  (gltf) => {
    gltf.scene.scale.set(10, 10, 10)
    gltf.scene.position.set(0, -4, 0)
    gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    gui.add(gltf.scene.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01).name("rotation")

    updateAllMaterials()
  },
)

// lights
const directionalLight = new THREE.DirectionalLight("#ffffff", 3)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)

directionalLight.shadow.normalBias = 0.05

scene.add(directionalLight)

gui.add(directionalLight, "intensity").min(0).max(10).step(0.001).name("lightIntensity")
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001).name("lightX")
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001).name("lightY")
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001).name("lightZ")

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, -4)
scene.add(camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Liner: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping
}).onChange(() => {
  renderer.toneMapping = Number(renderer.toneMapping)
  updateAllMaterials()
})

gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001)

const tick = () => {
  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()
