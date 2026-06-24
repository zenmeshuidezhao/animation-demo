import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const canvas = document.getElementById('canvas')

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setClearColor(0x000000)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

const tick = () => {
    controls.update()

    particles.rotation.y += 0.002

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()