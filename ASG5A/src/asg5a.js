import * as THREE from 'three'; // load three.js

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

function main() {
    // look up canvas that three.js will look up
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    //this is out camera 
	const fov = 75; //field of view
	const aspect = 2; // the canvas default
	const near = 0.1; //space in front of camera that will be rendered
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

// change camera control
    class MinMaxGUIHelper {

		constructor( obj, minProp, maxProp, minDif ) {

			this.obj = obj;
			this.minProp = minProp;
			this.maxProp = maxProp;
			this.minDif = minDif;

		}
		get min() {

			return this.obj[ this.minProp ];

		}
		set min( v ) {

			this.obj[ this.minProp ] = v;
			this.obj[ this.maxProp ] = Math.max( this.obj[ this.maxProp ], v + this.minDif );

		}
		get max() {

			return this.obj[ this.maxProp ];

		}
		set max( v ) {

			this.obj[ this.maxProp ] = v;
			this.min = this.min; // this will call the min setter

		}

	}

    function updateCamera() {

		camera.updateProjectionMatrix();

	}

	const gui = new GUI();
	gui.add( camera, 'fov', 1, 180 ).onChange( updateCamera );
	const minMaxGUIHelper = new MinMaxGUIHelper( camera, 'near', 'far', 0.1 );
	gui.add( minMaxGUIHelper, 'min', 0.1, 50, 0.1 ).name( 'near' ).onChange( updateCamera );
	gui.add( minMaxGUIHelper, 'max', 0.1, 50, 0.1 ).name( 'far' ).onChange( updateCamera );

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	const scene = new THREE.Scene(); //drawing a scene
    scene.background = new THREE.Color( 'black' );


    // import unique 3d object
    {
        const objLoader = new OBJLoader();
        objLoader.load('https://threejs.org/manual/examples/resources/models/windmill/windmill.obj', (root) => {
        scene.add(root);
        });
    }

    // add shadow/lighting
    {
        const color = 0xFFFFFF;
		const intensity = 3;
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.set( - 1, 2, 4 );
        scene.add( light );

    }

    // create boxGeometry which contains data for a box
	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

// Texture stuff here-------------------------------------------------------------------------->
    const loader = new THREE.TextureLoader();

    const texture = loader.load( 'wall.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;
// Texture stuff here-------------------------------------------------------------------------->

    function makeInstance( geometry, color, x){
        //create basic material and set its color
        // const material = new THREE.MeshPhongMaterial({color}); //OR -------------------------------------------------------------------------->
        const material = new THREE.MeshBasicMaterial( {
            map: texture // change to color
        } );

        // create a mesh- represents the combo of 3 things- geometry, material, position
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube ); //add mesh

        cube.position.x = x;

        return cube;
    }

    // make the cube objects
    const cubes = [
	    makeInstance( geometry, 0x44aa88, 0 ),
		makeInstance( geometry, 0x8844aa, - 2 ),
		makeInstance( geometry, 0xaa8844, 2 ),
    ];

    // render the movement
    function render( time ){
        time *= 0.001;

        cubes.forEach( ( cube, ndx ) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        } );

        renderer.render( scene, camera ); //render scene

        requestAnimationFrame( render );
    }

    requestAnimationFrame( render );
	
}

main();
