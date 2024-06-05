import * as THREE from 'three'; // load three.js

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

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
const asteroidTexture = textureLoader.load('img/asteroid.jpg');
const planeTexture = textureLoader.load('img/plane.jpg');
const moonTexture = textureLoader.load('img/moon.jpeg');
const jMoonTexture = textureLoader.load('img/jMoon.jpeg');
const nepMoonTexture = textureLoader.load('img/nepMoon.jpeg');

// For background music
var listener = new THREE.AudioListener();
var audio = new THREE.Audio(listener);
var audioLoader = new THREE.AudioLoader(); 

    audioLoader.load("interstellar.mp3", function(buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.setVolume(0.2);
        //audio.play();
    });

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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const color = 0xFFFFFF;
const intensity = 3;

const light = new THREE.DirectionalLight( color, intensity );
light.position.set( -5, 0, 0 );
scene.add( light );
scene.add( light.target );
light.castShadow = true

const light2 = new THREE.PointLight( 0x0000ff, 1000, 150 );
light2.position.set( 30, 32, 30 );
scene.add( light2 );
scene.add( light2.target );

// Set background texture
scene.background = starsTexture;

const loader = new THREE.TextureLoader();
const texture = loader.load(
    'img/stars.jpg',
  () => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
  });

// special objects (need to fix .mtl/texturing)
const mtlLoader = new MTLLoader();
mtlLoader.load( './uploads_files_869754_space_shuttle_obj_exp(1).mtl', ( mtl ) => {

    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials( mtl );
    objLoader.load( './ship.obj', ( root ) => {
        root.position.set(30,30,30);
        // root.scale = new THREE.Vector3(1000, 1000, 1000);
        //root.children[0].scale
        root.children[0].geometry.scale = new THREE.Vector3(10000, 10000, 10000);
        // root.children[1].geometry.scale = new THREE.Vector3(10000, 10000, 10000);
        root.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.map = planeTexture;
            }
        });
        scene.add( root );
        console.log("load finished",  root.children.length); //loading, but in context of scene have to find
    // root.getWorldPosition(),
    } );
} );

const mtlLoader2 = new MTLLoader();
mtlLoader2.load( './uploads_files_4462272_Astreoid-8.mtl', ( mtl ) => {

    mtl.preload();
    const objLoader2 = new OBJLoader();
    const objLoader3 = new OBJLoader();
    const objLoader4 = new OBJLoader();
    objLoader2.setMaterials( mtl );
    objLoader3.setMaterials( mtl );
    objLoader4.setMaterials( mtl );

    objLoader2.load( './uploads_files_4462272_Astreoid-8.obj', ( root ) => {
        root.position.set(30,30,30);
        root.children[0].geometry.scale = new THREE.Vector3(10000, 10000, 10000);
        root.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.map = asteroidTexture;
            }
        });
        scene.add( root );
        console.log("load finished",  root.children.length); //loading, but in context of scene have to find
    // root.getWorldPosition(),
    } );

    objLoader3.load( './uploads_files_4462272_Astreoid-8.obj', ( root ) => {
        root.position.set(20,25,30);
        root.children[0].geometry.scale = new THREE.Vector3(10000, 10000, 10000);
        root.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.map = asteroidTexture;
            }
        });
        scene.add( root );
        console.log("load finished",  root.children.length); //loading, but in context of scene have to find
    // root.getWorldPosition(),
    } );

    objLoader4.load( './uploads_files_4462272_Astreoid-8.obj', ( root ) => {
        root.position.set(10,20,30);
        root.children[0].geometry.scale = new THREE.Vector3(10000, 10000, 10000);
        root.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.map = asteroidTexture;
            }
        });
        scene.add( root );
        console.log("load finished",  root.children.length); //loading, but in context of scene have to find
    // root.getWorldPosition(),
    } );
} );



// Credit on how to make a planet (I followed the first part of this tutorial): https://www.youtube.com/watch?v=XXzqSAt3UIw

// Create <SUN>---------------------------------------------------------
const sunGeometry = new THREE.SphereGeometry(16, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
/*sun.position.x = 10;
sun.position.y = 100;
sun.position.z = 100;*/

// Create <MERCURY>---------------------------------------------------------
const mercuryGeometry = new THREE.SphereGeometry(3.2, 32, 32);
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

const mercuryObj = new THREE.Object3D();
mercuryObj.add(mercury);
scene.add(mercuryObj)
mercury.position.x = 28;

// Create <VENUS>---------------------------------------------------------
const venusGeometry = new THREE.SphereGeometry(5.8, 32, 32);
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);

const venusObj = new THREE.Object3D();
venusObj.add(venus);
scene.add(venusObj)
venus.position.x = 44;

