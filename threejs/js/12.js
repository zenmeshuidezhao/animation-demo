import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const gui = new GUI()
const canvas = document.querySelector('#canvas')

const scene = new THREE.Scene()

const material = new THREE.MeshStandardMaterial()
gui.add(material, 'metalness').min(0).max(1).step(0.01).name('Metalness')
gui.add(material, 'roughness').min(0).max(1).step(0.01).name('Roughness')

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true
scene.add(sphere)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
plane.receiveShadow = true
scene.add(plane)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('Ambient Light Intensity')

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
//directionalLight.shadow.radius = 10
scene.add(directionalLight)

const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightHelper)

gui.add(directionalLightHelper, 'visible')
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name('Directional Light Intensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.01).name('Directional Light X')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.01).name('Directional Light Y')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.01).name('Directional Light Z')

const spotLight = new THREE.SpotLight(0xffffff, 0.5, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightHelper)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 2)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper(2)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

const tick = () => { 
    controls.update();
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()