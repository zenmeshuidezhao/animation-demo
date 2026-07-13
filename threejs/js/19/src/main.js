 import './style.css'
 import * as THREE from 'three'
 import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
 import GUI from 'lil-gui'
 import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

 const gui = new GUI()

 const canvas = document.querySelector('canvas.webgl')

 const scene = new THREE.Scene()

 const object1 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: 0xff0000 })
 )
 object1.position.x = - 2


 const object2 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: 0xff0000 })
 )

 const object3 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: 0xff0000 })
 )
 object3.position.x = 2

 scene.add(object1, object2, object3)

 // sizes
 const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// mouse
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
	mouse.x = (event.clientX / sizes.width) * 2 - 1
	mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

// Raycaster
const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// renderer
const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let model = null
const gltfLoader = new GLTFLoader()
gltfLoader.load(
	'/models/Duck/glTF-Binary/Duck.glb',
	(gltf) => {
		model = gltf.scene
		model.position.y = -1.5
		scene.add(model)
	}
)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const clock = new THREE.Clock()

let currentIntersect = null
const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	object1.position.y = Math.sin(elapsedTime * 1)
	object2.position.y = Math.sin(elapsedTime * 1.5)
	object3.position.y = Math.sin(elapsedTime * 2)

	raycaster.setFromCamera(mouse, camera)

	const objectsToTest = [object1, object2, object3]
	const intersects = raycaster.intersectObjects(objectsToTest)

	for(const object of objectsToTest) {
		object.material.color.set(0xff0000)
	}

	for(const intersect of intersects) {
		intersect.object.material.color.set(0x0000ff)
	}

	if (model) {
		const modelIntersect = raycaster.intersectObject(model)

		if (modelIntersect.length) {
			model.scale.set(1.5, 1.5, 1.5)
		} else {
			model.scale.set(1, 1, 1)
		}
	}

	controls.update()

	renderer.render(scene, camera)

	window.requestAnimationFrame(tick)
}

tick()