// Create <EARTH>---------------------------------------------------------
const earthGeometry = new THREE.SphereGeometry(6, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

const earthObj = new THREE.Object3D();
earthObj.add(earth);
scene.add(earthObj)
earth.position.x = 62;
    // EARTH moon
    const eMoonGeometry = new THREE.SphereGeometry(1.5, 8, 8);
    const eMoonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const eMoon = new THREE.Mesh(eMoonGeometry, eMoonMaterial);

    const eMoonObj = new THREE.Object3D;
    eMoonObj.add(eMoon);
    earth.add(eMoonObj);
    eMoon.position.x = 10;
                
// Create <MARS>---------------------------------------------------------
const marsGeometry = new THREE.SphereGeometry(4, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial    ({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);

const marsObj = new THREE.Object3D();
marsObj.add(mars);
scene.add(marsObj)
mars.position.x = 78;
    // MARS moon
    const m1MoonGeometry = new THREE.SphereGeometry(1, 5, 5);
    const m1MoonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const m1Moon = new THREE.Mesh(m1MoonGeometry, m1MoonMaterial);

    const m1MoonObj = new THREE.Object3D;
    m1MoonObj.add(m1Moon);
    mars.add(m1MoonObj);
    m1Moon.position.x = 6;
    
    // MARS moon
    const m2MoonGeometry = new THREE.SphereGeometry(.75, 3, 3);
    const m2MoonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const m2Moon = new THREE.Mesh(m2MoonGeometry, m2MoonMaterial);

    const m2MoonObj = new THREE.Object3D;
    m2MoonObj.add(m2Moon);
    mars.add(m2MoonObj);
    m2Moon.position.x = - 6;

// Create <JUPITER>---------------------------------------------------------
const jupiterGeometry = new THREE.SphereGeometry(12, 32, 32);
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

const jupiterObj = new THREE.Object3D();
jupiterObj.add(jupiter);
scene.add(jupiterObj)
jupiter.position.x = 100;
    // JUPITER moon
    /*const j1MoonGeometry = new THREE.SphereGeometry(3, 25, 25);
    const j1MoonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const j1Moon = new THREE.Mesh(j1MoonGeometry, j1MoonMaterial);

    const j1MoonObj = new THREE.Object3D;
    j1MoonObj.add(j1Moon);
    jupiter.add(j1MoonObj);
    j1Moon.position.x = 20;
    
    const j2MoonGeometry = new THREE.SphereGeometry(3, 25, 25);
    const j2MoonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const j2Moon = new THREE.Mesh(j2MoonGeometry, j2MoonMaterial);

    const j2MoonObj = new THREE.Object3D;
    j2MoonObj.add(j2Moon);
    jupiter.add(j2MoonObj);
    j2Moon.position.x = - 20;

    const j3MoonGeometry = new THREE.SphereGeometry(3, 25, 25);
    const j3MoonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const j3Moon = new THREE.Mesh(j3MoonGeometry, j3MoonMaterial);

    const j3MoonObj = new THREE.Object3D;
    j3MoonObj.add(j3Moon);
    jupiter.add(j3MoonObj);
    j3Moon.position.x = - 10;*/

    const numMoons = 4; // Number of moons
    const radius = 15; // Radius of the orbit
    const tiltAngle = Math.PI / 6; // Tilt angle

    for (let i = 0; i < numMoons; i++) {
        // calculate position stats
        const angle = (Math.PI * 2) * (i / numMoons); 
        const x = radius * Math.cos(angle); 
        const y = radius * Math.sin(tiltAngle) * Math.sin(angle); 
        const z = radius * Math.cos(tiltAngle) * Math.sin(angle); 
        
        // set base
        const moonGeometry = new THREE.SphereGeometry(1.5, 10, 10);
        const moonMaterial = new THREE.MeshStandardMaterial({ map: jMoonTexture });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);

        // set 
        const moonObj = new THREE.Object3D();
        moonObj.position.set(x, y, z); // Set position relative to Jupiter
        moonObj.lookAt(jupiter.position); 
        moonObj.rotateY(angle + Math.PI / 2); 
        moonObj.add(moon);
        jupiter.add(moonObj);
    }

// Create <SATURN>---------------------------------------------------------
const saturnGeometry = new THREE.SphereGeometry(10, 32, 32);
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);

const saturnObj = new THREE.Object3D();
saturnObj.add(saturn);
scene.add(saturnObj)
saturn.position.x = 138;

// RING
const saturnRingGeo = new THREE.RingGeometry(10, 32, 32);
const saturnRingMat = new THREE.MeshStandardMaterial({ 
    map: saturnRingTexture,
    side: THREE.DoubleSide
});
const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
saturnObj.add(saturnRing);
saturnRing.position.x = 138;
saturnRing.rotation.x = -0.5 * Math.PI;

const SATnumMoons = 4; // Number of moons
const SATradius = 35; // Radius of the orbit
const SATtiltAngle = - Math.PI / 6; // Tilt angle

for (let i = 0; i < SATnumMoons; i++) {
    // calculate position stats
    const angle = (Math.PI * 2) * (i / SATnumMoons); 
    const x = SATradius * Math.cos(angle); 
    const y = SATradius * Math.sin(SATtiltAngle) * Math.sin(angle); 
    const z = SATradius * Math.cos(SATtiltAngle) * Math.sin(angle); 
    
    // set base
    const moonGeometry = new THREE.SphereGeometry(1.5, 10, 10);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: jMoonTexture });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // set 
    const moonObj = new THREE.Object3D();
    moonObj.position.set(x, y, z); // Set position relative to Jupiter
    moonObj.lookAt(saturn.position); 
    moonObj.rotateY(angle + Math.PI / 2); 
    moonObj.add(moon);
    saturn.add(moonObj);
}

