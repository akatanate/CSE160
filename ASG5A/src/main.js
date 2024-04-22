// FIX LIGHTING 
//3d models / obj files (spaceship)

// AND ZOOM/CAMERA CONTROLS?

import * as THREE from 'three'; // load three.js

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Textures
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('img/sun.jpg');
const starsTexture = textureLoader.load('img/stars.jpg');
const mercuryTexture = textureLoader.load('img/mercury.jpg');
const saturnTexture = textureLoader.load('img/saturn.jpg');
const saturnRingTexture = textureLoader.load('img/saturn_ring.png');
const venusTexture = textureLoader.load('img/venus.jpg');
const earthTexture = textureLoader.load('img/earth.jpg');
const marsTexture = textureLoader.load('img/mars.jpg');
const jupiterTexture = textureLoader.load('img/jupiter.jpg');
const uranusTexture = textureLoader.load('img/uranus.jpg');
const uranusRingTexture = textureLoader.load('img/uranus_ring.png');
const neptuneTexture = textureLoader.load('img/neptune.jpg');

// Set renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(-90, 140, 140);
orbit.target.set(0, 0, 0);
orbit.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

//WHY NOT WORKING
const pointLight = new THREE.PointLight(0xffffff, 2, 300); 
pointLight.position.set(0, 0, 0); 

scene.add(pointLight);

// Set background texture
scene.background = starsTexture;

// make the star background more 3d
// const cubeTextureLoader = new THREE.CubeTextureLoader();

/*structuredClone.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);*/

// Credit on how to make a planet (I followed the first part of this tutorial): https://www.youtube.com/watch?v=XXzqSAt3UIw

// Create <SUN>---------------------------------------------------------
const sunGeometry = new THREE.SphereGeometry(16, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create <MERCURY>---------------------------------------------------------
const mercuryGeometry = new THREE.SphereGeometry(3.2, 32, 32);
const mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

const mercuryObj = new THREE.Object3D();
mercuryObj.add(mercury);
scene.add(mercuryObj)
mercury.position.x = 28;

// Create <VENUS>---------------------------------------------------------
const venusGeometry = new THREE.SphereGeometry(5.8, 32, 32);
const venusMaterial = new THREE.MeshBasicMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);

const venusObj = new THREE.Object3D();
venusObj.add(venus);
scene.add(venusObj)
venus.position.x = 44;

// Create <EARTH>---------------------------------------------------------
const earthGeometry = new THREE.SphereGeometry(6, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

const earthObj = new THREE.Object3D();
earthObj.add(earth);
scene.add(earthObj)
earth.position.x = 62;

// Create <MARS>---------------------------------------------------------
const marsGeometry = new THREE.SphereGeometry(4, 32, 32);
const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);

const marsObj = new THREE.Object3D();
marsObj.add(mars);
scene.add(marsObj)
mars.position.x = 78;

// Create <JUPITER>---------------------------------------------------------
const jupiterGeometry = new THREE.SphereGeometry(12, 32, 32);
const jupiterMaterial = new THREE.MeshBasicMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

const jupiterObj = new THREE.Object3D();
jupiterObj.add(jupiter);
scene.add(jupiterObj)
jupiter.position.x = 100;

// Create <SATURN>---------------------------------------------------------
const saturnGeometry = new THREE.SphereGeometry(10, 32, 32);
const saturnMaterial = new THREE.MeshBasicMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);

const saturnObj = new THREE.Object3D();
saturnObj.add(saturn);
scene.add(saturnObj)
saturn.position.x = 138;

// RING
const saturnRingGeo = new THREE.RingGeometry(10, 32, 32);
const saturnRingMat = new THREE.MeshBasicMaterial({ 
    map: saturnRingTexture,
    side: THREE.DoubleSide
});
const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
saturnObj.add(saturnRing);
saturnRing.position.x = 138;
saturnRing.rotation.x = -0.5 * Math.PI;

// Create <URANUS>---------------------------------------------------------
const uranusGeometry = new THREE.SphereGeometry(7, 32, 32);
const uranusMaterial = new THREE.MeshBasicMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);

const uranusObj = new THREE.Object3D();
uranusObj.add(uranus);
scene.add(uranusObj)
uranus.position.x = 176;

// RING
const uranusRingGeo = new THREE.RingGeometry(7, 12, 32);
const uranusRingMat = new THREE.MeshBasicMaterial({ 
    map: uranusRingTexture,
    side: THREE.DoubleSide
});
const uranusRing = new THREE.Mesh(uranusRingGeo, uranusRingMat);
uranusObj.add(uranusRing);
uranusRing.position.x = 176
uranusRing.rotation.x = -0.5 * Math.PI;

// Create <NEPTUNE>---------------------------------------------------------
const neptuneGeometry = new THREE.SphereGeometry(7, 32, 32);
const neptuneMaterial = new THREE.MeshBasicMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

const neptuneObj = new THREE.Object3D();
neptuneObj.add(neptune);
scene.add(neptuneObj)
neptune.position.x = 200;

/*const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);*/

// Animate
function animate() {
    //self-rotation
   /* sun.rotateY(0.004);
    mercury.rotateY(0.004);
    venus.rotateY(0.002);
    earth.rotateY(0.02);
    mars.rotateY(0.018);
    jupiter.rotateY(0.04);
    saturn.rotateY(0.038);
    uranus.rotateY(0.03);
    neptune.rotateY(0.032);
    
    // around sun
    mercuryObj.rotateY(0.04);
    venusObj.rotateY(0.015); 
    earthObj.rotateY(0.01);
    marsObj.rotateY(0.008);
    jupiterObj.rotateY(0.002);
    saturnObj.rotateY(0.0009);
    uranusObj.rotateY(0.0004);
    neptuneObj.rotateY(0.0001);*/
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// resize camera view
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});