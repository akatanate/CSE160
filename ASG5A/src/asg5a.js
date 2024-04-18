import * as THREE from 'three'; // load three.js

// import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

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

	const scene = new THREE.Scene(); //drawing a scene

  // import unique 3d object
  /*{
    const objLoader = new OBJLoader();
    objLoader.load('resources/grass/grass.obj', (root) => {
      scene.add(root);
    });
  }*/

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