// Create <URANUS>---------------------------------------------------------
const uranusGeometry = new THREE.SphereGeometry(7, 32, 32);
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);

const uranusObj = new THREE.Object3D();
uranusObj.add(uranus);
scene.add(uranusObj)
uranus.position.x = 176;

// RING
const uranusRingGeo = new THREE.RingGeometry(7, 12, 32);
const uranusRingMat = new THREE.MeshStandardMaterial({ 
    map: uranusRingTexture,
    side: THREE.DoubleSide
});
const uranusRing = new THREE.Mesh(uranusRingGeo, uranusRingMat);
uranusObj.add(uranusRing);
uranusRing.position.x = 176
uranusRing.rotation.x = -0.5 * Math.PI;

const URnumMoons = 4; // Number of moons
const URradius = 13; // Radius of the orbit
const URtiltAngle = Math.PI / 6; // Tilt angle

for (let i = 0; i < SATnumMoons; i++) {
    // calculate position stats
    const angle = (Math.PI * 2) * (i / URnumMoons); 
    const x = URradius * Math.cos(angle); 
    const y = URradius * Math.sin(URtiltAngle) * Math.sin(angle); 
    const z = URradius * Math.cos(URtiltAngle) * Math.sin(angle); 
    
    // set base
    const moonGeometry = new THREE.SphereGeometry(1, 5, 5);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // set 
    const moonObj = new THREE.Object3D();
    moonObj.position.set(x, y, z); // Set position relative to Jupiter
    moonObj.lookAt(uranus.position); 
    moonObj.rotateY(angle + Math.PI / 2); 
    moonObj.add(moon);
    uranus.add(moonObj);
}

// Create <NEPTUNE>---------------------------------------------------------
const neptuneGeometry = new THREE.SphereGeometry(7, 32, 32);
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

const neptuneObj = new THREE.Object3D();
neptuneObj.add(neptune);
scene.add(neptuneObj)
neptune.position.x = 200;

const NEPnumMoons = 3; // Number of moons
const NEPradius = 10; // Radius of the orbit
const NEPtiltAngle = - Math.PI / 6; // Tilt angle

for (let i = 0; i < NEPnumMoons; i++) {
    // calculate position stats
    const angle = (Math.PI * 2) * (i / NEPnumMoons); 
    const x = NEPradius * Math.cos(angle); 
    const y = NEPradius * Math.sin(NEPtiltAngle) * Math.sin(angle); 
    const z = NEPradius * Math.cos(NEPtiltAngle) * Math.sin(angle); 
    
    // set base
    const moonGeometry = new THREE.SphereGeometry(1, 5, 5);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: nepMoonTexture });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // set 
    const moonObj = new THREE.Object3D();
    moonObj.position.set(x, y, z); // Set position relative to Jupiter
    moonObj.lookAt(neptune.position); 
    moonObj.rotateY(angle + Math.PI / 2); 
    moonObj.add(moon);
    neptune.add(moonObj);
}


// Animate
function animate() {
    //self-rotation
    sun.rotateY(0.004);
    mercury.rotateY(0.004);
    venus.rotateY(0.002);
    earth.rotateY(0.02);
    mars.rotateY(0.018);
    jupiter.rotateY(0.04);
    saturn.rotateY(0.038);
    uranus.rotateY(0.03);
    neptune.rotateY(0.032);
    
    // around sun
    mercuryObj.rotateY(0.04); //0/04
    venusObj.rotateY(0.015); //0.015
    earthObj.rotateY(0.01); //0.01
    marsObj.rotateY(0.008); // 0.08
    jupiterObj.rotateY(0.002);
    saturnObj.rotateY(0.0009);
    uranusObj.rotateY(0.0004);
    neptuneObj.rotateY(0.0001);
    
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// resize camera view
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});